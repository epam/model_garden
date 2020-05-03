import axios from "axios";

export const getBucketNamesRequest = async () => {
  try {
    return await axios.get(
      "http://localhost:9000/api/buckets/",
    );
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};
