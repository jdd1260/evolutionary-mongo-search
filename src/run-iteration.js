const createIndex = require('./create-index');
const evaluate = require('./evaluate');

module.exports = async function(weights) {
  await createIndex(weights);
  const resultScore = await evaluate();
  return resultScore;
}