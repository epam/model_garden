import React, { useEffect } from "react";
import "./LabelingTask.css";
import { ImagesLocation } from "../shared/imagesLocation";
import { Task, FormData } from "./task";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../store";
import {
  getDatasets,
  getLabelingToolUsers,
  getUnsignedImagesCount,
  createLabelingTask,
} from "../../store/labelingTask";
import { LabelingTaskRequestData } from "../../models";

export const LabelingTask: React.FC = () => {
  const dispatch = useDispatch();
  const buckets = useSelector((state: AppState) => state.main.buckets);
  const currentBucketId = useSelector((state: AppState) => state.labelingTask.currentBucketId);
  const datasets = useSelector((state: AppState) => state.labelingTask.datasets);
  const currentDatasetId = useSelector((state: AppState) => state.labelingTask.currentDatasetId);
  const users = useSelector((state: AppState) => state.labelingTask.labelingToolUsers);
  const unsignedImagesCount = useSelector((state: AppState) => state.labelingTask.unsignedImagesCount);

  useEffect(() => {
    dispatch(getLabelingToolUsers());
  }, [dispatch]);

  useEffect(() => {
    if (currentBucketId) {
      dispatch(getDatasets(currentBucketId));
    }
  }, [dispatch, currentBucketId]);

  const handleGetUnsignedImagesCount = () => {
    if (currentDatasetId) {
      dispatch(getUnsignedImagesCount(currentDatasetId));
    }
  };

  const handleTaskSubmit = (data: FormData) => {
    dispatch(
      createLabelingTask({
        task_name: data.taskName,
        dataset_id: currentDatasetId,
        assignee_id: data.user,
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
        datasets={Array.from(datasets.values())}
        currentBucketId={currentBucketId}
        handleFormSubmit={handleGetUnsignedImagesCount}
      />
      <Task
        users={users}
        taskName={(datasets.get(currentDatasetId) || {path: ""}).path}
        filesCount={unsignedImagesCount}
        handleTaskSubmit={handleTaskSubmit}
      />
    </>
  );
};
