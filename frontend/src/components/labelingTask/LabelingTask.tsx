import React, { useEffect } from "react";
import "./LabelingTask.css";
import { ImagesLocation } from "./imgaseLocation";
import { Task } from "./task";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../store";
import {
  getBucketPaths,
  getLabelingToolUsers,
  getUnsignedImagesCount,
} from "../../store/labelingTask";

interface LabelingTaskProps {}

export const LabelingTask: React.FC = ({}: LabelingTaskProps) => {
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

  return (
    <>
      <ImagesLocation
        bucketNames={bucketNames}
        paths={paths}
        // currentBucketName={currentBucketName}
        currentPath={currentPath}
        handleFormSubmit={handleGetUnsignedImagesCount}
      />
      <Task
        users={users}
        taskName={currentPath}
        filesCount={unsignedImagesCount}
      />
    </>
  );
};
