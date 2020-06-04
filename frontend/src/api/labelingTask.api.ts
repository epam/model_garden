import axios from "axios";
import { LabelingTaskRequestData, LabelingTaskStatus } from "../models";
import { backendHostPort } from "./environment";

axios.defaults.headers = {
  "Content-Type": "application/json",
};

export const getDatasetsRequest = async (bucketId: string) => {
  try {
    return await axios.get(
      `http://${backendHostPort}/api/datasets/`,
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
      `http://${backendHostPort}/api/cvat-users/`
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
      `http://${backendHostPort}/api/media-assets/`,
        {
          params: {
            dataset_id: datasetId,
            is_pending: true,
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
      `http://${backendHostPort}/api/labeling-tasks/`,
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
  page: number,
  rowsPerPage: number,
  filterMap: any,
  sortOrder?: 'ascend' | 'descend',
  sortField?: string
): Promise<{count: number, tasks: LabelingTaskStatus[]}> => {
  try {
    const params: any = {
      page,
      page_size: rowsPerPage,
    }

    if (sortOrder && sortField) {
      params.ordering = sortOrder === 'ascend' ? sortField : `-${sortField}`;
    }

    for (const [key, value] of Object.entries(filterMap)) {
      params[key] = Array(value)[0];
    }

    let resp = await axios.get(
      `http://${backendHostPort}/api/labeling-tasks/`,
      {params : params}
    );
    return {
      tasks: resp.data.results,
      count: resp.data.count
    }
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const archiveTaskLabelingRequest = async (
  taskIds: Array<number>,
) => {
  try {
    return await axios.patch(
      `http://${backendHostPort}/api/labeling-tasks/archive/`,
      {id: taskIds}
    );
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const retryLabelingTaskRequest = async (
  taskIds: Array<number>,
) => {
  try {
    return await axios.patch(
      `http://${backendHostPort}/api/labeling-tasks/retry/`,
      {id: taskIds}
    );
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};