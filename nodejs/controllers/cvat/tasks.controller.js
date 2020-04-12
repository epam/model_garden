const axios = require("../../utils/axios");
const cvatApi = require("../../constants/cvat-api.constants");

const getTask = async (req, res) => {
  try {
    const response = await axios.get(cvatApi.tasks.id(req.params["taskId"]));
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.send(error.message);
  }
};

const createTask = async (req, res) => {
  try {
    const response = await axios.post(cvatApi.tasks.tasks, req.body);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.send(error.message);
  }
};

const setImages = async (req, res) => {
  try {
    const response = await axios.post(
      cvatApi.tasks.images(req.params["taskId"]),
      req.body
    );
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.send(error.message);
  }
};

module.exports = {
  getTask,
  createTask,
  setImages,
};
