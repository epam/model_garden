import axios from "axios";
import { LabelingTaskRequestData, LabelingTaskStatus } from "../models";

axios.defaults.headers = {
  "Content-Type": "application/json",
};

export const getBucketPathsRequest = async (bucketName: string) => {
  try {
    return await axios.get(
      `http://localhost:9000/api/datasets/?bucket_name=${bucketName}`
    );
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const getLabelingToolUsersRequest = async () => {
  try {
    return await axios.get(
      "http://localhost:9000/api/users/labeling_tool_users"
    );
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const getUnsignedImagesCountRequest = async (
  bucketName: string,
  bucketPath: string
) => {
  try {
    return await axios.get(
      `http://localhost:9000/api/labeling_task/unsigned_images_count/${bucketName}/${bucketPath}`
    );
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const createLabelingTaskRequest = async (
  taskData: LabelingTaskRequestData
) => {
  try {
    return await axios.post(
      "http://localhost:9000/api/labeling_task",
      taskData
    );
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const getLabelingTasksRequest = async (
  bucketName: string,
  bucketPath: string
): Promise<LabelingTaskStatus[]> => {
  try {
    // return await axios.get(`http://localhost:9000/api/labeling_tasks/${bucketName}/${bucketPath}`);
    return [
      {
        userName: "ivan_labelerovich@epam.com",
        taskName: "Task1",
        cvatInstance: "localhost:8080",
        status: "1",
      },
      {
        userName: "ivan_labelerovich@epam.com",
        taskName: "Task2",
        cvatInstance: "localhost:8080",
        status: "2",
      },
      {
        userName: "ivan_labelerovich@epam.com",
        taskName: "Task3",
        cvatInstance: "localhost:8080",
        status: "1",
      },
    ];
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};
