const csvtojson = require("csvtojson");

const client = require("./db/client");
const config = require('./config.json');


async function loadTraining() {
  const db = await client.connect();

  const { trainingQueries, trainingLabels } = config.db.collections;
  const { directory, training } = config.data;

  const queriesPath = `${directory}/${training.queries}`;
  const queries = await csvtojson().fromFile(queriesPath);
  const trainingQueriesCollection = db.collection(trainingQueries);
  await trainingQueriesCollection.insertMany(queries);

  const labelsPath = `${directory}/${training.labels}`;
  const labels = await csvtojson().fromFile(labelsPath);
  const trainingLabelsCollection = db.collection(trainingLabels);
  await trainingLabelsCollection.insertMany(labels);
}

async function loadTesting() {
  const db = await client.connect();

  const { testingQueries, testingLabels } = config.db.collections;
  const { directory, testing } = config.data;

  const queriesPath = `${directory}/${testing.queries}`;
  const queries = await csvtojson().fromFile(queriesPath);
  const testingQueriesCollection = db.collection(testingQueries);
  await testingQueriesCollection.insertMany(queries);

  const labelsPath = `${directory}/${testing.labels}`;
  const labels = await csvtojson().fromFile(labelsPath);
  const testingLabelsCollection = db.collection(testingLabels);
  await testingLabelsCollection.insertMany(labels);
}

async function run() {
  try {
    await loadTraining();
    await loadTesting();
  } catch(error) {
    console.error(error);
  }

  process.exit(0);
}


run();