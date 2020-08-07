import axios from 'axios';
import { backendHostPort } from './environment';

export const getMediaAssetsRequest = ({ datasetId }: any) => {
  const url = `http://${backendHostPort}/api/media-assets/${datasetId ? `?dataset_id=${datasetId}` : ''}`;
  return axios.get(url);
};
