import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel
} from '@material-ui/core';
import { DEFAULT_FORM_DATA } from '.././labelingTask/task/constants';

export type FormData = {
  taskName: string;
  user: string | number;
};

export const TaskForm = ({
  users,
  currentBucketId,
  currentDataset,
  setOpenTaskModal,
  openTaskModal
}: any) => {
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      taskName: DEFAULT_FORM_DATA.TASK_NAME,
      user: DEFAULT_FORM_DATA.USER
    }
  });

  const { taskName: taskNameValue, user: userValue } = watch([
    'taskName',
    'user'
  ]);

  const usersSelectOptions = users.map((user: any) => (
    <MenuItem key={user.id} value={user.id}>
      {user.full_name} ({user.email})
    </MenuItem>
  ));

  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log(e.target);
  };
  return (
    <>
      <Dialog
        fullWidth
        open={openTaskModal}
        onClose={(e: any) => setOpenTaskModal(false)}
      >
        <DialogTitle> Create Tasks </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <Controller
              name="taskName"
              label="Task Name"
              defaultValue=""
              control={control}
              as={<TextField />}
            />
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
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth={true}
              onClick={(e: any) => setOpenTaskModal(false)}
              type="submit"
              color="primary"
              variant="contained"
              disabled={
                currentBucketId === DEFAULT_FORM_DATA.BUCKET_ID ||
                currentDataset.id === DEFAULT_FORM_DATA.DATASET ||
                taskNameValue === DEFAULT_FORM_DATA.TASK_NAME ||
                userValue === DEFAULT_FORM_DATA.USER
              }
            >
              Assign
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
