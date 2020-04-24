import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, Tabs, Tab, Button } from "@material-ui/core";
// import axios from "axios";
import { createLabelingTask } from "../store/labelingTask";
import { Task } from "../models";
import { login } from "../store/auth";
import { UploadImages, LabelingTask } from "../components";
import { setSelectedMenuItem, getBucketNames } from '../store/main/actions';
import { AppState } from '../store';
import { uploadMediaFiles, setMediaFiles } from "../store/media";

// TODO: Refactor this file. In fact, this is just a stub to work out some use cases.
// const taskData: Task = {
//   task_data: {
//     name: "NewTask",
//     owner: 1,
//     assignee: 1,
//     labels: [
//       {
//         name: "newLabel",
//         attributes: [],
//       },
//     ],
//     image_quality: 70,
//     z_order: false,
//     segment_size: "10",
//     overlap: "1",
//     // start_frame: "1",
//     // stop_frame: "1",
//     // frame_filter: "step=1",
//     segments: [],
//   },
//   images_data: {
//     remote_files: [
//       "https://cdn.pixabay.com/photo/2015/06/19/21/24/the-road-815297__340.jpg",
//       "https://cdn.cnn.com/cnnnext/dam/assets/191203174105-edward-whitaker-1-large-169.jpg",
//       "https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg",
//     ],
//   },
// };

export const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const selectedMenuItem = useSelector((state: AppState) => state.main.selectedMenuItemIndex);
  const bucketNames = useSelector((state: AppState) => state.main.bucketNames);
  const isFilesUploading = useSelector((state: AppState) => state.media.isUploading);
  const mediaFiles = useSelector((state: AppState) => state.media.mediaFiles);
  const errorMessage = useSelector((state: AppState) => state.media.uploadingErrorMessage);

  useEffect(() => {
    dispatch(getBucketNames());
  }, [dispatch]);

  // useEffect(() => {
  //   setSelectedMenuItem()
  // });

  const handleSelectMenuItem = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    dispatch(setSelectedMenuItem(newValue));
  };

  // useEffect(() => {
  //   dispatch(login("epam_labler", "epam_mlcv"));
  // }, []);

  // const handleCreateTask = () => {
  //   dispatch(createLabelingTask({} as Task));
  // };

  // const handleImagesFileChange = (event: any) => {
  //   const file: File = event.target.files[0];
  //   console.log("event file: ", file);
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   axios
  //     .post("http://localhost:9000/api/media_asset/upload_images_zip", formData
  //     , {
  //       headers: {
  //         "Content-Type": "application/zip",
  //       },

  //     }
  //     )
  //     .then((res) => console.log(res.data));
  // };

  const handleUploadImagesSubmit = (bucketName: string, path: string) => {
    dispatch(uploadMediaFiles(mediaFiles, bucketName, path));
  };

  const handleDropFiles = (files: File[]) => {
    dispatch(setMediaFiles(files));
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={selectedMenuItem} onChange={handleSelectMenuItem}>
          <Tab label="Upload Images" />
          <Tab label="Create Labeling Task" />
        </Tabs>
      </AppBar>
      {errorMessage && (<h1>{errorMessage}</h1>)}
      {selectedMenuItem === 0 && (
        <UploadImages
          bucketNames={bucketNames}
          isFilesUploading={isFilesUploading}
          handleUploadImagesSubmit={handleUploadImagesSubmit}
          handleDropFiles={handleDropFiles}
        />
      )}
      {selectedMenuItem === 1 && <LabelingTask />}
    </>
  );
};
