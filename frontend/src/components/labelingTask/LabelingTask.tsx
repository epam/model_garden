import React, { useEffect, useState } from 'react';
import './LabelingTask.css';
import { Task, FormData } from './task';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ProgressLoader } from '../shared';
import { AppState } from '../../store';
import {
  getDatasets,
  getLabelingToolUsers,
  getUnsignedImagesCount,
  createLabelingTask
} from '../../store/labelingTask';
import { LabelingTaskRequestData } from '../../models';

export const LabelingTask: React.FC = () => {
  const dispatch = useDispatch();
  const buckets = useSelector((state: AppState) => state.main.buckets);
  const currentBucketId = useSelector((state: AppState) => state.labelingTask.currentBucketId);
  const datasets = useSelector((state: AppState) => state.labelingTask.datasets);
  const currentDatasetId = useSelector((state: AppState) => state.labelingTask.currentDatasetId);
  const users = useSelector((state: AppState) => state.labelingTask.labelingToolUsers);
  const unsignedImagesCount = useSelector((state: AppState) => state.labelingTask.unsignedImagesCount);
  const newTask = useSelector((state: AppState) => state.labelingTask.newTask);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    dispatch(getLabelingToolUsers());
  }, [dispatch]);

  useEffect(() => {
    if (currentBucketId) {
      dispatch(getDatasets(currentBucketId));
    }
  }, [dispatch, currentBucketId]);

  const handleGetUnsignedImagesCount = (datasetId: string) => {
    dispatch(getUnsignedImagesCount(datasetId));
  };

  const handleTaskSubmit = (data: FormData) => {
    (dispatch(
      createLabelingTask({
        task_name: data.taskName,
        dataset_id: currentDatasetId,
        assignee_id: data.user,
        files_in_task: data.filesInTask,
        count_of_tasks: data.countOfTasks
      } as LabelingTaskRequestData)
    ) as any)
      .then(() => setShowLoader(false))
      .catch(() => {
        setShowLoader(false);
        setError('Failed to create labeling task');
      });
  };

  return (
    <>
      <Task
        users={users}
        taskName={(datasets.get(currentDatasetId) || { path: '' }).path}
        filesCount={unsignedImagesCount}
        handleTaskSubmit={handleTaskSubmit}
        buckets={buckets}
        datasets={Array.from(datasets.values())}
        currentBucketId={currentBucketId}
        onDataSetChange={handleGetUnsignedImagesCount}
        newTask={newTask}
        setShowLoader={setShowLoader}
      />

      <ProgressLoader show={showLoader} />
      <Snackbar
        open={error !== ''}
        autoHideDuration={6000}
        onClose={() => {
          setError('');
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => {
            setError('');
          }}
          severity="error"
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};
