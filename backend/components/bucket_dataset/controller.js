const s3Services = require("../../libs/s3/services");
const services = require("./services");

const getBucketNames = async (request, response) => {
  const data = await s3Services.getBucketNames();
  response.send(data);
};

const getPaths = async (request, response) => {
  const bucketName = request.params.bucketName;
  const dbResponse = await services.getPathsByBucketName(bucketName);
  const data = dbResponse.map(item => item.directoryPath);
  response.send(data);
};

module.exports = {
  getBucketNames,
  getPaths,
};
