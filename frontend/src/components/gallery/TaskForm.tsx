import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAppDispatch } from '../../store';
import { FormContainer } from '../shared';
import { DEFAULT_FORM_DATA } from '.././labelingTask/task/constants';

const useStyles = makeStyles({
  taskFormGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 -0.625rem'
  },
  taskFormItem: {
    padding: '0 0.625rem',
    width: '50%'
  }
});

export type FormData = {
  currentDatasetId: string;
  taskName: string;
  user: string | number;
  filesInTask: number;
  countOfTasks: number;
};

export const TaskForm = ({ users }: any) => {
  const dispatch = useAppDispatch();
  const [currentBucketId, setCurrentBucketId] = useState('');
  const [currentDataset, setCurrentDataset] = useState({
    id: '',
    path: '',
    bucket: ''
  });
  const [counter, setCounter] = useState({
    filesInTask: DEFAULT_FORM_DATA.FILES_IN_TASK_VALUE.toString(),
    countOfTasks: DEFAULT_FORM_DATA.COUNT_OF_TASKS.toString()
  });
  const { control, watch, register } = useForm<FormData>({
    defaultValues: {
      taskName: DEFAULT_FORM_DATA.TASK_NAME,
      user: DEFAULT_FORM_DATA.USER
    }
  });
  w2;
  const { taskName: taskNameValue, user: userValue } = watch([
    'taskName',
    'user'
  ]);
  const usersSelectOptions = users.map((user: any) => (
    <MenuItem key={user.id} value={user.id}>
      {user.full_name} ({user.email})
    </MenuItem>
  ));
  const onSubmit = () => {};
  const classes = useStyles();
  return (
    <>
      <FormContainer>
        <Typography variant="h1">Create Tasks</Typography>
        <form onSubmit={onSubmit}>
          <Controller
            name="taskName"
            label="Task Name"
            defaultValue=""
            control={control}
            as={<TextField />}
          />
          <div className={classes.taskFormGroup}>
            <div className={classes.taskFormItem}>
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
    </>
  );
};
