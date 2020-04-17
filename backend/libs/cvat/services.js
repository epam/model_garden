const config = require("config");
const axios = require("axios").default;
const { timeout } = require("../../utils/timeout");
const { ROUTES, DUMP_DOWNLOAD_NAME } = require("./constants");

const baseUrl = config.get("cvatBaseUrl");

// Set up default request parameters to using with CVAT API
axios.defaults.baseURL = baseUrl;
axios.defaults.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: "",
};

/**
 * Authorize in CVAT labeling tool via login and password.
 * By default used login and password from config
 * @param {string} username - by default from config
 * @param {string} password - by default from config
 */
const login = async (
  username = config.get("cvatRootUserName"),
  password = config.get("cvatRootUserPassword")
) => {
  try {
    const response = await axios.post(ROUTES.auth.login, {
      username,
      password,
    });
    axios.defaults.headers["Authorization"] = `Token ${response.data.key}`;
    return response.data;
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

/**
 * Get task data
 * @param {string | number} taskId
 */
const getTask = async (taskId) => {
  try {
    const response = await axios.get(ROUTES.tasks.id(taskId));
    return response.data;
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

/**
 * Create task
 * @param {Object} taskData 
 */
const createTask = async (taskData) => {
  try {
    const response = await axios.post(ROUTES.tasks.tasks, taskData);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

/**
 * Set images to the task
 * @param {string | number} taskId 
 * @param {Object} imagesData 
 */
const setImagesToTask = async (taskId, imagesData) => {
  try {
    const response = await axios.post(ROUTES.tasks.images(taskId), imagesData);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

/**
 * Get labeled annotation
 * @param {sting | number} taskId 
 * @param {string} dumpFormat 
 */
const getDumpAnnotations = async (taskId, dumpFormat) => {
  let isXmlLoaded = false;
  let response = null;

  const path = ROUTES.tasks.dumpAnnotations(taskId, DUMP_DOWNLOAD_NAME, dumpFormat);

  try {
    response = await axios.get(path);
    while (!isXmlLoaded) {
      response = await axios.get(path);
      if (response.status === 202) {
        console.log("waiting for files from cvat...");
        await timeout(3000);
      } else if (response.status === 201) {
        response = await axios.get(`${path}&action=download`, {
          headers: {
            "Accept-Encoding": "gzip",
          },
          responseType: "arraybuffer",
        });
        isXmlLoaded = true;
      }
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return error.message;
  }
};

module.exports = {
  login,
  getTask,
  createTask,
  setImagesToTask,
  getDumpAnnotations,
};
