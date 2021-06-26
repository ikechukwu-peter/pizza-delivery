/*
 * Unit Tests
 *
 */

// Dependencies
let lib = require("../app/lib");
var assert = require("assert");

// Holder for Tests
var unit = {};

// Assert that the getANumber function is returning a number
unit["lib.palindrome checks if a given string is the same even when reversed"] =
  function (done) {
    var val = lib.palindrome("abba");
    assert.ok(val);

    done();
  };

// Assert that the getANumber function is returning 1
unit["lib.stringReversal reverses a string"] = function (done) {
  var val = lib.stringReversal("I love nodejs");
  assert.ok(val);
  done();
};

// Assert that the getANumber function is returning 2
unit["lib.getRandomNumber"] = function (done) {
  let val = lib.getRandomNumber(2, 7);
  assert.ok(val);
  done();
};
unit["lib.isNumber checks if a value passed is a number"] = function (done) {
  let val = lib.isNumber(4);
  assert.strictEqual(typeof val, "number");
  done();
};
// Assert that the getANumber function is returning 2
unit["lib.isArray checks if  value/values is an array"] = function (done) {
  let val = lib.isArray([2, 7]);
  assert.ok(val);
  done();
};

// Export the tests to the runner
module.exports = unit;
