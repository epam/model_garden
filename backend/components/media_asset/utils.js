const AdmZip = require("adm-zip");
const moment = require("moment");

const prepareFilesToUpload = (files) => {
  const filesToUpload = [];

  files.forEach((file) => {
    if (file.mimetype === "application/x-zip-compressed") {
      const zip = new AdmZip(file.buffer);
      zip.getEntries().forEach((entry) => {
        filesToUpload.push({
          name: entry.name,
          data: entry.getData(),
        });
      });
    } else {
      filesToUpload.push({
        name: file.originalname,
        data: file.buffer,
      });
    }
  });
  return filesToUpload;
};

const createPathToUpload = (files, path) => {
  let pathToUpload = "";
  // Add to end of the foldername
  const currentDate = moment().format("DD-MM-YYYY");

  if (
    files.length === 1 &&
    files[0].mimetype === "application/x-zip-compressed"
  ) {
    pathToUpload = files[0].originalname.slice(
      0,
      files[0].originalname.indexOf(".")
    );
  } else if (path && path.length){
    pathToUpload = path
    if (pathToUpload[pathToUpload.length - 1] === "/") {
      pathToUpload = pathToUpload.slice(0, path.length - 1);
    }
    if (path[0] === "/") {
      pathToUpload = pathToUpload.slice(1, path.length);
    }
  } else {
    pathToUpload = "new_butch";
  }

  return `${pathToUpload}_${currentDate}`;
};

module.exports = {
  prepareFilesToUpload,
  createPathToUpload,
};
