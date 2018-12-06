const Stopwatch = require('statman-stopwatch');

const getDotNotation = require('./utils').getDotNotation;
const config = require("../config.json");
const runIteration = require('./run-iteration');
const evaluate = require('./evaluate');
const createIndex = require('./create-index');

const maxTrainingTimeInHours = config.training.maxTimeInHours;

async function testWeights(weights, description) {
  await createIndex(weights)
  const resultScore = await evaluate(false);
  return ({ 
    weights,
    description,
    f1: resultScore
  });
}

function msToHours(ms) {
  return ms / 3600000;
}

async function run() {
  console.log("Starting at: ", new Date());
  const stopwatch = new Stopwatch();
  stopwatch.start();
  try {
    const starterWeights = getDotNotation(config.defaultWeights);
    console.log('Starting Initial Testing');
    const initialTestResult = await testWeights(starterWeights, 'Results from testing with starter weights');
    console.log('Finished Initial Testing');

    
    let trainResult = { bestWeights: starterWeights };
    let iteration = 1;
    while (msToHours(stopwatch.read()) < maxTrainingTimeInHours) {
      console.log("Starting training iteration #" + iteration);
      trainResult = await runIteration(trainResult);
      console.log("Finished training iteration #" + iteration + '. New best score is: ' + trainResult.bestScore);
      iteration++;
    }

    console.log('Starting Final Testing');
    const finalTestResults = await testWeights(trainResult.bestWeights, 'Results from testing after training');
    console.log('Finished Final Testing');

    console.log({ initialTestResult, finalTestResults });    

  } catch(error) {
    console.error(error);
  }
  const timeInHours = msToHours(stopwatch.stop()).toFixed(2);
  console.log('Process took ' + timeInHours + ' hours');

  process.exit(0);
}

run();