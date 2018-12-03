const client = require("../db/client");
const config = require("../config.json");

module.exports = async function(type = 'documents') {
  const db = await client.connect();
  const collectionName = config.db.collections[type];
  return db.collection(collectionName);
}