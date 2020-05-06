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
  const buckets = useSelector((state: AppState) => state.main.buckets);
  const currentBucketId = useSelector((state: AppState) => state.labelingTask.currentBucketId);
  const paths = useSelector((state: AppState) => state.labelingTask.paths);
  const currentPath = useSelector((state: AppState) => state.labelingTask.currentPath);
  const users = useSelector((state: AppState) => state.labelingTask.labelingToolUsers);
  const unsignedImagesCount = useSelector((state: AppState) => state.labelingTask.unsignedImagesCount);

  useEffect(() => {
    dispatch(getLabelingToolUsers());
  }, [dispatch]);

  useEffect(() => {
    if (currentBucketId) {
      dispatch(getBucketPaths(currentBucketId));
    }
  }, [dispatch, currentBucketId]);

  const handleGetUnsignedImagesCount = () => {
    dispatch(getUnsignedImagesCount(currentBucketId, currentPath));
  };

  const handleTaskSubmit = (data: FormData) => {
    dispatch(
      createLabelingTask({
        task_name: data.taskName,
        assignee_id: data.user,
        bucket_id: currentBucketId,
        bucket_path: currentPath,
        files_in_task: data.filesInTask,
        count_of_tasks: data.countOfTasks,
      } as LabelingTaskRequestData)
    );
  };

  return (
    <>
      <ImagesLocation
        title="Select images location"
        buttonName="Get unassigned images count"
        buckets={buckets}
        paths={paths}
        currentBucketId={currentBucketId}
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
