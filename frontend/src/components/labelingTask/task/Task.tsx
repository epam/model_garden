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
import Autocomplete from '@material-ui/lab/Autocomplete';
import './Task.css';
import { FilesCounter } from '../filesCounter';
import { Notification } from '../notification';
import { Bucket, Dataset, LabelingToolUser } from '../../../models';
import { FormContainer } from '../../shared';
import { getDatasets } from '../../../store/data';
import { DEFAULT_FORM_DATA } from './constants';
import {
  clearUnsignedImagesCount,
  clearTaskUrl
} from '../../../store/labelingTask';

interface TaskProps {
  buckets: Bucket[];
  datasets: Dataset[];
  users: LabelingToolUser[];
  filesCount: number;
  newTaskUrl: string;
  handleTaskSubmit: (data: FormData) => void;
  onDataSetChange: (datasetId: string) => void;
  setShowLoader: Function;
}

export type FormData = {
  currentDatasetId: string;
  taskName: string;
  user: string | number;
  filesInTask: number;
  countOfTasks: number;
};

export const Task: React.FC<TaskProps> = ({
  buckets,
  datasets,
  users,
  filesCount,
  handleTaskSubmit,
  onDataSetChange,
  newTaskUrl,
  setShowLoader
}: TaskProps) => {
  const [currentBucketId, setCurrentBucketId] = useState('');
  const [currentDataset, setCurrentDataset] = useState({
    id: '',
    path: '',
    bucket: ''
  });
  const [dataSetField, setDataSetField] = useState('');
  const [taskName, setTaskName] = useState('');
  const [counter, setCounter] = useState({
    filesInTask: DEFAULT_FORM_DATA.FILES_IN_TASK_VALUE.toString(),
    countOfTasks: DEFAULT_FORM_DATA.COUNT_OF_TASKS.toString()
  });
  const dispatch = useDispatch();

  const { handleSubmit, setValue, control, watch, register } = useForm<
    FormData
  >({
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
    if (currentBucketId) {
      dispatch(getDatasets(currentBucketId));
    }
  }, [currentBucketId, dispatch]);

  useEffect(() => {
    setValue('taskName', taskName);
  }, [taskName, setValue, currentDataset]);

  // clear form on a new task is created
  useEffect(() => {
    clearForm();
    dispatch(clearUnsignedImagesCount());
  }, [dispatch, newTaskUrl]);

  const onSubmit = handleSubmit((data: FormData) => {
    data.filesInTask = Number(counter.filesInTask);
    data.countOfTasks = Number(counter.countOfTasks);
    data.currentDatasetId = currentDataset.id;
    setShowLoader(true);
    handleTaskSubmit(data);
  });

  const handleBucketChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    if (e.target.value) {
      setCurrentBucketId(e.target.value as string);
    }
  };

  const handleDatasetChange = (
    e: any,
    dataset: Dataset | null,
    reason: string
  ) => {
    if (dataset) {
      setCurrentDataset(dataset);
      setTaskName(dataset.path);
      onDataSetChange(dataset.id);
      setCounter({ filesInTask: '0', countOfTasks: '0' });
    }
    if (reason === 'clear') {
      clearForm();
      dispatch(clearUnsignedImagesCount());
    }
  };

  const clearForm = () => {
    setCurrentDataset({
      id: '',
      path: '',
      bucket: ''
    });
    setTaskName('');
    setDataSetField('');
    setCounter({ filesInTask: '0', countOfTasks: '0' });
  };

  const clearTaskData = () => {
    dispatch(clearTaskUrl());
  };

  const bucketsSelectOptions = buckets.map((bucket: Bucket) => (
    <MenuItem key={bucket.id} value={bucket.id}>
      {bucket.name}
    </MenuItem>
  ));

  const usersSelectOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.full_name} ({user.email})
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
    <>
      <FormContainer>
        <Typography variant="h1">Create Tasks</Typography>
        <form onSubmit={onSubmit}>
          <FormControl>
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
          <Autocomplete
            onChange={handleDatasetChange}
            options={datasets}
            getOptionLabel={(option) => option.path}
            inputValue={dataSetField}
            onInputChange={(e: object, value: string) => {
              setDataSetField(value);
            }}
            disabled={currentBucketId === DEFAULT_FORM_DATA.BUCKET_ID}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={register({
                  required: true
                })}
                name="dataset"
                label="Dataset"
              />
            )}
          />
          <Controller
            name="taskName"
            label="Task Name"
            defaultValue=""
            control={control}
            as={<TextField />}
          />
          <div className="task__form-group">
            <div className="task__form-item">
              <FilesCounter filesCount={filesCount} />
            </div>
            <div className="task__form-item">
              <FormControl>
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
          </div>
          <div className="task__form-group">
            <div className="task__form-item">
              <TextField
                name="filesInTask"
                label="Files in task"
                type="tel"
                value={counter.filesInTask}
                disabled={!filesCount}
                onChange={validateNumber}
              />
            </div>
            <div className="task__form-item">
              <TextField
                name="countOfTasks"
                label="Count of tasks"
                type="tel"
                value={counter.countOfTasks}
                disabled={!filesCount}
                onChange={validateNumber}
              />
            </div>
          </div>
          <Button
            fullWidth={true}
            type="submit"
            color="primary"
            variant="contained"
            disabled={
              currentBucketId === DEFAULT_FORM_DATA.BUCKET_ID ||
              currentDataset.id === DEFAULT_FORM_DATA.DATASET ||
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
      <Notification newTaskUrl={newTaskUrl} onClose={clearTaskData} />
    </>
  );
};
