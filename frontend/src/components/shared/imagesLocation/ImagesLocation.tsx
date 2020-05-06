import React, { useEffect, useState } from "react";
import {
  Button,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormControl,
} from "@material-ui/core";
import "./ImagesLocation.css";
import { useDispatch } from "react-redux";
import {
  setCurrentBucketName,
  setCurrentPath,
} from "../../../store/labelingTask";
import { FormContainer } from "../formContainer";

interface ImagesLocationProps {
  title: string;
  buttonName: string;
  bucketNames: string[];
  paths: string[];
  currentBucketName: string;
  currentPath: string;
  handleFormSubmit: () => void;
}

export const ImagesLocation: React.FC<ImagesLocationProps> = ({
  title,
  buttonName,
  bucketNames,
  paths,
  currentBucketName,
  currentPath,
  handleFormSubmit,
}: ImagesLocationProps) => {
  const [selectedPaths, setSelectedPaths] = useState("");
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
    <div className="images-location">
      <FormContainer>
        <Typography
          variant="h5"
          component="h1"
          className="images-location__title"
        >
          {title.toUpperCase()}
        </Typography>
        <form onSubmit={onSubmit} className="images-location__form">
          <FormControl className="images-location__form-item">
            <InputLabel id="images-location-bucket-name">
              S3 Bucket Name
            </InputLabel>
            <Select
              labelId="images-location-bucket-name"
              name="bucketName"
              variant="outlined"
              label="S3 Bucket Name"
              value={currentBucketName}
              onChange={handleBucketNameChange}
            >
              {bucketNamesSelectOptions}
            </Select>
          </FormControl>
          <FormControl className="images-location__form-item">
            <InputLabel id="images-location-paths">Paths</InputLabel>
            <Select
              labelId="images-location-paths"
              name="bucketPaths"
              variant="outlined"
              label="Paths"
              value={selectedPaths}
              onChange={handlePathsChange}
            >
              {pathsSelectOptions}
            </Select>
          </FormControl>
          <Button
            className="images-location__form-item"
            type="submit"
            color="primary"
            variant="contained"
          >
            {buttonName}
          </Button>
        </form>
      </FormContainer>
    </div>
  );
};
