const AdmZip = require("adm-zip");
const { ErrorHandler } = require("../../utils/errorHandler");
const cvatServices = require("../../libs/cvat/services");
const s3Services = require("../../libs/s3/services");
const {
  DUMP_FORMAT_PASCAL,
  ANNOTATIONS_FOLDER_NAME_PASCAL,
} = require("./constants");
const mediaAssetsServices = require("../media_asset/services");
// TODO: this is not finished code. Freezed while backend development on the python
// Remove this code if needed
// const { LabelingTaskData } = require('../../libs/cvat/models');

const getTask = async (request, response, next) => {
  if (!request.params.taskId) {
    return next(
      new ErrorHandler(404, 'Missing required url parameter "taskId"')
    );
  }

  const taskId = request.params.taskId;

  try {
    const data = await cvatServices.getTask(taskId);
    response.send(data);
    response.send("");
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

// TODO: this is not finished code. Freezed while backend development on the python
// Remove this code if needed
const createTask = async (request, response, next) => {
  const {
    taskName,
    userId,
    filesInTask,
    countOfTasks,
    bucketName,
    bucketPath,
  } = request.body;

  if (
    !taskName &&
    !userId &&
    !filesInTask &&
    !countOfTasks &&
    !bucketName &&
    !bucketPath
  ) {
    return next(
      new ErrorHandler(404, 'Missing required request parameter "task_data"')
    );
  }

  try {
    const mediaAssets = await mediaAssetsServices.getMediaAssets(bucketName, bucketPath, 0);
    console.log(mediaAssets);
    console.log('media....');
    for (let i = 0; i < +countOfTasks; i++) {
      const sampleAsset = mediaAssets.splice(0, filesInTask).map(asset => asset.fileName);
      console.log(i);
      console.log('sample: ', sampleAsset);
      const labelingTaskData = {
        name: taskName,
        assignee: userId,
        owner: 1, // hardcoded
        segments: [],
        labels: [
          {
            name: "newLabel",
            attributes: [],
          },
        ],
        image_quality: 70,
        z_order: false,
        segment_size: "10",
        overlap: "1",
        // start_frame,
        // stop_frame,
      };
      const taskDataResponse = await cvatServices.createTask(labelingTaskData);
      const imagesDataResponse = await cvatServices.setImagesToTask(
        taskDataResponse.id,
        {
          remote_files: sampleAsset.map(asset => asset.fileName)
        }
      );
      // const sampleAsset = mediaAssets.filter((asset, i) => i < +filesInTask);
      // mediaAssets.forEach(mediaAsset => {
    response.send({ taskId: imagesDataResponse.id });
      // });
    }
    response.send('s');
  } catch (error) {}
  // if (!request.body && !request.body.task_data) {
  //   return next(new ErrorHandler(404, 'Missing required request parameter "task_data"'));
  // }

  // if (!request.body && ! request.body.images_data) {
  //   return next(new ErrorHandler(404, 'Missing required request parameter "images_data"'));
  // }

  // try {
  //   const { task_data, images_data } = request.body;
  //   const taskDataResponse = await cvatServices.createTask(task_data);
  //   const imagesDataResponse = await cvatServices.setImagesToTask(
  //     taskDataResponse.id,
  //     images_data
  //   );
  //   response.send({ taskId: imagesDataResponse.id });
  // } catch (error) {
  //   return next(new ErrorHandler(500, error.message));
  // }
};

// TODO: uploadFile, add bucketDataset path. Replace for loop to Promise.all
const completeTask = async (request, response, next) => {
  if (!request.body && !request.body.taskId) {
    return next(new ErrorHandler(404, 'Missing required parameter "taskId"'));
  }

  let zipResponseData;
  const taskId = request.body.taskId;
  const dumpFormat = DUMP_FORMAT_PASCAL;
  const zipXmlFolderName = ANNOTATIONS_FOLDER_NAME_PASCAL;

  try {
    zipResponseData = await cvatServices.getDumpAnnotations(taskId, dumpFormat);
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }

  try {
    const zip = new AdmZip(zipResponseData);
    const zipEntries = zip.getEntries();

    for (let i = 0; i < zipEntries.length; i++) {
      const entry = zipEntries[i];
      if (entry.entryName.startsWith(zipXmlFolderName)) {
        const fileName = entry.entryName.replace(zipXmlFolderName, "");
        const fileData = entry.getData().toString("utf-8");
        await s3Services.uploadFile(fileName, fileData);
      }
    }
    response.send("success");
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

const getUnsignedImagesCount = async (request, response, next) => {
  if (!request.body && !request.body.params.bucket_name) {
    return next(
      new ErrorHandler(404, "Missing required url parameter 'bucket_name'")
    );
  }

  if (!request.body && !request.body.params.bucket_path) {
    return next(
      new ErrorHandler(404, "Missing required url parameter 'bucket_path'")
    );
  }

  try {
    const { bucket_name, bucket_path } = request.params;
    const mediaAssets = await mediaAssetsServices.getMediaAssets(
      bucket_name,
      bucket_path
    );
    response.send({ count: mediaAssets.length });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

module.exports = {
  getTask,
  createTask,
  completeTask,
  getUnsignedImagesCount,
};
