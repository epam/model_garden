import axios from "axios";
import { backendUrl } from "./const"


export const getBucketsRequest = async () => {
  try {
    return await axios.get(
      `http://${backendUrl}/api/buckets/`,
    );
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};
