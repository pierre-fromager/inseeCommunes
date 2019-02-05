class Query {
  static aggregateDistinctQuery(match = {}, groupCountSumCol = '_id') {
    return [
      { $match: match },
      { $group: { _id: null, uniqueValues: { $addToSet: groupCountSumCol } } },
    ];
  }

  static aggregateSumQuery(match = {}, groupCountSumCol = '_id') {
    return [
      { $match: match },
      { $group: { _id: null, count: { $sum: groupCountSumCol } } },
    ];
  }
}

module.exports = Query;
