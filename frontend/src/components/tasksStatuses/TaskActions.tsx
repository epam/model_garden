import React from 'react';
import { Box, Button, makeStyles } from '@material-ui/core';
import { AppState } from '../../store';
import 'antd/dist/antd.css';
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
import { LabelingTaskStatus } from '../../models';

interface TaskActionsProps {
  openConformationDialog: boolean;
  tasks: LabelingTaskStatus[];
  selectedRowKeys: number[];
  setOpenConformationDialog: (state: boolean) => void;
  setOpenCreateTaskDialog: any;
  archiveLabelingTask: any;
  retryLabelingTask: any;
}

const TaskActionsComponent: React.FC<TaskActionsProps> = (props) => {
  const { openConformationDialog, tasks, selectedRowKeys } = props;
  const {
    setOpenConformationDialog,
    setOpenCreateTaskDialog,
    archiveLabelingTask,
    retryLabelingTask
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
          onClick={() => setOpenCreateTaskDialog(true)}
        >
          Create
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => setOpenConformationDialog(true)}
          disabled={isArchiveDisabled}
          className={classes.button}
        >
          Archive
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => retryLabelingTask()}
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
        setOpen={(isOpen: boolean) => setOpenConformationDialog(isOpen)}
        handleConfirm={() => archiveLabelingTask()}
      >
        <p>Are you sure you want to archive selected tasks?</p>
      </ConformationDialog>
    </>
  );
};

const mapStateToProps = ({ tasksStatuses }: AppState) => ({
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
