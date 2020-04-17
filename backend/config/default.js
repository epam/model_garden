require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI,

  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_KEY,
  awsStorageBucketName: process.env.AWS_STORAGE_BUCKET_NAME || 'epam-mlvc-modeldata',

  cvatHost: process.env.CVAT_HOST,
  cvatPort: process.env.CVAT_PORT,
  cvatBaseUrl: `http://${process.env.CVAT_HOST}:${process.env.CVAT_PORT}/api/v1`,
  cvatRootUserName: process.env.CVAT_ROOT_USER_NAME,
  cvatRootUserPassword: process.env.CVAT_ROOT_USER_PASSWORD,
  
  backendHost: process.env.BACKEND_HOST,
  backendPort: process.env.BACKEND_PORT,

  frontEndHost: process.env.FRONTEND_HOST,
  frontEndPort: process.env.FRONTEND_PORT,
};