import { Pagination } from 'antd';
import React, { useState, useEffect } from 'react';
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
  makeStyles
} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';

import { IBucket } from '../../../models';
import { useTypedSelector, useAppDispatch } from '../../../store';
import { getDatasets } from '../../../store/data';
import { DatasetGrid } from './DatasetGrid';
import { AddDatasetModal } from '../../addDatasetModal';

const useStyles = makeStyles({
  button: {
    paddingTop: '0.4375rem',
    paddingBottom: '0.4375rem'
  },
  pagination: {
    marginTop: '2rem'
  }
});

export const DatasetView = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const buckets = useTypedSelector(({ data }) => data.buckets);
  const [currentBucketId, setCurrentBucketId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [datasetLength, setDatasetLength] = useState(0);
  const [paginationOffset, setPaginationOffset] = useState(0);
  const [paginationMaxItems, setPaginationMaxItems] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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

  const paginationIndexChange = (page: any, pageSize: any) => {
    setCurrentPage(page);
    setPaginationOffset((page - 1) * paginationMaxItems);
    setPaginationMaxItems(pageSize);
  };

  const datasetLengthChange = (length: number) => setDatasetLength(length);

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
      <DatasetGrid
        searchTerm={searchTerm}
        currentBucketId={currentBucketId}
        datasetLengthChange={datasetLengthChange}
        paginationConfig={{
          offsetStart: paginationOffset,
          offsetEnd: paginationMaxItems + paginationOffset
        }}
      />

      <Grid
        container
        justify="flex-end"
        spacing={2}
        className={classes.pagination}
      >
        <Pagination
          current={currentPage}
          showSizeChanger={!!datasetLength}
          disabled={!datasetLength}
          onChange={paginationIndexChange}
          pageSize={paginationMaxItems}
          total={datasetLength}
        />
      </Grid>

      <AddDatasetModal
        visible={isCreatingTask}
        onClose={() => setIsCreatingTask(false)}
      />
    </Container>
  );
};
