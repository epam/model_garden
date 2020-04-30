import axios from "axios";

export const getBucketNamesRequest = () => {
  return axios.get("http://localhost:9000/api/buckets/");
};
