function generateRandomCode() {
  const min = 100000;
  const max = 900000;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

module.exports = generateRandomCode;
