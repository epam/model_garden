import React, { ChangeEvent, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel
} from '@material-ui/core';
import './Task.css';
import { FilesCounter } from '../filesCounter';
import { Notification } from '../notification';
import { Bucket, Dataset, LabelingToolUser } from '../../../models';
import { FormContainer } from '../../shared';
import { DEFAULT_FORM_DATA } from './constants';
import {
  setCurrentBucketId,
  setCurrentDatasetId,
  clearNewTaskData,
  getUnsignedImagesCountSuccess
} from '../../../store/labelingTask';

interface TaskProps {
  users: LabelingToolUser[];
  taskName: string;
  filesCount: number;
  handleTaskSubmit: (data: FormData) => void;
  buckets: Bucket[];
  datasets: Dataset[];
  currentBucketId: string;
  onDataSetChange: (datasetId: string) => void;
  newTask: { location: string };
  setShowLoader: Function;
}

export type FormData = {
  taskName: string;
  user: string | number;
  filesInTask: number;
  countOfTasks: number;
};

export const Task: React.FC<TaskProps> = ({
  users,
  taskName,
  filesCount,
  handleTaskSubmit,
  buckets,
  datasets,
  currentBucketId,
  onDataSetChange,
  newTask,
  setShowLoader
}: TaskProps) => {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [counter, setCounter] = useState({
    filesInTask: DEFAULT_FORM_DATA.FILES_IN_TASK_VALUE.toString(),
    countOfTasks: DEFAULT_FORM_DATA.COUNT_OF_TASKS.toString()
  });
  const dispatch = useDispatch();

  const { handleSubmit, setValue, control, watch } = useForm<FormData>({
    defaultValues: {
      taskName: DEFAULT_FORM_DATA.TASK_NAME,
      user: DEFAULT_FORM_DATA.USER
    }
  });

  const { taskName: taskNameValue, user: userValue } = watch([
    'taskName',
    'user'
  ]);

  useEffect(() => {
    setValue('taskName', taskName);
  }, [taskName, setValue]);

  useEffect(() => {
    dispatch(setCurrentBucketId(''));
    dispatch(setCurrentDatasetId(''));
  }, [dispatch]);

  useEffect(() => {
    if (!currentBucketId) {
      dispatch(setCurrentDatasetId(''));
    }
  }, [dispatch, currentBucketId]);

  const onSubmit = handleSubmit((data: FormData) => {
    data.filesInTask = Number(counter.filesInTask);
    data.countOfTasks = Number(counter.countOfTasks);
    setShowLoader(true);
    handleTaskSubmit(data);
  });

  // clear form on a new task is created
  useEffect(() => {
    setSelectedDataset('');
    dispatch(setCurrentDatasetId(''));
    dispatch(getUnsignedImagesCountSuccess(0));
    setCounter({ filesInTask: '0', countOfTasks: '0' });
  }, [dispatch, newTask]);

  const clearTaskData = () => {
    dispatch(clearNewTaskData());
  };

  const usersSelectOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.full_name} ({user.email})
    </MenuItem>
  ));

  const handleBucketChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    if (e.target.value) {
      dispatch(setCurrentBucketId(e.target.value as string));
    }
  };

  const handleDatasetChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    let datasetId: string = e.target.value as string;
    setSelectedDataset(datasetId);
    dispatch(setCurrentDatasetId(datasetId));
    onDataSetChange(datasetId);
  };

  const bucketsSelectOptions = buckets.map((bucket: Bucket) => (
    <MenuItem key={bucket.id} value={bucket.id}>
      {bucket.name}
    </MenuItem>
  ));

  const datasetsSelectOptions = datasets.map((dataset: Dataset) => (
    <MenuItem key={dataset.id} value={dataset.id}>
      {dataset.path}
    </MenuItem>
  ));

  const validateNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    let value = event.target.value;
    const isNum = /^\d+$/;

    if (!isNum.test(value) && value !== '') {
      return;
    } else {
      if (isNum.test(value) && Number(value) > filesCount) {
        value = filesCount.toString();
      }

      if (name === 'filesInTask' && counter.countOfTasks === '0') {
        const calculatedValue = filesCount / parseInt(value);
        const newCalculatedValue = isNaN(calculatedValue) ? 0 : calculatedValue;
        const calculatedValueString = Math.ceil(newCalculatedValue);
        setCounter((counter) => ({
          ...counter,
          countOfTasks:
            calculatedValueString !== Infinity
              ? calculatedValueString.toString()
              : '0',
          [name]: value
        }));
      } else if (name === 'countOfTasks' && counter.filesInTask === '0') {
        const calculatedValue = filesCount / parseInt(value);
        const newCalculatedValue = isNaN(calculatedValue) ? 0 : calculatedValue;
        const calculatedValueString = Math.ceil(newCalculatedValue);

        setCounter((counter) => ({
          ...counter,
          filesInTask:
            calculatedValueString !== Infinity
              ? calculatedValueString.toString()
              : '0',
          [name]: value
        }));
      } else {
        setCounter((counter) => ({
          ...counter,
          [name]: value
        }));
      }
    }
  };

  return (
    <div className="task">
      <FormContainer>
        <Typography variant="h1">Create Tasks</Typography>
        <form onSubmit={onSubmit} className="task__form">
          <FormControl className="task__form-item">
            <InputLabel id="task-bucket-name">Bucket</InputLabel>
            <Select
              labelId="task-bucket-name"
              name="bucketId"
              label="Bucket"
              value={currentBucketId}
              onChange={handleBucketChange}
            >
              {bucketsSelectOptions}
            </Select>
          </FormControl>
          <FormControl className="task__form-item">
            <InputLabel id="task-datasets">Dataset</InputLabel>
            <Select
              labelId="task-datasets"
              name="dataset"
              label="Dataset"
              value={selectedDataset}
              onChange={handleDatasetChange}
              disabled={currentBucketId === DEFAULT_FORM_DATA.BUCKET_ID}
            >
              {datasetsSelectOptions}
            </Select>
          </FormControl>
          <Controller
            className="task__form-item"
            name="taskName"
            label="Task Name"
            defaultValue=""
            control={control}
            as={<TextField />}
          />
          <div className="task__form-group">
            <FilesCounter
              filesCount={filesCount}
              className="task__form-left-item"
            />
            <FormControl className="task__form-right-item">
              <InputLabel id="task-labeling-tool-user">
                Labeling tool user
              </InputLabel>
              <Controller
                labelId="task-labeling-tool-user"
                name="user"
                label="Labeling tool user"
                control={control}
                as={<Select>{usersSelectOptions}</Select>}
              />
            </FormControl>
          </div>
          <div className="task__form-group">
            <TextField
              className="task__form-left-item"
              name="filesInTask"
              label="Files in task"
              type="tel"
              value={counter.filesInTask}
              disabled={!filesCount}
              onChange={validateNumber}
            />
            <TextField
              className="task__form-right-item"
              name="countOfTasks"
              label="Count of tasks"
              type="tel"
              value={counter.countOfTasks}
              disabled={!filesCount}
              onChange={validateNumber}
            />
          </div>
          <Button
            className="task__form-item"
            type="submit"
            color="primary"
            variant="contained"
            disabled={
              currentBucketId === DEFAULT_FORM_DATA.BUCKET_ID ||
              selectedDataset === DEFAULT_FORM_DATA.DATASET ||
              taskNameValue === DEFAULT_FORM_DATA.TASK_NAME ||
              userValue === DEFAULT_FORM_DATA.USER ||
              Number(counter.countOfTasks) ===
                DEFAULT_FORM_DATA.COUNT_OF_TASKS ||
              Number(counter.filesInTask) ===
                DEFAULT_FORM_DATA.FILES_IN_TASK_VALUE
            }
          >
            Assign
          </Button>
        </form>
      </FormContainer>

      <Notification newTask={newTask} onClose={clearTaskData} />
    </div>
  );
};
