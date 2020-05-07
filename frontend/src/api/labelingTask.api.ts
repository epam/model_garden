import axios from "axios";
import { LabelingTaskRequestData, LabelingTaskStatus } from "../models";
import { backendUrl } from "./const";

axios.defaults.headers = {
  "Content-Type": "application/json",
};

export const getDatasetsRequest = async (bucketId: string) => {
  try {
    return await axios.get(
      `http://${backendUrl}/api/datasets/`,
      {
        params: {
          bucket_id: bucketId,
        }
      }
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
      `http://${backendUrl}/api/cvat-users/`
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
  datasetId: string,
) => {
  try {
    return await axios.get(
      `http://${backendUrl}/api/media-assets/`,
        {
          params: {
            dataset_id: datasetId,
            status: "PENDING",
          }
        }
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
  taskData: LabelingTaskRequestData,
) => {
  try {
    return await axios.post(
      `http://${backendUrl}/api/cvat-tasks/`,
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
  bucketId: string,
  datasetId: string,
): Promise<LabelingTaskStatus[]> => {
  try {
    let resp = await axios.get(
      `http://${backendUrl}/api/cvat-tasks/`,
      {
        params: {
          page: 1,
          page_size: 50,
          // TODO: filter and paginate the result
        }
      }
    );
    return resp.data.results;
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};
