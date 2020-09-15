import axios from 'axios';
import { backendHostPort } from './environment';

export const getMediaAssetsRequest = ({ datasetId }: any): Promise<any> => {
  const url = `${backendHostPort}/api/media-assets/?dataset_id=${datasetId}`;
  return axios.get(url);
};
