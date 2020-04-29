const { prepareFilesToUpload, createPathToUpload } = require("./utils");
const { ErrorHandler } = require('../../utils/errorHandler');
const s3Services = require("../../libs/s3/services");
const bucketDatasetServices = require("../bucket_dataset/services");
const mediaAssetServices = require("./services");

const uploadImages = async (request, response, next) => {
  let bucketDatasetId = null;

  if (!request.body && !request.body.bucketName) {
    return next(new ErrorHandler(404, `Missing required url parameter "bucketName"`));
  }
  
  const bucketName = request.body.bucketName;
  const pathToUpload = createPathToUpload(request.files, request.body.path);
  const files = prepareFilesToUpload(request.files);

  try {
    bucketDatasetId = await bucketDatasetServices.saveBucketDataset(
      bucketName,
      pathToUpload
    );
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }

  try {
    await Promise.all(
      files.map((file) =>
        s3Services.uploadFile(
          bucketName,
          `${pathToUpload}/${file.name}`,
          file.data
        )
      )
    );
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }

  try {
    await mediaAssetServices.saveMediaAsset(
      bucketDatasetId,
      files.map((file) => file.name)
    );
    response.send(pathToUpload);
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

module.exports = {
  uploadImages
};
