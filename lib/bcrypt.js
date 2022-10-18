const bcrypt = require('bcrypt');

const saltRounds = 10;

const passwordHash = async (data) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(data, salt);
  return hash;
};

const passwordCompare = async (data, hash) => {
  const isMatchPassword = await bcrypt.compare(data, hash);
  return isMatchPassword;
};

module.exports = {
  passwordHash,
  passwordCompare,
};
