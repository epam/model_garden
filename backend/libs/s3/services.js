const AWS = require('aws-sdk');
const config = require('config');

const accessKeyId = config.get('awsAccessKeyId');
const secretAccessKey = config.get('awsSecretAccessKey');
const bucketName = config.get('awsStorageBucketName');

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey
});

const uploadFile = async (bucketName, fileKey, fileBody) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: fileBody
    };
    await s3.upload(params, (error, data) => {
      if (error) reject(error);
      console.log(`${fileKey} is uploaded`);
      resolve(data);
    });
  });
};

// TODO: Access denied;
const getBucketNames = async () => {
  try {
    // return await s3.listBuckets().promise();
    return ['epam-mlvc-modeldata', 'epam-mlcv'];
  } catch (error) {
    return error;
  }
};

const getPaths = async (bucketName) => {
  try {
    const params = {
      Bucket: bucketName,
      Delimiter: '/'
    };
    return await s3.listObjectsV2(params).promise();
  } catch (error) {
    return error;
  }
};

module.exports = {
  uploadFile,
  getBucketNames,
  getPaths
};