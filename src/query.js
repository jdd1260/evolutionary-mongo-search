const getCollection = require('./get-collection');
const config = require('../config.json');
const querySize = config.evaluation.querySize;
const { idField } = config.data.documents;


module.exports = async function(query) {
  const collection = await getCollection();
  return collection.find(
    { $text: { $search: query }}, 
  )
  .project(    { 
    score: { $meta: "textScore" },
    [idField]: 1
  })
  .sort(
    { score: { $meta:"textScore" } }
  )
  .limit(querySize).toArray();
}