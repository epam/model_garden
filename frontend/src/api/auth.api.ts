import axios from "axios";

export const loginRequest = async (username: string, password: string) => {
  try {
    return await axios.post("http://localhost:9000/api/auth/login_cvat", { username, password });
  } catch (error) {
    if (error && error.response) {
      return error.response.data;
    }
    throw error;
  }
};
