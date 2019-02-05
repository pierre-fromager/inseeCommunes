/* eslint no-unused-expressions: "off" */
const Query = require('./Query');

class Model {
  static processAggregate(collection, query, returnedMember = 'count') {
    return new Promise((resolve, reject) => {
      collection.aggregate(query).toArray((err, data) => {
        (err) ? reject(err) : resolve(data[0][returnedMember]);
      });
    });
  }

  static popDensity(collection, departementCode) {
    this.profiler.add(`Δt N°${departementCode}`);
    const agQuery = Query.aggregateSumQuery({ 'Code Département': departementCode }, '$Superficie');
    const procSuperficie = this.processAggregate(collection, agQuery);
    agQuery[1].$group.count.$sum = '$Population';
    const procPopulation = this.processAggregate(collection, agQuery);
    const showDeptCode = dptcode => new Promise(resolve => resolve(dptcode));
    const promisesPool = [procPopulation, procSuperficie, showDeptCode(departementCode)];
    return Promise.all(promisesPool);
  }

  static distinctDepartements(collection, match = {}) {
    const agDeptCodesQuery = Query.aggregateDistinctQuery(match, '$Code Département', 'uniqueValues');
    return this.processAggregate(collection, agDeptCodesQuery, 'uniqueValues');
  }

  static setProfiler(profiler) {
    this.profiler = profiler;
  }
}

module.exports = Model;
