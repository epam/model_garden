import React, { useState } from 'react';
import { Task, FormData } from './task';
import { ProgressLoader, SnackbarAlert } from '../shared';
import { connect, LabelingProps } from './util';

const LabelingTaskComponent: React.FC<LabelingProps> = (props) => {
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(false);

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
        buckets={props.buckets}
        datasets={props.datasets}
        users={props.users}
        filesCount={props.unsignedImagesCount}
        handleTaskSubmit={handleTaskSubmit}
        onDataSetChange={props.getUnsignedImagesCount}
        newTaskUrl={props.newTaskUrl}
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
