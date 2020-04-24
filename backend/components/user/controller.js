const userServices = require('./services');

const getLabelingToolUsers = async (request, response) => {
  const dbResult = await userServices.getLabelingToolUsers();
  response.send(dbResult);
};

module.exports = {
  getLabelingToolUsers
};
