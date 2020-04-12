const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || '3000';
const CVAT_HOST = process.env.CVAT_HOST || 'localhost';
const CVAT_PORT = process.env.CVAT_PORT || '8080';
const S3_HOST = process.env.S3_HOST || '';
const S3_PORT = process.env.S3_PORT || '';
const FRONTEND_HOST = process.env.FRONTEND_HOST || 'localhost';
const FRONTEND_PORT = process.env.FRONTEND_PORT || '4200';

const CVAT_BASE_API_URL = `http://${CVAT_HOST}:${CVAT_PORT}/api/v1`;

module.exports = {
  API_HOST,
  API_PORT,
  CVAT_HOST,
  CVAT_PORT,
  CVAT_BASE_API_URL,
  S3_HOST,
  S3_PORT,
  FRONTEND_HOST,
  FRONTEND_PORT
};