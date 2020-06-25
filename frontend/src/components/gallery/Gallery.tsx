import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Bucket, Dataset } from '../../models';
import {
  Grid,
  Container,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@material-ui/core';
import { AppState } from '../../store';
import { getDatasets, getMediaAssets } from '../../store/data';
import { GridGallery } from './GridGallery';
import { DatasetGrid } from './datasetGrid/datasetGrid';

interface GalleryProps {
  photos: [{}];
  buckets: Bucket[];
  currentBucketId: any;
  dataset: any;
}

const GalleryComponent = (props: any) => {
  const { buckets, datasets, photos, getMediaAssets, getDatasets } = props;

  const [currentDatasetId, setCurrentDatasetId] = useState('');
  const [currentBucketId, setCurrentBucketId] = useState('');

  useEffect(() => {
    if (currentDatasetId) {
      getMediaAssets({
        bucketId: currentBucketId,
        datasetId: currentDatasetId
      });
    }
  }, [currentDatasetId, currentBucketId, getMediaAssets]);

  useEffect(() => {
    if (currentBucketId) {
      getDatasets(currentBucketId);
    }
  }, [currentBucketId, getDatasets]);

  const handleBucketChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    if (e.target.value) {
      setCurrentBucketId(e.target.value as string);
    }
  };
  const handleDataSetChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    if (e.target.value) {
      setCurrentDatasetId(e.target.value as string);
    }
  };

  return (
    <Container maxWidth={'xl'}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl>
            <InputLabel id="task-bucket-name">Bucket</InputLabel>
            <Select
              labelId="task-bucket-name"
              name="bucketId"
              label="Bucket"
              value={currentBucketId}
              onChange={handleBucketChange}
            >
              {buckets.map((bucket: Bucket, index: number) => (
                <MenuItem key={index} value={bucket.id}>
                  {bucket.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl>
            <InputLabel id="task-bucket-name">Dataset</InputLabel>
            <Select
              labelId="task-bucket-name"
              name="selectedDataset"
              label="Dataset"
              value={currentDatasetId}
              onChange={handleDataSetChange}
            >
              {datasets.map((dataset: Dataset) => (
                <MenuItem key={dataset.id} value={dataset.id}>
                  {dataset.path}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <GridGallery photos={photos} />
      {/* <DatasetGrid datasets={datasets} /> */}
    </Container>
  );
};
const mapStateToProps = ({ data, labelingTask }: AppState) => ({
  buckets: data.buckets,
  datasets: data.datasets,
  photos: data.mediaAssets,
  currentBucketId: labelingTask.currentBucketId,
  currentDatasetId: labelingTask.currentDatasetId
});
const actions = {
  getMediaAssets,
  getDatasets
};
export const Gallery = connect(mapStateToProps, actions)(GalleryComponent);
