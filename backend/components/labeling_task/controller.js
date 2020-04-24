const AdmZip = require("adm-zip");
const cvatServices = require('../../libs/cvat/services');
const s3Services = require('../../libs/s3/services');
const { DUMP_FORMAT_PASCAL, ANNOTATIONS_FOLDER_NAME_PASCAL } = require('./constants');

const getTask = async (request, response) => {
  const data = await cvatServices.getTask(request.params["taskId"]);
  response.send(data);
  response.send('');
};

const createTask = async (request, response) => {
  const { task_data, images_data } = request.body;
  const taskDataResponse = await cvatServices.createTask(task_data);
  const imagesDataResponse = await cvatServices.setImagesToTask(taskDataResponse.id, images_data);
  response.send({ taskId: imagesDataResponse.id });
};

// TODO: uploadFile, add bucketDataset path. Replace for loop to Promise.all
const completeTask = async (request, response) => {
  const taskId = request.body.taskId;
  const dumpFormat = DUMP_FORMAT_PASCAL;
  const zipXmlFolderName = ANNOTATIONS_FOLDER_NAME_PASCAL;

  const zipResponseData = await cvatServices.getDumpAnnotations(taskId, dumpFormat);
  
  const zip = new AdmZip(zipResponseData);
  const zipEntries = zip.getEntries();

  for (let i = 0; i < zipEntries.length; i++) {
    const entry = zipEntries[i];
    if (entry.entryName.startsWith(zipXmlFolderName)) {
      const fileName = entry.entryName.replace(zipXmlFolderName, '');
      const fileData = entry.getData().toString('utf-8');
      await s3Services.uploadFile(fileName, fileData);
    }
  };
  response.send('success');
};

module.exports = {
  getTask,
  createTask,
  completeTask,
};
