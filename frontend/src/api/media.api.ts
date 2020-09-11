import axios from 'axios';
import { backendHostPort } from './environment';

export const uploadMediaFilesRequest = async (
  files: File[],
  bucketId: string,
  path: string,
  format: string
): Promise<any> => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));
    formData.append('bucketId', bucketId);
    if (path) {
      formData.append('path', path);
    }
    if (format) {
      formData.append('dataset_format', format);
    }
    return await axios.post(`${backendHostPort}/api/media-assets/upload/`, formData, {
      headers: {
        'Content-Type': 'application/zip'
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

export const addExistingDatasetRequest = async (bucketId: string, path: string, format: string): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('bucketId', bucketId);
    if (path) {
      formData.append('path', path);
    }
    if (format) {
      formData.append('dataset_format', format);
    }
    return await axios.post(`${backendHostPort}/api/media-assets/import-s3/`, formData, {
      headers: {
        'Content-Type': 'application/zip'
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
