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
};

export const Task: React.FC<TaskProps> = ({
  users,
  taskName,
  filesCount,
}: TaskProps) => {
  const { handleSubmit, register, setValue, control } = useForm<FormData>({
    defaultValues: {
      taskName: "",
      user: "",
    },
  });

  useEffect(() => {
    setValue("taskName", taskName);
  }, [taskName]);

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
            defaultValue=""
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
            defaultValue={filesCount || 0}
            control={control}
            as={
              <TextField
                type="number"
                inputProps={{ min: 0, max: filesCount || 0 }}
              />
            }
          />
          <Controller
            className="task__form-item"
            name="countOfTasks"
            variant="outlined"
            label="Count of tasks"
            defaultValue="0"
            control={control}
            as={
              <TextField
                type="number"
                inputProps={{ min: 0, max: filesCount || 10 }}
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
