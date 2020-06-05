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
