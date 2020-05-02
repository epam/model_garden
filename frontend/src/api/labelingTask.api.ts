import axios from "axios";
import { LabelingTaskRequestData } from "../models";

axios.defaults.headers = {
  "Content-Type": "application/json",
};

export const getBucketPathsRequest = async (bucketName: string) => {
  try {
    return axios.get(
      `http://localhost:9000/api/bucket_dataset/paths/${bucketName}`
    );
  } catch (error) {
    if (error && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

export const getLabelingToolUsersRequest = async () => {
  try {
    return axios.get("http://localhost:9000/api/users/labeling_tool_users");
  } catch (error) {
    if (error && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

export const getUnsignedImagesCountRequest = async (
  bucketName: string,
  bucketPath: string
) => {
  try {
    return axios.get(
      `http://localhost:9000/api/labeling_task/unsigned_images_count/${bucketName}/${bucketPath}`
    );
  } catch (error) {
    if (error && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

export const createLabelingTaskRequest = async (
  taskData: LabelingTaskRequestData
) => {
  try {
    return axios.post("http://localhost:9000/api/labeling_task", taskData);
  } catch (error) {
    if (error && error.response) {
      return error.response.data;
    }
    throw error;
  }
};

export const getLabelingTasksRequest = async (
  bucketName: string,
  bucketPath: string
) => {
  try {
    // return axios.get(`http://localhost:9000/api/labeling_tasks/${bucketName}/${bucketPath}`);
    return [
      {
        userName: "ivan_labelerovich@epam.com",
        taskName: "Task1",
        cvatInstance: "localhost:8080",
        status: 1,
      },
      {
        userName: "ivan_labelerovich@epam.com",
        taskName: "Task2",
        cvatInstance: "localhost:8080",
        status: 2,
      },
      {
        userName: "ivan_labelerovich@epam.com",
        taskName: "Task3",
        cvatInstance: "localhost:8080",
        status: 1,
      },
    ];
  } catch (error) {
    if (error && error.response) {
      return error.response.data;
    }
    throw error;
  }
};
