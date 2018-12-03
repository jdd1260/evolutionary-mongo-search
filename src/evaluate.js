const executeQuery = require('./query');
const getCollection = require('./get-collection');

module.exports = async function() {
  const [testingQueriesCollection, testingLabelsCollection, documentsCollection] = await Promise.all([
    getCollection('testingQueries'),
    getCollection('testingLabels'),
    getCollection('documents')
  ]);
  const testQueries = await testingQueriesCollection.find().toArray();
  //for each query:
  //   query for all labels where queryId matches
  //   execute query on db
}