import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useTypedSelector } from '../../store';
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
  InputLabel,
  FormHelperText
} from '@material-ui/core';

export type FormData = {
  taskName: string;
  user: string | number;
  currentDatasetId: string | number;
  filesInTask: number;
  countOfTasks: number;
};

export const TaskForm = ({
  setOpenTaskModal,
  openTaskModal,
  createLabelingTask,
  checklist,
  setCheckList,
  currentDataset
}: any) => {
  const { control, handleSubmit, errors } = useForm<FormData>({});
  const users = useTypedSelector(({ data }) => data.labelingToolUsers);

  const usersSelectOptions = users.map((user: any) => (
    <MenuItem key={user.id} value={user.id}>
      {user.full_name} ({user.email})
    </MenuItem>
  ));

  const dispatch = useDispatch();

  const onSubmit = (formData: FormData) => {
    formData.currentDatasetId = currentDataset.id;
    formData.filesInTask = checklist.length;
    formData.countOfTasks = 1;
    dispatch(createLabelingTask(formData))
      .then(unwrapResult)
      .then(() => {
        setCheckList([]);
      })
      .catch((e: any) => {
        setCheckList([]);
      });
    setOpenTaskModal(false);
  };

  return (
    <>
      <Dialog
        fullWidth
        open={openTaskModal}
        onClose={(e: any) => setOpenTaskModal(false)}
      >
        <DialogTitle> Create Tasks </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Controller
              name="taskName"
              label="Task Name"
              defaultValue=""
              control={control}
              rules={{ required: 'Task Name is required.' }}
              as={
                <TextField
                  helperText={errors.taskName?.message}
                  FormHelperTextProps={{ error: true, margin: 'dense' }}
                />
              }
            />

            <FormControl>
              <InputLabel id="task-labeling-tool-user">
                Labeling tool user
              </InputLabel>
              <Controller
                labelId="task-labeling-tool-user"
                name="user"
                label="Labeling tool user"
                defaultValue=""
                control={control}
                rules={{ required: 'Labeling tool user is required.' }}
                as={<Select>{usersSelectOptions}</Select>}
              />
              <FormHelperText error margin="dense">
                {errors.user?.message}
              </FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth={true}
              type="submit"
              color="primary"
              variant="contained"
            >
              Assign
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
