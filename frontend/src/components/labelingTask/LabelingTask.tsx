import React, { useEffect } from "react";
import "./LabelingTask.css";
import { ImagesLocation } from "../shared/imagesLocation";
import { Task, FormData } from "./task";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../store";
import {
  getBucketPaths,
  getLabelingToolUsers,
  getUnsignedImagesCount,
  createLabelingTask,
} from "../../store/labelingTask";
import { LabelingTaskRequestData } from "../../models";

export const LabelingTask: React.FC = () => {
  const dispatch = useDispatch();
  const bucketNames = useSelector((state: AppState) => state.main.bucketNames);
  const currentBucketName = useSelector(
    (state: AppState) => state.labelingTask.currentBucketName
  );
  const paths = useSelector((state: AppState) => state.labelingTask.paths);
  const currentPath = useSelector(
    (state: AppState) => state.labelingTask.currentPath
  );
  const users = useSelector(
    (state: AppState) => state.labelingTask.labelingToolUsers
  );
  const unsignedImagesCount = useSelector(
    (state: AppState) => state.labelingTask.unsignedImagesCount
  );

  useEffect(() => {
    dispatch(getLabelingToolUsers());
  }, [dispatch]);

  useEffect(() => {
    if (currentBucketName) {
      dispatch(getBucketPaths(currentBucketName));
    }
  }, [dispatch, currentBucketName]);

  const handleGetUnsignedImagesCount = () => {
    dispatch(getUnsignedImagesCount(currentBucketName, currentPath));
  };

  const handleTaskSubmit = (data: FormData) => {
    dispatch(
      createLabelingTask({
        ...data,
        userId: data.user,
        bucketName: currentBucketName,
        bucketPath: currentPath,
      } as LabelingTaskRequestData)
    );
  };

  return (
    <>
      <ImagesLocation
        title="Select images location"
        buttonName="Get unassigned images count"
        bucketNames={bucketNames}
        paths={paths}
        currentBucketName={currentBucketName}
        currentPath={currentPath}
        handleFormSubmit={handleGetUnsignedImagesCount}
      />
      <Task
        users={users}
        taskName={currentPath}
        filesCount={unsignedImagesCount}
        handleTaskSubmit={handleTaskSubmit}
      />
    </>
  );
};
