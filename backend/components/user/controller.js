const { ErrorHandler } = require('../../utils/errorHandler');
const userServices = require('./services');

const getLabelingToolUsers = async (request, response, next) => {
  try {
    const dbResult = await userServices.getLabelingToolUsers();
    response.send(dbResult);
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

module.exports = {
  getLabelingToolUsers
};
