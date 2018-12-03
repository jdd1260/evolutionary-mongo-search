const csvtojson = require("csvtojson");
const fs = require('fs');
const _ = require('lodash');

const client = require("../db/client");
const config = require('../config.json');

const insertChunkSize = 20;

function forceGC() {
   if (global.gc) {
      global.gc();
   } else {
      console.warn('No GC hook! Start your program as `node --expose-gc file.js`.');
   }
}

async function loadDocs() {
  const db = await client.connect();
  const startingPoint = 0;

  const documentsCollectionName = config.db.collections.documents;
  const documentsCollection = db.collection(documentsCollectionName);

  const documentsDirectory = config.data.documents.directory;
  const fileNames = fs.readdirSync(documentsDirectory).slice(startingPoint);
  
  const length = fileNames.length;
  const numChunks = Math.floor((length - 1) / insertChunkSize) + 1;

  for (let chunkIndex = 0; chunkIndex < numChunks; chunkIndex++) {
    const fileIndexes = _.range(chunkIndex*insertChunkSize, (chunkIndex+1)*insertChunkSize);
    const fileContents = fileIndexes.map(fileIndex => {
      const fileName = fileNames[fileIndex];
      if (fileName) {
        return require(`./${documentsDirectory}/${fileName}`);
      }
    });
    
    await documentsCollection.insertMany(_.compact(fileContents));
    delete fileContents;
    forceGC();
  }
}

async function run() {
  try {
    await loadDocs();
  } catch(error) {
    console.error(error);
  }

  process.exit(0);
}

run();