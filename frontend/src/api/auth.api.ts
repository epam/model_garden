import axios from 'axios';

export const loginRequest = (username: string, password: string) => {
  return axios.post("http://localhost:9000/api/auth/login_cvat", { username, password });
};
