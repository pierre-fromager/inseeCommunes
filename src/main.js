/* eslint no-unused-expressions: "off" */
/* eslint no-console: "off" */

const mongoClient = require('mongodb').MongoClient;
const Config = require('./lib/Config');
const Display = require('./lib/Display');
const Profiler = require('./lib/Profiler');
const Model = require('./lib/Model');

const profiling = new Profiler();
profiling.init();

mongoClient.connect(Config.dsn, Config.clientOptions, (err, client) => {
  if (err) throw err;
  const db = client.db(Config.db);
  const coll = db.collection(Config.collection);
  const communesFilter = { 'Altitude Moyenne': { $lt: 1000 } };
  Model.setProfiler(profiling);
  Model.distinctDepartements(coll, communesFilter).then((departementsCodes) => {
    departementsCodes.sort();
    Model.popDensities(coll, departementsCodes).then((poolResult) => {
      poolResult.forEach(result => Display.showResult(result));
      profiling.show(Display.stdoutLn);
      profiling.add('end');
      profiling.total(Display.stdoutLn);
      client.close();
    });
  });
});
