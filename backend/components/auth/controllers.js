const { ErrorHandler } = require('../../utils/errorHandler');
const cvatServices = require('../../libs/cvat/services');

const loginCvat = async (request, response, next) => {
  try {
    await cvatServices.login();
    response.send('success');
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

module.exports = {
  loginCvat
};