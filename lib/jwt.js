const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret';

const jwtSign = (payload) => {
  const token = jwt.sign(payload, secret);
  return token;
};

const jwtVerify = (token) => {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {}
};

module.exports = {
  jwtSign,
  jwtVerify,
};
