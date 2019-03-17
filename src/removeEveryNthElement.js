module.exports = (input, n) => {
  let result = [];
  for(let i = 1; i < input.length + 1; i++) {
    if (i % n !== 0) {
      result.push(input[i-1]);
    }
  }
  return result;
};