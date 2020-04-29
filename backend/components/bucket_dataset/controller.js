const { ErrorHandler } = require('../../utils/errorHandler');
const s3Services = require("../../libs/s3/services");
const services = require("./services");

const getBucketNames = async (request, response, next) => {
  try {
    const data = await s3Services.getBucketNames();
    response.send(data);
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

const getPaths = async (request, response, next) => {
  if (!request.params && !request.params.bucketName) {
    return next(new ErrorHandler(404, `Missing required url parameter 'bucketName`));
  }

  try {
    const bucketName = request.params.bucketName;
    const dbResponse = await services.getPathsByBucketName(bucketName);
    const data = dbResponse.map(item => item.directoryPath);
    response.send(data);
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

module.exports = {
  getBucketNames,
  getPaths,
};
