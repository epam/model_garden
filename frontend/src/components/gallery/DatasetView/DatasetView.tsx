import React, { useState, useEffect } from 'react';
import { IBucket } from '../../../models';
import {
  Container,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  makeStyles,
  Dialog
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';
import { useTypedSelector, useAppDispatch } from '../../../store';
import { getDatasets } from '../../../store/data';
import { DatasetGrid } from './DatasetGrid';
import { AddDataset } from '../../addDataset';

const useStyles = makeStyles({
  button: {
    paddingTop: '0.4375rem',
    paddingBottom: '0.4375rem'
  }
});

const DatasetView = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const buckets = useTypedSelector(({ data }) => data.buckets);
  const [currentBucketId, setCurrentBucketId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  useEffect(() => {
    if (buckets.length === 1) {
      setCurrentBucketId(buckets[0].id);
      dispatch(getDatasets(buckets[0].id));
    }
  }, [dispatch, buckets]);

  const HandleChange = ({ target: { value } }: any) => {
    setCurrentBucketId(value);
    dispatch(getDatasets(value));
  };

  return (
    <Container maxWidth={'xl'}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl size="small">
            <InputLabel id="task-bucket-name">Bucket</InputLabel>
            <Select
              labelId="task-bucket-name"
              name="bucketId"
              label="Bucket"
              value={currentBucketId}
              onChange={HandleChange}
            >
              {buckets.map((bucket: IBucket, index: any) => (
                <MenuItem key={index} value={bucket.id}>
                  {bucket.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="path"
            size="small"
            label="Search Dataset Path"
            value={searchTerm}
            disabled={!currentBucketId}
            onChange={(e: any) => {
              setSearchTerm(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => setIsCreatingTask(true)}
            startIcon={<AddBoxIcon />}
          >
            Add Dataset
          </Button>
        </Grid>
      </Grid>
      <DatasetGrid searchTerm={searchTerm} currentBucketId={currentBucketId} />

      <Dialog
        open={isCreatingTask}
        onClose={() => setIsCreatingTask(false)}
        scroll="body"
      >
        <AddDataset onClose={() => setIsCreatingTask(false)} />
      </Dialog>
    </Container>
  );
};

export default DatasetView;
