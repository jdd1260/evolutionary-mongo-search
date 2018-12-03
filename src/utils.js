const _ = require("lodash");

module.exports = {};

module.exports.getDotNotation = function(obj) {
  return _.reduce(obj, (result, val, key) => {
    if (!_.isObject(val)) {
      result[key] = val;
    } else {
      const converted = module.exports.getDotNotation(val);
      const newVals = _.mapKeys(converted, (ignore, subKey) => {
        return `${key}.${subKey}`;
      });
      return {
        ...result,
        ...newVals
      }
    }
    return result;
  }, {});
};