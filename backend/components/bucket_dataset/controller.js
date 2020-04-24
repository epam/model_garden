const s3Services = require('../../libs/s3/services');

const getBucketNames = async (request, response) => {
  const data = await s3Services.getBucketNames();
  console.log(data);
  response.send(data);
};

module.exports = {
  getBucketNames
};
