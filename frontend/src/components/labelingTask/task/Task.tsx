import React, { useEffect } from "react";
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
import { LabelingToolUser } from "../../../models/labelingToolUser";

interface TaskProps {
  users: LabelingToolUser[];
  taskName: string;
  filesCount: number;
}

type FormData = {
  taskName: string;
  user: string;
  filesInTask: number;
  countOfTasks: number;
};

export const Task: React.FC<TaskProps> = ({
  users,
  taskName,
  filesCount,
}: TaskProps) => {
  const { handleSubmit, setValue, control } = useForm<FormData>({
    defaultValues: {
      taskName: "",
      user: "",
      filesInTask: 0,
      countOfTasks: 0
    },
  });

  useEffect(() => {
    setValue("taskName", taskName);
  }, [taskName, setValue]);

  const onSubmit = handleSubmit(() => {});

  const usersSelectOptions = users.map((user) => (
    <MenuItem key={user.name} value={user.name}>
      {user.name}
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
          variant="outlined"
          label="Task Name"
          defaultValue=""
          control={control}
          as={<TextField />}
        />
        <div className="task__form-group">
          <FilesCounter filesCount={filesCount} className="task__form-item" />
          <Controller
            className="task__form-item"
            name="user"
            variant="outlined"
            label="User"
            control={control}
            as={<Select>{usersSelectOptions}</Select>}
          />
        </div>
        <div className="task__form-group">
          <Controller
            className="task__form-item"
            name="filesInTask"
            variant="outlined"
            label="Files in task"
            control={control}
            as={
              <TextField
                type="number"
                inputProps={{ min: 0, max: filesCount }}
              />
            }
          />
          <Controller
            className="task__form-item"
            name="countOfTasks"
            variant="outlined"
            label="Count of tasks"
            control={control}
            as={
              <TextField
                type="number"
                inputProps={{ min: 0, max: filesCount }}
              />
            }
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
