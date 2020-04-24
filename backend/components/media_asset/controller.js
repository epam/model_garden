const { prepareFilesToUpload, createPathToUpload } = require("./utils");
const s3Services = require("../../libs/s3/services");
const bucketDatasetServices = require("../bucket_dataset/services");
const mediaAssetServices = require("./services");

const uploadImages = async (request, response) => {
  const bucketName = request.body.bucketName;
  const pathToUpload = createPathToUpload(request.files, request.body.path);
  const files = prepareFilesToUpload(request.files);

  const bucketDatasetDBResponse = await bucketDatasetServices.saveBucketDataset(
    pathToUpload
  );

  if (bucketDatasetDBResponse instanceof Error) {
    console.error(bucketDatasetDBResponse);
    response.status(500).send({ message: bucketDatasetDBResponse.errmsg });
  } else {
    await Promise.all(
      files.map((file) =>
        s3Services.uploadFile(
          bucketName,
          `${pathToUpload}/${file.name}`,
          file.data
        )
      )
    );
    await mediaAssetServices.saveMediaAsset(
      bucketDatasetDBResponse.id,
      files.map((file) => file.name)
    );
    response.send(pathToUpload);
  }
};

module.exports = {
  uploadImages
};
