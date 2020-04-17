const AWS = require('aws-sdk');
const config = require('config');

const accessKeyId = config.get('awsAccessKeyId');
const secretAccessKey = config.get('awsSecretAccessKey');
const bucketName = config.get('awsStorageBucketName');

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey
});

/**
 * Upload file to the S3
 * @param {string} key - filename including folder path
 * @param {string} body - file content
 */
const uploadXml = async (key, body) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body
  };
  try {
    const response = await s3.upload(params).promise();
    console.log(key, ' file has uploaded to S3');
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// TODO
const getImagesNames = async (imagesCount) => {
  const params = {
    Bucket: bucketName,
    Key: '.'
  };
  const objects = await s3.listObjectsV2({
    Bucket: bucketName,
    MaxKeys: 20,
    Delimiter: '/',
    StartAfter: 'metal_roll_store.right_side.03.jpg'
  }).promise();
  console.log(objects);
};

module.exports = {
  uploadXml,
  getImagesNames
};