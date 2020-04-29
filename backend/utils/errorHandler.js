class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (error, response) => {
  const { statusCode, message } = error;
  console.log('------------------ERROR----------------------');
  console.error(error);
  console.log('---------------------------------------------');
  response.status(statusCode).send({
    status: 'error',
    statusCode,
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError
};