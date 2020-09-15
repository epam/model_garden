import axios from 'axios';
import { backendHostPort } from './environment';

export const getBucketsRequest = async (): Promise<any> => {
  try {
    return await axios.get(`http://${backendHostPort}/api/buckets/`);
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};

export const getDatasetsRequest = async (bucketId: string): Promise<any> => {
  try {
    return await axios.get(`http://${backendHostPort}/api/datasets/`, {
      params: {
        bucket_id: bucketId
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

export const getLabelingToolUsersRequest = async (): Promise<any> => {
  try {
    return await axios.get(`http://${backendHostPort}/api/cvat-users/`, {
      timeout: 4000,
      timeoutErrorMessage: 'Error getting users. Please confirm you are connected to VPN'
    });
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};
