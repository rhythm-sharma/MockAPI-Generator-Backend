/**
 * Check if object is empty or not
 * @param {Object} object
 * @returns {Boolean}
 */
const isEmptyObj = (object) => {
  // eslint-disable-next-line
  for (let i in object) return false;
  return true;
};

module.exports = { isEmptyObj };
