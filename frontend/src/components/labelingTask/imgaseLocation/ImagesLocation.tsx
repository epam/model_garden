import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";
import "./ImagesLocation.css";
import { useDispatch } from "react-redux";
import { setCurrentBucketName, setCurrentPath } from '../../../store/labelingTask';

interface ImagesLocationProps {
  bucketNames: string[];
  paths: string[];
  currentPath: string;
  handleFormSubmit: () => void;
}

type FormData = {
  bucketName: string;
  bucketPaths: string;
  path: string;
};

export const ImagesLocation: React.FC<ImagesLocationProps> = ({
  bucketNames,
  paths,
  currentPath,
  handleFormSubmit,
}: ImagesLocationProps) => {
  const dispatch = useDispatch();
  const { handleSubmit, control, watch, getValues, setValue } = useForm<FormData>({
    defaultValues: {
      bucketName: '',
      bucketPaths: '',
      path: ''
    }
  });

  useEffect(() => {
    watch();
  }, [])

  useEffect(() => {
    const values = getValues();
    dispatch(setCurrentBucketName(values.bucketName));
    if (!paths.length) {
      dispatch(setCurrentPath(''));
    } else {
      dispatch(setCurrentPath(values.bucketPaths));
    }
  });

  useEffect(() => {
    setValue('path', currentPath);
  }, [currentPath]);

  const onSubmit = handleSubmit(({ bucketName, bucketPaths, path }) => {
    handleFormSubmit();
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
        <InputLabel id="images-receiver-bucket-name">Bucket Name</InputLabel>
        <Controller
          className="images-receiver__form-item"
          labelId="images-receiver-bucket-name"
          name="bucketName"
          control={control}
          variant="outlined"
          label="Bucket Name"
          as={<Select>{bucketNamesSelectOptions}</Select>}
        />
        <InputLabel id="images-receiver-paths">Paths</InputLabel>
        <Controller
          className="images-receiver__form-item"
          labelId="images-receiver-paths"
          name="bucketPaths"
          control={control}
          variant="outlined"
          label="Path"
          as={<Select>{pathsSelectOptions}</Select>}
        />
        <Controller
          className="images-receiver__form-item"
          name="path"
          control={control}
          variant="outlined"
          label="Selected Path"
          as={<TextField InputLabelProps={{ shrink: !!currentPath }} />}
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
