import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";
import "./ImagesLocation.css";

interface ImagesReceiverProps {
  bucketNames: string[];
  paths: string[];
}

type FormData = {
  bucketName: string;
  path: string;
};

export const ImagesReceiver: React.FC<ImagesReceiverProps> = ({
  bucketNames,
  paths,
}: ImagesReceiverProps) => {
  const { handleSubmit, control, register } = useForm<FormData>();

  const onSubmit = handleSubmit(({ bucketName, path }) => {
    console.log(bucketName, path);
  });

  const bucketNamesSelectOptions = bucketNames.map((bucketName) => (
    <MenuItem key={bucketName} value={bucketName}>
      {bucketName}
    </MenuItem>
  ));

  const pathsSelectOptions = paths.map((path) => (
    <MenuItem key={path} value={path}>
      {path}
    </MenuItem>
  ));

  return (
    <div className="images-receiver">
      <Typography
        variant="h5"
        component="h1"
        className="images-receiver__title"
      >
        Select images location
      </Typography>
      <form onSubmit={onSubmit} className="images-receiver__form">
        <Controller
          className="images-receiver__form-item"
          name="bucketName"
          inputRef={register}
          variant="outlined"
          label="Bucket Name"
          defaultValue=""
          control={control}
          as={<Select>{bucketNamesSelectOptions}</Select>}
        />
        <Controller
          className="images-receiver__form-item"
          name="paths"
          control={control}
          variant="outlined"
          label="Path"
          defaultValue=""
          as={<Select>{pathsSelectOptions}</Select>}
        />
        <Controller
          className="images-receiver__form-item"
          name="path"
          inputRef={register}
          variant="outlined"
          label="Selected Path"
          defaultValue=""
          control={control}
          as={<TextField />}
        />
        <Button
          className="images-receiver__form-item"
          type="submit"
          color="primary"
          variant="contained"
        >
          Get unassigned images
        </Button>
      </form>
    </div>
  );
};
