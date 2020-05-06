import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormControl,
} from "@material-ui/core";
import "./ImagesLocation.css";
import { useDispatch } from "react-redux";
import {
  setCurrentBucketId,
  setCurrentPath,
} from "../../../store/labelingTask";
import { Bucket } from "../../../models";
import { FormContainer } from "../formContainer";

interface ImagesLocationProps {
  title: string;
  buttonName: string;
  buckets: Bucket[];
  paths: string[];
  currentBucketId: string;
  currentPath: string;
  handleFormSubmit: () => void;
}

export const ImagesLocation: React.FC<ImagesLocationProps> = ({
  title,
  buttonName,
  buckets,
  paths,
  currentBucketId,
  currentPath,
  handleFormSubmit,
}: ImagesLocationProps) => {
  const [selectedPaths, setSelectedPaths] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentBucketId(""));
    dispatch(setCurrentPath(""));
  }, [dispatch]);

  useEffect(() => {
    if (!currentBucketId) {
      dispatch(setCurrentPath(""));
    }
  }, [dispatch, currentBucketId]);

  const handleBucketChange = (e: any) => {
    dispatch(setCurrentBucketId(e.target.value));
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

  const bucketsSelectOptions = buckets.map((bucket: Bucket) => (
    <MenuItem key={bucket.id} value={bucket.id}>
      {bucket.name}
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
              name="bucketId"
              variant="outlined"
              label="S3 Bucket Name"
              value={currentBucketId}
              onChange={handleBucketChange}
            >
              {bucketsSelectOptions}
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
          <TextField
            className="images-location__form-item"
            name="path"
            variant="outlined"
            label="Selected Path"
            value={currentPath}
            onChange={handlePathChange}
            InputLabelProps={{ shrink: !!currentPath }}
          />
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
