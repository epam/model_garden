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
  setCurrentBucketId,
  setCurrentDatasetId,
} from "../../../store/labelingTask";
import { Bucket, Dataset } from "../../../models";
import { FormContainer } from "../formContainer";

interface ImagesLocationProps {
  title: string;
  buttonName: string;
  buckets: Bucket[];
  datasets: Dataset[];
  currentBucketId: string;
  handleFormSubmit: () => void;
}

export const ImagesLocation: React.FC<ImagesLocationProps> = ({
  title,
  buttonName,
  buckets,
  datasets,
  currentBucketId,
  handleFormSubmit,
}: ImagesLocationProps) => {
  const [selectedDataset, setSelectedDataset] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentBucketId(""));
    dispatch(setCurrentDatasetId(""));
  }, [dispatch]);

  useEffect(() => {
    if (!currentBucketId) {
      dispatch(setCurrentDatasetId(""));
    }
  }, [dispatch, currentBucketId]);

  const handleBucketChange = (e: any) => {
    dispatch(setCurrentBucketId(e.target.value));
  };

  const handleDatasetChange = (e: any) => {
    setSelectedDataset(e.target.value);
    dispatch(setCurrentDatasetId(e.target.value));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    handleFormSubmit();
  };

  const bucketsSelectOptions = buckets.map((bucket: Bucket, index) => (
    <MenuItem key={index} value={bucket.id}>
      {bucket.name}
    </MenuItem>
  ));

  const datasetsSelectOptions = datasets.map((dataset: Dataset, index) => (
    <MenuItem key={index} value={dataset.id}>
      {dataset.path}
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
              Bucket
            </InputLabel>
            <Select
              labelId="images-location-bucket-name"
              name="bucketId"
              variant="outlined"
              label="Bucket"
              value={currentBucketId}
              onChange={handleBucketChange}
            >
              {bucketsSelectOptions}
            </Select>
          </FormControl>
          <FormControl className="images-location__form-item">
            <InputLabel id="images-location-datasets">Dataset</InputLabel>
            <Select
              labelId="images-location-datasets"
              name="dataset"
              variant="outlined"
              label="Dataset"
              value={selectedDataset}
              onChange={handleDatasetChange}
            >
              {datasetsSelectOptions}
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
