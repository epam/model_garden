import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useForm, Controller } from 'react-hook-form';
import { AppState } from '../../../store';
import {
  setOpenCreateTaskDialog,
  clearUnsignedImagesCount,
  getUnsignedImagesCount,
  createLabelingTask
} from '../../../store/labelingTask';
import { getDatasets } from '../../../store/data';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  DialogActions,
  withStyles
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { LabelingProps, FormData } from './util';
import './CreateTaskDialog.css';
import { FilesCounter } from './filesCounter';
import { Bucket, Dataset, LabelingToolUser } from '../../../models';

export const CustomDialogContent = withStyles({
  root: {
    paddingBottom: '0'
  }
})(DialogContent);

const LabelingTaskComponent: React.FC<LabelingProps> = (props) => {
  const { buckets, datasets, users, filesCount, openCreateTaskDialog } = props;
  const {
    getDatasets,
    getUnsignedImagesCount,
    createLabelingTask,
    clearUnsignedImagesCount,
    setOpenCreateTaskDialog
  } = props;

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

  const { handleSubmit, setValue, control, formState, reset } = useForm<
    FormData
  >({
    mode: 'onChange',
    defaultValues: {
      taskName: '',
      user: ''
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
        clearUnsignedImagesCount();
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

      clearUnsignedImagesCount();
    }
  };

  const handleDialogClose = () => {
    setOpenCreateTaskDialog(false);
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

  const getCounterTaskArgs = (value: any, name: string) => {
    const validNames = ['filesInTask', 'countOfTasks'];
    const counterTaskArgs: any = {};

    if (validNames.includes(name) && counter.countOfTasks === '0') {
      const calculatedValue = filesCount / parseInt(value);
      const newCalculatedValue = isNaN(calculatedValue) ? 0 : calculatedValue;
      const calculatedValueString = Math.ceil(newCalculatedValue);

      const inTask =
        calculatedValueString !== Infinity
          ? calculatedValueString.toString()
          : '0';

      if (name === 'filesInTask') {
        counterTaskArgs.countOfTasks = inTask;
      } else if (name === 'countOfTasks') {
        counterTaskArgs.filesInTask = inTask;
      }
    }

    return counterTaskArgs;
  };

  const validateNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    let value = event.target.value;
    const isNum = /^\d+$/;

    if (!isNum.test(value) && value !== '') {
      return;
    }

    if (isNum.test(value) && Number(value) > filesCount) {
      value = filesCount.toString();
    }

    const counterArgs = getCounterTaskArgs(value, name);

    setCounter((counterParam) => ({
      ...counterParam,
      [name]: value,
      ...counterArgs
    }));
  };

  return (
    <Dialog
      open={openCreateTaskDialog}
      onClose={handleDialogClose}
      scroll="body"
    >
      <DialogTitle>Create Tasks</DialogTitle>
      <form onSubmit={onSubmit} className="dialog-form">
        <CustomDialogContent dividers>
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
        </CustomDialogContent>
        <DialogActions>
          <Button type="button" color="primary" onClick={handleDialogClose}>
            Close
          </Button>
          <Button
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
        </DialogActions>
      </form>
    </Dialog>
  );
};

const mapStateToProps = ({ labelingTask, data }: AppState) => ({
  buckets: data.buckets,
  datasets: data.datasets,
  users: data.labelingToolUsers,
  filesCount: labelingTask.unsignedImagesCount,
  openCreateTaskDialog: labelingTask.openCreateTaskDialog
});

const mapDispatchToProps = {
  setOpenCreateTaskDialog,
  getDatasets,
  clearUnsignedImagesCount,
  getUnsignedImagesCount,
  createLabelingTask
};

export const CreateTaskDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelingTaskComponent);
