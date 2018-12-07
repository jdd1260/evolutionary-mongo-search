const _ = require('lodash');

const executeQuery = require('./query');
const getCollection = require('./get-collection');
const config = require('../config.json');
const { fMeasureBeta, relevanceMin } = config.evaluation;
const { idField } = config.data.documents;

function precision(resultIds, relevantIds) {
  const numRelevant = _.intersection(resultIds, relevantIds).length;
  return numRelevant / resultIds.length;
}

function recall(resultIds, relevantIds) {
  const numRelevant = _.intersection(resultIds, relevantIds).length;
  return numRelevant / relevantIds.length;
}

function fMeasure(resultIds, relevantIds) {
  const p = precision(resultIds, relevantIds);
  const r = recall(resultIds, relevantIds);
  if (p === 0 && r === 0) {
    return 0;
  }
  const betaSquared = fMeasureBeta * fMeasureBeta;
  return ((1 + betaSquared) * p * r) / ((betaSquared * p) + r);
}

module.exports = async function(isTraining = true) {
  const [queriesCollection, labelsCollection] = await Promise.all([
    getCollection(isTraining ? 'trainingQueries' : 'testingQueries'),
    getCollection(isTraining ? 'trainingLabels' : 'testingLabels'),
  ]);
  const queries = await queriesCollection.find().toArray();
  const fMeasureResults = [];
  for (const index in queries) {
    const { id, query } = queries[index];
    const results = await executeQuery(query);
    const labels = await labelsCollection.find({ "queryId": id }).toArray();
    const resultIds = results.map(r => r[idField]);
    const relevantIds = labels.filter(r => Number(r.relevance) >= relevanceMin).map(r => r.DOCID);
    const fMeasureResult = fMeasure(resultIds, relevantIds);
    fMeasureResults.push(fMeasureResult);
  }
  return _.mean(fMeasureResults);
}