/* eslint no-unused-expressions: "off" */
/* eslint no-console: "off" */

const mongoClient = require('mongodb').MongoClient;
const Config = require('./Config');
const Display = require('./Display');
const Profiler = require('./Profiler');
const Model = require('./Model');

const profiling = new Profiler();
profiling.init();

mongoClient.connect(Config.dsn, Config.clientOptions, (err, client) => {
  if (err) throw err;
  const db = client.db(Config.db);
  const collection = db.collection(Config.collection);
  const communesFilter = { 'Altitude Moyenne': { $lt: 1000 } };
  Model.setProfiler(profiling);
  Model.distinctDepartements(collection, communesFilter).then((departementsCodes) => {
    departementsCodes.sort();
    const densityPromisePool = [];
    departementsCodes.forEach((code) => {
      densityPromisePool.push(Model.popDensity(collection, code));
    });
    Promise.all(densityPromisePool).then((poolResult) => {
      poolResult.forEach(result => Display.showResult(result));
      profiling.show(Display.stdoutLn);
      profiling.add('end');
      profiling.total(Display.stdoutLn);
      client.close();
    });
  });
});
