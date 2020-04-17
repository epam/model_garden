const cvatServices = require('../../libs/cvat/services');

const login = async (request, response) => {
  await cvatServices.login();
  response.send('success');
};

module.exports = {
  login
};