import React, { useState } from 'react';
import { Task, FormData } from './task';
import { SnackbarAlert } from '../shared';
import { connect, LabelingProps } from './util';

const LabelingTaskComponent: React.FC<LabelingProps> = (props) => {
  const [error, setError] = useState('');

  const handleTaskSubmit = (data: FormData) => {
    props.createLabelingTask(data).catch(() => {
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
      />
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
