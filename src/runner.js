const Stopwatch = require('statman-stopwatch');

const getDotNotation = require('./utils').getDotNotation;
const config = require("../config.json");
const runIteration = require('./run-iteration');

async function run() {
  const stopwatch = new Stopwatch();
  stopwatch.start();
  try {
    const starterWeights = getDotNotation(config.defaultWeights);
    const initialRunResult = await runIteration(starterWeights);
    console.log(initialRunResult);
  } catch(error) {
    console.error(error);
  }
  const timeInSeconds = (stopwatch.stop() / 1000).toFixed(0);
  console.log('Process took ' + timeInSeconds + ' seconds');

  process.exit(0);
}

run();