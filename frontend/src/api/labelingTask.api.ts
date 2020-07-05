import axios from 'axios';
import { LabelingTaskRequestData } from '../models';
import { backendHostPort } from './environment';

axios.defaults.headers = {
  'Content-Type': 'application/json'
};

export const getUnsignedImagesCountRequest = async (datasetId: string) => {
  try {
    return await axios.get(`http://${backendHostPort}/api/media-assets/`, {
      params: {
        dataset_id: datasetId,
        is_pending: true
      }
    });
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const createLabelingTaskRequest = async (taskData: LabelingTaskRequestData) => {
  try {
    return await axios.post(`http://${backendHostPort}/api/labeling-tasks/`, taskData);
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};
