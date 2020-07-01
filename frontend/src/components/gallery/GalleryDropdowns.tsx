import React, { useState } from 'react';
import { Bucket } from '../../models';
import {
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@material-ui/core';
import { useTypedSelector, useAppDispatch } from '../../store';
import { getDatasets } from '../../store/data';

const GallerDropdowns = () => {
  const dispatch = useAppDispatch();
  const buckets = useTypedSelector(({ data }) => data.buckets);
  const [currentBucketId, setCurrentBucketId] = useState('');

  const HandleChange = ({ target: { value } }: any) => {
    setCurrentBucketId(value);
    dispatch(getDatasets(value));
  };

  return (
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
    </Grid>
  );
};

export default GallerDropdowns;
