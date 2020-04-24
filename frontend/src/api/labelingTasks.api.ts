import axios from "axios";
import { Task } from "../models";

export const createLabelingTaskRequest = (taskData: Task) => {
  return axios
    .post("http://localhost:9000/api/tasks", taskData)
    .then((response) => response.data)
    .catch((error) => error.message);
};
