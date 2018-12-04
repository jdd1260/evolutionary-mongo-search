const _ = require('lodash');

const executeQuery = require('./query');
const getCollection = require('./get-collection');
const relevanceMin = require('../config.json').evaluation.relevanceMin;

function precision(resultIds, relevantIds) {
  const numRelevant = _.intersection(resultIds, relevantIds).length;
  return numRelevant / resultIds.length;
}

function recall(resultIds, relevantIds) {
  const numRelevant = _.intersection(resultIds, relevantIds).length;
  return numRelevant / relevantIds.length;
}

function f1(resultIds, relevantIds) {
  const p = precision(resultIds, relevantIds);
  const r = recall(resultIds, relevantIds);
  if (p === 0 && r === 0) {
    return 0;
  }
  return (2 * p * r) / (p + r);
}

module.exports = async function(isTraining = true) {
  const [queriesCollection, labelsCollection] = await Promise.all([
    getCollection(isTraining ? 'trainingQueries' : 'testingQueries'),
    getCollection(isTraining ? 'trainingLabels' : 'testingLabels'),
  ]);
  const queries = await queriesCollection.find().toArray();
  const f1Results = [];
  for (const index in queries) {
    const { id, query } = queries[index];
    const results = await executeQuery(query);
    const labels = await labelsCollection.find({ "queryId": id }).toArray();
    const resultIds = results.map(r => r.DOCNO);
    const relevantIds = labels.filter(r => Number(r.relevance) >= relevanceMin).map(r => r.DOCID);
    const f1Result = f1(resultIds, relevantIds);
    f1Results.push(f1Result);
  }
  return _.mean(f1Results);
}