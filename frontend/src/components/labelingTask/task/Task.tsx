import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import "./Task.css";
import { FilesCounter } from "../filesCounter";
import { Notification } from "../notification";
import { Bucket, Dataset, LabelingToolUser } from "../../../models";
import { FormContainer } from "../../shared";
import { DEFAULT_FORM_DATA } from "./constants";
import {
  setCurrentBucketId,
  setCurrentDatasetId,
  clearNewTaskData,
  getUnsignedImagesCountSuccess,
} from "../../../store/labelingTask";

interface TaskProps {
  users: LabelingToolUser[];
  taskName: string;
  filesCount: number;
  handleTaskSubmit: (data: FormData) => void;
  buckets: Bucket[];
  datasets: Dataset[];
  currentBucketId: string;
  onDataSetChange: (datasetId: string) => void;
  newTask: {location: string};
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
}: TaskProps) => {
  const [selectedDataset, setSelectedDataset] = useState('');
  const dispatch = useDispatch();

  const { handleSubmit, getValues, setValue, control, watch } = useForm<FormData>({
    defaultValues: {
      taskName: DEFAULT_FORM_DATA.TASK_NAME,
      user: DEFAULT_FORM_DATA.USER,
      filesInTask: DEFAULT_FORM_DATA.FILES_IN_TASK_VALUE,
      countOfTasks: DEFAULT_FORM_DATA.COUNT_OF_TASKS,
    },
  });

  const {
    taskName: taskNameValue,
    user: userValue,
    filesInTask: filesInTaskValue,
    countOfTasks: countOfTasksValue
  } = watch([
      'taskName', 'user', 'filesInTask', 'countOfTasks']);

  useEffect(() => {
    setValue("taskName", taskName);
  }, [taskName, setValue]);

  useEffect(() => {
    dispatch(setCurrentBucketId(""));
    dispatch(setCurrentDatasetId(""));
  }, [dispatch]);

  useEffect(() => {
    if (!currentBucketId) {
      dispatch(setCurrentDatasetId(""));
    }
  }, [dispatch, currentBucketId]);

  const onSubmit = handleSubmit((data: FormData) => {
    handleTaskSubmit(data);
  });

  // clear form on a new task is created
  useEffect(
    () => {
      setSelectedDataset("");
      dispatch(setCurrentDatasetId(""));
      dispatch(getUnsignedImagesCountSuccess(0));
      setValue("filesInTask", 0);
      setValue("countOfTasks", 0);
    },
    [newTask]
  );

  const clearTaskData = () => {
    dispatch(clearNewTaskData());
  }

  const usersSelectOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.full_name} ({user.email})
    </MenuItem>
  ));

  const handleBucketChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    if (e.target.value) {
      dispatch(setCurrentBucketId(e.target.value as string));
    }
  };

  const handleDatasetChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    let datasetId: string = e.target.value as string;
    setSelectedDataset(datasetId);
    dispatch(setCurrentDatasetId(datasetId));
    onDataSetChange(datasetId);
  };

  const bucketsSelectOptions = buckets.map((bucket: Bucket, index) => (
      <MenuItem key={index} value={bucket.id}>
        {bucket.name}
      </MenuItem>
  ));

  const datasetsSelectOptions = datasets.map((dataset: Dataset, index) => (
      <MenuItem key={index} value={dataset.id}>
        /{dataset.path}
      </MenuItem>
  ));

  const validateNumber = (propName: string) => {

      const value: string = getValues(propName);
      if (value !== undefined && (value === '' || Number.parseFloat(value) < 0)) {
        setValue(propName, 0);
      }

  }

  return (
    <div className="task">
      <FormContainer>
        <Typography variant="h5" component="h1" className="task__title">
          Create Tasks
        </Typography>
        <form onSubmit={onSubmit} className="task__form">
          <FormControl className="task__form-item">
            <InputLabel id="task-bucket-name">
              Bucket
            </InputLabel>
            <Select
                labelId="task-bucket-name"
                name="bucketId"
                variant="outlined"
                label="Bucket"
                value={currentBucketId}
                onChange={handleBucketChange}
            >
              {bucketsSelectOptions}
            </Select>
          </FormControl>
          <FormControl
              className="task__form-item"
          >
            <InputLabel id="task-datasets">Dataset</InputLabel>
            <Select
                labelId="task-datasets"
                name="dataset"
                variant="outlined"
                label="Dataset"
                value={selectedDataset}
                onChange={handleDatasetChange}
                disabled={
                  currentBucketId === DEFAULT_FORM_DATA.BUCKET_ID
                }
            >
              {datasetsSelectOptions}
            </Select>
          </FormControl>
          <Controller
            className="task__form-item"
            name="taskName"
            variant="outlined"
            label="Task Name"
            defaultValue=""
            control={control}
            as={<TextField />}
          />
          <div className="task__form-group">
            <FilesCounter filesCount={filesCount} className="task__form-left-item" />
            <FormControl className="task__form-right-item">
              <InputLabel id="task-labeling-tool-user">
                Labeling tool user
              </InputLabel>
              <Controller
                labelId="task-labeling-tool-user"
                name="user"
                variant="outlined"
                label="Labeling tool user"
                control={control}
                as={<Select>{usersSelectOptions}</Select>}
              />
            </FormControl>
          </div>
          <div className="task__form-group">
            <Controller
              className="task__form-left-item"
              name="filesInTask"
              variant="outlined"
              label="Files in task"
              control={control}
              as={
                <TextField
                  type="number"
                  inputProps={{ min: 0, max: filesCount }}
                  onChange={validateNumber('filesInTask') as ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) | undefined}
                />
              }
            />
            <Controller
              className="task__form-right-item"
              name="countOfTasks"
              variant="outlined"
              label="Count of tasks"
              control={control}
              as={
                <TextField
                  type="number"
                  inputProps={{ min: 0, max: filesCount }}
                  onChange={validateNumber('countOfTasks') as ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) | undefined}
                />
              }
            />
          </div>
          <Button
            className="task__form-item"
            type="submit"
            color="primary"
            variant="contained"
            disabled={
              currentBucketId === DEFAULT_FORM_DATA.BUCKET_ID
            || selectedDataset === DEFAULT_FORM_DATA.DATASET
            || taskNameValue === DEFAULT_FORM_DATA.TASK_NAME
            || userValue === DEFAULT_FORM_DATA.USER
            || Number(countOfTasksValue) === DEFAULT_FORM_DATA.COUNT_OF_TASKS
            || Number(filesInTaskValue) === DEFAULT_FORM_DATA.FILES_IN_TASK_VALUE
            }
          >
            Assign
          </Button>
        </form>
      </FormContainer>

      <Notification
        newTask={newTask}
        onClose={clearTaskData}
      />
    </div>
  );
};
