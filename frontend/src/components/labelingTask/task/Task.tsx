import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import "./Task.css";
import { FilesCounter } from "../filesCounter";

interface TaskProps {
  users: [];
}

type FormData = {};

export const Task: React.FC<TaskProps> = ({ users }: TaskProps) => {
  const { handleSubmit, register, control } = useForm<FormData>();

  const onSubmit = handleSubmit(() => {});

  const usersSelectOptions = users.map((user) => (
    <MenuItem key={user} value={user}>
      {user}
    </MenuItem>
  ));

  return (
    <div className="task">
      <Typography variant="h5" component="h1" className="task__title">
        Create Task
      </Typography>
      <form onSubmit={onSubmit} className="task__form">
        <Controller
          className="task__form-item"
          name="taskName"
          inputRef={register}
          variant="outlined"
          label="Task Name"
          defaultValue=""
          control={control}
          as={<TextField />}
        />
        <div className="task__form-group">
          <FilesCounter filesCount={1000} className="task__form-item" />
          <Controller
            className="task__form-item"
            name="user"
            inputRef={register}
            variant="outlined"
            label="User"
            defaultValue=""
            control={control}
            as={<Select>{usersSelectOptions}</Select>}
          />
        </div>
        <div className="task__form-group">
          <Controller
            className="task__form-item"
            name="filesInTask"
            inputRef={register}
            variant="outlined"
            label="Files in task"
            defaultValue="10"
            control={control}
            as={<TextField type="number" inputProps={{ min: 0, max: 40 }} />}
          />
          <Controller
            className="task__form-item"
            name="countOfTasks"
            inputRef={register}
            variant="outlined"
            label="Count of tasks"
            defaultValue="1"
            control={control}
            as={<TextField type="number" inputProps={{ min: 0, max: 10 }} />}
          />
        </div>
        <Button
          className="task__form-item"
          type="submit"
          color="primary"
          variant="contained"
        >
          Assign
        </Button>
      </form>
    </div>
  );
};
