import React from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import { TAppState } from '../../store';
import './TasksStatuses.css';
import { CreateTaskDialog } from './createTaskDialog';
import { ConformationDialog } from '../shared';
import { connect } from 'react-redux';
import {
  archiveLabelingTask,
  retryLabelingTask,
  setOpenConformationDialog
} from '../../store/tasksStatuses';
import { setOpenCreateTaskDialog } from '../../store/labelingTask';
import { ILabelingTaskStatus } from '../../models';

interface ITaskActionsProps {
  openConformationDialog: boolean;
  tasks: ILabelingTaskStatus[];
  selectedRowKeys: number[];
  setOpenConformationDialog: (state: boolean) => void;
  setOpenCreateTaskDialog: any;
  archiveLabelingTask: any;
  retryLabelingTask: any;
}

const TaskActionsComponent: React.FC<ITaskActionsProps> = (props) => {
  const { openConformationDialog, tasks, selectedRowKeys } = props;
  const {
    setOpenConformationDialog: propsSetOpenConformationDialog,
    setOpenCreateTaskDialog: propsSetOpenCreateTaskDialog,
    archiveLabelingTask: propsArchiveLabelingTask,
    retryLabelingTask: propsRetryLabelingTask
  } = props;

  const classes = makeStyles((theme) => ({
    button: {
      marginLeft: theme.spacing(1)
    }
  }))();

  const SelectedTasks = tasks.filter((task) =>
    selectedRowKeys.includes(task.id)
  );
  const isArchiveDisabled =
    !SelectedTasks.length ||
    SelectedTasks.some((task) => task.status !== 'saved');

  const isRetryDisabled =
    !SelectedTasks.length ||
    SelectedTasks.some((task) => task.status !== 'failed');

  return (
    <>
      <Box display="flex" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          onClick={() => propsSetOpenCreateTaskDialog(true)}
        >
          Create
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => propsSetOpenConformationDialog(true)}
          disabled={isArchiveDisabled}
          className={classes.button}
        >
          Archive
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => propsRetryLabelingTask()}
          disabled={isRetryDisabled}
          className={classes.button}
        >
          Retry
        </Button>
      </Box>

      <CreateTaskDialog />

      <ConformationDialog
        title="Archive Confirmation"
        closeButton="No, Keep Task(s)"
        confirmButton="Yes, Archive Task(s)"
        open={openConformationDialog}
        setOpen={(isOpen: boolean) => propsSetOpenConformationDialog(isOpen)}
        handleConfirm={() => propsArchiveLabelingTask()}
      >
        <p>Are you sure you want to archive selected tasks?</p>
      </ConformationDialog>
    </>
  );
};

const mapStateToProps = ({ tasksStatuses }: TAppState) => ({
  tasks: tasksStatuses.tasks,
  selectedRowKeys: tasksStatuses.selectedRowKeys,
  openConformationDialog: tasksStatuses.openConformationDialog
});

const mapDispatchToProps = {
  setOpenConformationDialog,
  setOpenCreateTaskDialog,
  archiveLabelingTask,
  retryLabelingTask
};

export const TaskActions = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskActionsComponent);
