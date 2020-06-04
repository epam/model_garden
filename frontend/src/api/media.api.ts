import axios from "axios";
import { backendHostPort } from "./environment";

export const uploadMediaFilesRequest = async (
  files: File[],
  bucketId: string,
  path?: string
) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("bucketId", bucketId);
    if (path) formData.append("path", path);
    return await axios.post(
      `http://${backendHostPort}/api/media-assets/upload/`,
      formData,
      {
        headers: {
          "Content-Type": "application/zip",
        },
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

export const addExistingDatasetRequest = async (
  bucketId: string,
  path: string
) => {
  try {
    const formData = new FormData();
    formData.append("bucketId", bucketId);
    if (path) formData.append("path", path);
    return await axios.post(
      `http://${backendHostPort}/api/media-assets/import-s3/`,
      formData,
      {
        headers: {
          "Content-Type": "application/zip",
        },
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

export const getImages = ({ bucketId, datasetId }: any) => {
  const url = `http://${backendHostPort}/api/media-assets/${
    bucketId
      ? `?bucket_Id=${bucketId}${datasetId ? `&dataset_id=${datasetId}`  : ''}`
      : datasetId
      ? `?dataset_id=${datasetId}`
      : ''
  }`;
  return axios.get(url);
};

