//Container
let lib = {};

lib.palindrome = (str) => {
  let char = str.split("").reverse().join("");
  const returnedString = str === char ? char : false;
  return returnedString;
};

lib.stringReversal = (str) => {
  let char = str.split("").reverse().join("");
  return char;
};
lib.isNumber = (num) => {
  return num;
};
lib.isArray = (values) => {
  let arr = Array.isArray(values);
  return arr;
};
lib.getRandomNumber = (min, max) => {
  try {
    const value = Math.floor(Math.random() * (max - min) + min);
    //const num = value >= min && value <= max ? value
    if (value >= min && value <= max) {
      return value;
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = lib;
