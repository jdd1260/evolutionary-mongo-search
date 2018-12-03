const getDotNotation = require('./utils').getDotNotation;
const config = require("../config.json");
const createIndex = require('./create-index');

async function run() {
  try {
    const weights = getDotNotation(config.defaultWeights);
    await createIndex(weights);
    console.log(results);
  } catch(error) {
    console.error(error);
  }

  process.exit(0);
}

run();