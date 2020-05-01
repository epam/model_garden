import axios from "axios";

export const uploadMediaFilesRequest = (files: File[], bucketName: string, path?: string)  => {
  const formData = new FormData();
  files.forEach(file => formData.append("file", file));
  formData.append("bucketName", bucketName);
  if (path) {
      formData.append("path", path);
  }
  return axios
    .post("http://localhost:9000/api/media-assets/upload/", formData, {
      headers: {
        "Content-Type": "application/zip",
      },
    });
};
