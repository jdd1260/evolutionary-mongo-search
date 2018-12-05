const _ = require('lodash');

const createIndex = require('./create-index');
const evaluate = require('./evaluate');

const { weightChangeLimit, randomWeightMax, completelyRandomLimit } = require('../config.json').training;
const weightLowerBound = 1;


function getKeysToChange(weights) {
  const keys = Object.keys(weights);
  const numKeysToChange = (1, Math.floor(keys.length / 2));
  const keysToChange = _.sampleSize(keys, numKeysToChange);
  return keysToChange;
}

function evolveRandomAdditions(weights) {
  const keysToChange = getKeysToChange(weights);
  const newWeights = { ...weights };
  keysToChange.forEach(key => {
    const addition = _.random(-1*weightChangeLimit, weightChangeLimit);
    const newVal = weights[key] + addition;
    newWeights[key] = Math.max(weightLowerBound, newVal);
  });
  return newWeights;
}
function evolveRandomChanges(weights) {
  const keysToChange = getKeysToChange(weights);
  const newWeights = { ...weights };
  keysToChange.forEach(key => {
    newWeights[key] = _.random(weightLowerBound, randomWeightMax);
  });
  return newWeights;
}

function completelyRandomWeights(weights) {
  const newWeights = { ...weights };
  Object.keys(weights).forEach(key => {
    newWeights[key] = _.random(weightLowerBound, completelyRandomLimit);
  });
  return newWeights;
}

function evolve(weights, score) {
  const candidates = [
    evolveRandomAdditions(weights),
    evolveRandomAdditions(weights),
    evolveRandomChanges(weights),
    evolveRandomChanges(weights),
    completelyRandomWeights(weights)
  ];
  if (!score) {
    candidates.push(weights);
  }
  return candidates;
}

module.exports = async function({ bestWeights, bestScore }) {
  const candidates = evolve(bestWeights, bestScore);
  for (const index in candidates) {
    const candidate = candidates[index];
    await createIndex(candidate);
    const resultScore = await evaluate();
    if (!bestScore || resultScore > bestScore) {
      bestScore = resultScore;
      bestWeights = candidate;
    }
  }

  return { bestWeights, bestScore };
}