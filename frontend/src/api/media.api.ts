import axios from "axios";

export const uploadMediaFilesRequest = async (files: File[], bucketName: string, path?: string)  => {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append("file", file));
    formData.append("bucketName", bucketName);
    if (path) formData.append("path", path);
    return axios
      .post("http://localhost:9000/api/media_asset/upload_images", formData, {
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
