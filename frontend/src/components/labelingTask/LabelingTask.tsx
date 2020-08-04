import React from 'react';
import { Task } from './task';
import { connect, LabelingProps } from './util';

const LabelingTaskComponent: React.FC<LabelingProps> = (props) => (
  //can we please merge this and ./task/Task.tsx ?
  <Task
    buckets={props.buckets}
    datasets={props.datasets}
    users={props.users}
    filesCount={props.unsignedImagesCount}
    handleTaskSubmit={props.createLabelingTask}
    onDataSetChange={props.getUnsignedImagesCount}
  />
);

export const LabelingTask = connect(LabelingTaskComponent);
