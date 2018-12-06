const MongoClient = require('mongodb').MongoClient;

const config = require('../config.json');

let connection;

module.exports = {};

module.exports.connect = async function() {
  const { url, name } = config.db;
  if (!connection) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    connection = client.db(name);
  }
  return connection;
}

module.exports.disconnect = function() {
  if (client) {
    client.close();
  }
}