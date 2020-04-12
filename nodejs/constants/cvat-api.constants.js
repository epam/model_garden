const baseUrl = require('./common.constants').CVAT_BASE_API_URL;

module.exports = {
  auth: {
    login: `${baseUrl}/auth/login`
  },
  tasks: {
    tasks: `${baseUrl}/tasks`,
    id: (taskId) => `${baseUrl}/tasks/${taskId}`,
    images: (taskId) => `${baseUrl}/tasks/${taskId}/data`
  }
};