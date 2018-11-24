const MongoClient = require('mongodb').MongoClient;

const config = require('../config.json');

let client;

module.exports = {};

module.exports.connect = function() {
  const { auth, url, name } = config.db;
  if (!client) {
    client = new MongoClient(url, { auth });
  }

  return client.connect().then(() => {
    const db = client.db(name);
    return db;
  });
}

module.exports.disconnect = function() {
  if (client) {
    client.close();
  }
}