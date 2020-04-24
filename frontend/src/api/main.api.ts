import axios from "axios";

export const getBucketNamesRequest = (): Promise<string[]> => {
  return axios
    .get("http://localhost:9000/api/bucket_dataset/bucket_names", {
      headers: {
        "Content-Type": "application/zip",
      },
    })
    .then((res) => res.data)
    .catch((error) => error.message);
};
