import axios from "axios";

export const getBucketNamesRequest = async () => {
  try {
    return axios
      .get("http://localhost:9000/api/bucket_dataset/bucket_names", {
        headers: {
          "Content-Type": "application/zip",
        },
      });
  } catch (error) {
    if (error && error.response) {
      return error.response.data;
    }
    throw error;
  }
};
