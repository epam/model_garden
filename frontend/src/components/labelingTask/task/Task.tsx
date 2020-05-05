import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { LabelingToolUser } from "../../../models/labelingToolUser";
import { FormContainer } from "../../shared";

interface TaskProps {
  users: LabelingToolUser[];
  taskName: string;
  filesCount: number;
  handleTaskSubmit: (data: FormData) => void;
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
}: TaskProps) => {
  const { handleSubmit, setValue, control } = useForm<FormData>({
    defaultValues: {
      taskName: "",
      user: "",
      filesInTask: 0,
      countOfTasks: 0,
    },
  });

  useEffect(() => {
    setValue("taskName", taskName);
  }, [taskName, setValue]);

  const onSubmit = handleSubmit((data: FormData) => {
    handleTaskSubmit(data);
  });

  const usersSelectOptions = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.full_name} ({user.email})
    </MenuItem>
  ));

  return (
    <div className="task">
      <FormContainer>
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
            <FormControl className="task__form-item">
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
      </FormContainer>
    </div>
  );
};
