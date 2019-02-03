/* eslint no-unused-expressions: "off" */
/* eslint no-console: "off" */
const mongoClient = require('mongodb').MongoClient;

const host = 'localhost';
const port = 27017;
const login = 'pierre';
const password = 'pierre';
const credentials = `${login}:${password}@`;
const activeDb = 'insee';
const activeCollection = 'communes';
const dsn = `mongodb://${credentials}${host}:${port}`;

const stdoutLn = (content) => {
  process.stdout.write(`${content}\n`);
};

const aggregateDistinctQuery = (match = {}, groupCountSumCol = '_id') => [
  { $match: match },
  { $group: { _id: null, uniqueValues: { $addToSet: groupCountSumCol } } },
];

const aggregateSumQuery = (match = {}, groupCountSumCol = '_id') => [
  { $match: match },
  { $group: { _id: null, count: { $sum: groupCountSumCol } } },
];

const processAggregate = (collection, query, returnedMember = 'count') => new Promise((resolve, reject) => {
  collection.aggregate(query).toArray((err, data) => {
    (err) ? reject(err) : resolve(data[0][returnedMember]);
  });
});

const popDensity = (collection, departementCode) => {
  const agQuery = aggregateSumQuery({ 'Code Département': departementCode }, '$Superficie');
  const procSuperficie = processAggregate(collection, agQuery);
  agQuery[1].$group.count.$sum = '$Population';
  const procPopulation = processAggregate(collection, agQuery);
  const showDeptCode = dptcode => new Promise(resolve => resolve(dptcode));
  const promisesPool = [procPopulation, procSuperficie, showDeptCode(departementCode)];
  return Promise.all(promisesPool);
};

const displayResult = (result) => {
  const people = result[0] * 1000;
  const area = result[1] / 100;
  const densityPm = Math.round((people / area) * 100) / 100;
  const deptCode = result[2];
  stdoutLn(`Dept N°${deptCode} has ${people} people spread over ${area}Km2, density is ${densityPm}.`);
};

const mongoClientOptions = {
  useNewUrlParser: true,
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
};

mongoClient.connect(dsn, mongoClientOptions, (err, client) => {
  if (err) throw err;
  const db = client.db(activeDb);
  const col = db.collection(activeCollection);
  const communesFilter = {'Altitude Moyenne':{'$lt' : 10}};
  const agDeptCodesQuery = aggregateDistinctQuery(communesFilter, '$Code Département', 'uniqueValues');
  const distinctDepartements = processAggregate(col, agDeptCodesQuery, 'uniqueValues');
  const densityPromisePool = [];
  distinctDepartements.then((departementsCodes) => {
    departementsCodes.sort();
    departementsCodes.forEach((code) => {
      densityPromisePool.push(popDensity(col, code));
    });
    Promise.all(densityPromisePool).then((poolResult) => {
      poolResult.forEach(result => displayResult(result));
      client.close();
    });
  });
});
