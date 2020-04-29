import React, { useEffect, useState } from "react";
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
import {
  setCurrentBucketName,
  setCurrentPath,
} from "../../../store/labelingTask";

interface ImagesLocationProps {
  bucketNames: string[];
  paths: string[];
  currentBucketName: string;
  currentPath: string;
  handleFormSubmit: () => void;
}

export const ImagesLocation: React.FC<ImagesLocationProps> = ({
  bucketNames,
  paths,
  currentBucketName,
  currentPath,
  handleFormSubmit,
}: ImagesLocationProps) => {
  const [selectedPaths, setSelectedPaths] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentBucketName(""));
    dispatch(setCurrentPath(""));
  }, [dispatch]);

  useEffect(() => {
    if (!currentBucketName) {
      dispatch(setCurrentPath(""));
    }
  }, [dispatch, currentBucketName]);

  const handleBucketNameChange = (e: any) => {
    dispatch(setCurrentBucketName(e.target.value));
  };

  const handlePathsChange = (e: any) => {
    setSelectedPaths(e.target.value);
    dispatch(setCurrentPath(e.target.value));
  };

  const handlePathChange = (e: any) => {
    dispatch(setCurrentPath(e.target.value));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    handleFormSubmit();
  };

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
        <Select
          className="images-receiver__form-item"
          labelId="images-receiver-bucket-name"
          name="bucketName"
          variant="outlined"
          label="Bucket Name"
          value={currentBucketName}
          onChange={handleBucketNameChange}
        >
          {bucketNamesSelectOptions}
        </Select>
        <InputLabel id="images-receiver-paths">Paths</InputLabel>
        <Select
          className="images-receiver__form-item"
          labelId="images-receiver-paths"
          name="bucketPaths"
          variant="outlined"
          label="Path"
          value={selectedPaths}
          onChange={handlePathsChange}
        >
          {pathsSelectOptions}
        </Select>
        <TextField
          className="images-receiver__form-item"
          name="path"
          variant="outlined"
          label="Selected Path"
          value={currentPath}
          onChange={handlePathChange}
          InputLabelProps={{ shrink: !!currentPath }}
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
