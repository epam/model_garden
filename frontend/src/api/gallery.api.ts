import axios from 'axios';
import { backendHostPort } from './environment';

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
