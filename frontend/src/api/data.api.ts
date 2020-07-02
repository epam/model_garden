import axios from 'axios';
import { backendHostPort } from './environment';

export const getBucketsRequest = async () => {
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

export const getDatasetsRequest = async (bucketId: string) => {
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

export const getMediaAssetsRequest = ({ bucketId, datasetId }: any) => {
  const url = `http://${backendHostPort}/api/media-assets/${
    bucketId
      ? `?bucket_Id=${bucketId}${datasetId ? `&dataset_id=${datasetId}` : ''}`
      : datasetId
      ? `?dataset_id=${datasetId}`
      : ''
  }`;
  return axios.get(url);
};

export const getLabelingToolUsersRequest = async () => {
  try {
    return await axios.get(`http://${backendHostPort}/api/cvat-users/`, {
      timeout: 2000
    });
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};
