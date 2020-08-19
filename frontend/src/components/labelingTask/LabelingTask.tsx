import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useForm, Controller } from 'react-hook-form';
import { AppState } from '../../store';
import {
  clearUnsignedImagesCount,
  getUnsignedImagesCount,
  createLabelingTask
} from '../../store/labelingTask';
import { getDatasets } from '../../store/data';
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
import { LabelingProps } from './util';
import './LabelingTask.css';
import { FormContainer } from '../shared';
import { FilesCounter } from './filesCounter';

import { Bucket, Dataset, LabelingToolUser } from '../../models';

export type FormData = {
  currentDatasetId: string;
  taskName: string;
  user: string | number;
  filesInTask: number;
  countOfTasks: number;
};

const LabelingTaskComponent: React.FC<LabelingProps> = (props: any) => {
  const { buckets, datasets, users, filesCount } = props;
  const { getDatasets, getUnsignedImagesCount, createLabelingTask } = props;

  const [currentBucketId, setCurrentBucketId] = useState('');
  const [currentDataset, setCurrentDataset] = useState({
    id: '',
    path: '',
    bucket: ''
  });
  const [datasetField, setdatasetField] = useState('');
  const [counter, setCounter] = useState({
    filesInTask: '0',
    countOfTasks: '0'
  });
  const dispatch = useDispatch();

  const { handleSubmit, setValue, control, formState, reset } = useForm<
    FormData
  >({
    mode: 'onChange',
    defaultValues: {
      // currentDatasetId: '',
      taskName: '',
      user: ''
      // filesInTask: 0,
      // countOfTasks: 0
    }
  });

  useEffect(() => {
    if (currentBucketId) {
      getDatasets(currentBucketId);
    }
  }, [currentBucketId, getDatasets]);

  useEffect(() => {
    setValue('taskName', currentDataset.path, {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [setValue, currentDataset]);

  const resetForm = () => {
    setCurrentDataset({
      id: '',
      path: '',
      bucket: ''
    });
    setdatasetField('');
    reset({
      taskName: '',
      user: ''
    });
    setCounter({ filesInTask: '0', countOfTasks: '0' });
  };

  const onSubmit = handleSubmit((data: FormData) => {
    data.filesInTask = Number(counter.filesInTask);
    data.countOfTasks = Number(counter.countOfTasks);
    data.currentDatasetId = currentDataset.id;

    createLabelingTask(data)
      .then(unwrapResult)
      .then(() => {
        resetForm();
        dispatch(clearUnsignedImagesCount());
      });
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
      getUnsignedImagesCount(dataset.id);
      setCounter({ filesInTask: '0', countOfTasks: '0' });
    }
    if (reason === 'clear') {
      resetForm();

      dispatch(clearUnsignedImagesCount());
    }
  };

  const bucketsSelectOptions = buckets.map((bucket: Bucket) => (
    <MenuItem key={bucket.id} value={bucket.id}>
      {bucket.name}
    </MenuItem>
  ));

  const usersSelectOptions = users.map((user: LabelingToolUser) => (
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
            inputValue={datasetField}
            onInputChange={(e: object, value: string) => {
              setdatasetField(value);
            }}
            disabled={!currentBucketId}
            renderInput={(params) => (
              <TextField {...params} name="dataset" label="Dataset" />
            )}
          />
          <Controller
            name="taskName"
            label="Task Name"
            control={control}
            rules={{ required: true }}
            as={<TextField />}
          />
          <div className="task__form-group">
            <div className="task__form-item">
              <FilesCounter filesCount={filesCount} />
            </div>
            <div className="task__form-item">
              <FormControl>
                <InputLabel id="labeling-task-user">
                  Labeling tool user
                </InputLabel>
                <Controller
                  labelId="labeling-task-user"
                  name="user"
                  label="Labeling tool user"
                  control={control}
                  rules={{ required: true }}
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
              currentBucketId === '' ||
              currentDataset.id === '' ||
              counter.countOfTasks === '0' ||
              counter.filesInTask === '0' ||
              !formState.isValid
            }
          >
            Assign
          </Button>
        </form>
      </FormContainer>
    </>
  );
};

const mapStateToProps = ({ labelingTask, data }: AppState) => ({
  buckets: data.buckets,
  datasets: data.datasets,
  users: data.labelingToolUsers,
  filesCount: labelingTask.unsignedImagesCount
});

export const LabelingTask = connect(mapStateToProps, {
  getDatasets,
  getUnsignedImagesCount,
  createLabelingTask
})(LabelingTaskComponent);
