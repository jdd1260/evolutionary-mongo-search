const getDotNotation = require('./utils').getDotNotation;
const getCollection = require('./get-collection');
const config = require("../config.json");

const indexName = 'text-index';

module.exports = async function(weights) {
  const schema = getDotNotation(config.schema);
  const documentsCollection = await getCollection();
  await documentsCollection.indexExists(indexName).then(() => documentsCollection.dropIndex(indexName)).catch((error => null))
  await documentsCollection.createIndex(schema, { weights, name: indexName });
}