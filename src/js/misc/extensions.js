/**
* Returns a number whose value is limited to the given range.
*
* Example: limit the output of this computation to between 0 and 255
* (x * 255).clamp(0, 255)
*
* @param {Number} min The lower boundary of the output range
* @param {Number} max The upper boundary of the output range
* @returns A number in the range [min, max]
* @type Number
*/
Number.prototype.clamp = function (min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
* Returns whether an array contains the argument element or not
*
* @param {object} the needle element to check
* @returns whether an array contains the argument element or not
* @type Bool;
*/
Array.prototype.contains = function (element) {
  var arrayLength = this.length;
  for (let i = 0; i < arrayLength; i++) {
      if (this[i] == element) {
          return true;
      }
  }
  return false;
};

/**
* Returns the last element of an array.
*/
Array.prototype.last = function () {
  return this[this.length-1];
};