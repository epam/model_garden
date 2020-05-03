const ROUTES = {
  auth: {
    login: `/auth/login`
  },
  tasks: {
    tasks: `/tasks`,
    id: (taskId) => `/tasks/${taskId}`,
    images: (taskId) => `/tasks/${taskId}/data`,
    dumpAnnotations: (taskId, filename, format) => `/tasks/${taskId}/annotations/${filename}?format=${format}`
  },
  users: {
    users: '/users',
  }
};

const DUMP_DOWNLOAD_NAME = 'New';

module.exports = {
  ROUTES,
  DUMP_DOWNLOAD_NAME
};