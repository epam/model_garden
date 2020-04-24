import axios from "axios";
import { Task } from "../models";

axios.defaults.headers = {
  'Content-Type': 'application/json'
};

export const getBucketPathsRequest = (bucketName: string) => {
  return axios.get(
    `http://localhost:9000/api/bucket_dataset/paths/${bucketName}`
  );
};

export const getLabelingToolUsersRequest = () => {
  return axios.get("http://localhost:9000/api/users/labeling_tool_users");
};

export const getUnsignedImagesCountRequest = (
  bucketName: string,
  bucketPath: string
) => {
  return axios.get(
    `http://localhost:9000/api/labeling_tasks/unsigned_images_count/${bucketName}/${bucketPath}`
  );
};

export const createLabelingTaskRequest = (taskData: Task) => {
  return axios.post("http://localhost:9000/api/labeling_tasks", taskData);
};
