import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './LabelingTask.css';
import { Task, FormData } from './task';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ProgressLoader } from '../shared';
import { Bucket, Dataset } from '../../models';
import { SnackbarAlert } from '../snackbarAlert';

import { mstp, actions } from './util';

interface LabelingProps {
  buckets: Bucket[];
  datasets: Dataset[];
  currentBucketId: string;
  currentDatasetId: string;
  newTask: any;
  users: any;
  unsignedImagesCount: any;
  getLabelingToolUsers: any;
  getUnsignedImagesCount: any;
  createLabelingTask: any;
  getDatasets: any;
}

const LabelingTaskComponent: React.FC<LabelingProps> = (props) => {
  const {
    buckets,
    datasets,
    currentBucketId,
    currentDatasetId,
    newTask,
    users,
    unsignedImagesCount,
    getLabelingToolUsers,
    getUnsignedImagesCount,
    createLabelingTask,
    getDatasets
  } = props;
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    //on enter, get users, and get datasets if bucketSelected
    getLabelingToolUsers();
    currentBucketId && getDatasets(currentBucketId);
  }, [currentBucketId]);

  const handleTaskSubmit = (data: FormData) => {
    createLabelingTask(data)
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
        taskName={
          datasets.find(({ id }: Dataset) => id === currentDatasetId)?.path ??
          ''
        }
        filesCount={unsignedImagesCount}
        handleTaskSubmit={handleTaskSubmit}
        buckets={buckets}
        datasets={datasets}
        currentBucketId={currentBucketId}
        onDataSetChange={getUnsignedImagesCount}
        newTask={newTask}
        setShowLoader={setShowLoader}
      />
      <ProgressLoader show={showLoader} />
      <SnackbarAlert
        open={error !== ''}
        onClose={() => {
          setError('');
        }}
        severity="error"
      >
        {error}
      </SnackbarAlert>
    </>
  );
};

export const LabelingTask = connect(mstp, actions)(LabelingTaskComponent);
