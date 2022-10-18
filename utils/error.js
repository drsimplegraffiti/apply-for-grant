// formats the error that is thrown to the client
const Error = (err, type, code) => {
  const error = {
    message: err,
    type: type,
    code: code,
  };
  return error;
};

module.exports = Error;
