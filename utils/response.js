/*
This function is responsible for sending response back to the client
*/
function Response(res) {
  this.success = (payload, code) => {
    return res.status(code).json({
      success: true,
      payload,
    });
  };

  this.error = (error, code = 401) => {
    return res.status(code).json({
      success: false,
      error,
    });
  };
}

module.exports = (res) => new Response(res);
