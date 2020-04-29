const AWS = require('aws-sdk');
const config = require('config');

const accessKeyId = config.get('awsAccessKeyId');
const secretAccessKey = config.get('awsSecretAccessKey');
const bucketNames = require('../../data/bucketNames.json');

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

// TODO: s3.listBuckets().promise();
// at the current moment Access denied;
const getBucketNames = async () => {
  try {
    return bucketNames;
  } catch (error) {
    console.error(error);
    throw new Error(error);
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
    console.error(error);
    throw new Error(error);
  }
};

module.exports = {
  uploadFile,
  getBucketNames,
  getPaths
};