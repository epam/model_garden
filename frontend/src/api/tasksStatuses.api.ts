import axios from 'axios';
import qs from 'qs';
import { LabelingTaskStatus } from '../models';
import { backendHostPort } from './environment';

axios.defaults.headers = {
  'Content-Type': 'application/json'
};

export const getLabelingTasksRequest = async (
  params: Object
): Promise<{ count: number; tasks: LabelingTaskStatus[] }> => {
  try {
    let resp = await axios.get(`http://${backendHostPort}/api/labeling-tasks/`, {
      params: params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      }
    });

    return {
      tasks: resp.data.results,
      count: resp.data.count
    };
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const archiveTaskLabelingRequest = async (taskIds: Array<number>) => {
  try {
    return await axios.patch(`http://${backendHostPort}/api/labeling-tasks/archive/`, { id: taskIds });
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const retryLabelingTaskRequest = async (taskIds: Array<number>) => {
  try {
    return await axios.patch(`http://${backendHostPort}/api/labeling-tasks/retry/`, { id: taskIds });
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};
