import React, { useState } from 'react';
import { Bucket } from '../../models';
import {
  Container,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  InputAdornment
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useTypedSelector, useAppDispatch } from '../../store';
import { getDatasets } from '../../store/data';
import { DatasetGrid } from './datasetGrid';

const DatasetView = () => {
  const dispatch = useAppDispatch();
  const buckets = useTypedSelector(({ data }) => data.buckets);
  const [currentBucketId, setCurrentBucketId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const HandleChange = ({ target: { value } }: any) => {
    setCurrentBucketId(value);
    dispatch(getDatasets(value));
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
              onChange={HandleChange}
            >
              {buckets.map((bucket: Bucket, index: any) => (
                <MenuItem key={index} value={bucket.id}>
                  {bucket.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            className="upload-images__settings-item"
            name="path"
            label="Search Dataset Path"
            value={searchTerm}
            disabled={!currentBucketId}
            onChange={(e: any) => {
              setSearchTerm(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">/</InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>
      <DatasetGrid searchTerm={searchTerm} />
    </Container>
  );
};

export default DatasetView;
