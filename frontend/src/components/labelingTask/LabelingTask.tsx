import React, { useEffect, useState } from 'react';
import { Task, FormData } from './task';
import { ProgressLoader } from '../shared';
import { Dataset } from '../../models';
import { SnackbarAlert } from '../snackbarAlert';
import { connect, LabelingProps } from './util';

const LabelingTaskComponent: React.FC<LabelingProps> = (props) => {
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    //on enter, get users, and get datasets if bucketSelected
    props.getLabelingToolUsers();
    props.currentBucketId && props.getDatasets(props.currentBucketId);
  }, [props.currentBucketId]);

  const handleTaskSubmit = (data: FormData) => {
    props
      .createLabelingTask(data)
      .then(() => setShowLoader(false))
      .catch(() => {
        setShowLoader(false);
        setError('Failed to create labeling task');
      });
  };

  return (
    <>
      <Task
        users={props.users}
        taskName={
          props.datasets.find(
            ({ id }: Dataset) => id === props.currentDatasetId
          )?.path ?? ''
        }
        filesCount={props.unsignedImagesCount}
        handleTaskSubmit={handleTaskSubmit}
        buckets={props.buckets}
        datasets={props.datasets}
        currentBucketId={props.currentBucketId}
        onDataSetChange={props.getUnsignedImagesCount}
        newTask={props.newTask}
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

export const LabelingTask = connect(LabelingTaskComponent);
