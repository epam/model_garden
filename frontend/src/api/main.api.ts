import axios from "axios";

export const getBucketNamesRequest = async () => {
  try {
    return await axios.get(
      "http://localhost:9000/api/bucket_dataset/bucket_names",
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
