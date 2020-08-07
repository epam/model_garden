import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { Link, useRouteMatch } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useTypedSelector } from '../../store';
import { Bucket, Dataset } from '../../models';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    backgroundColor: blueGrey[50],
    padding: '1rem',
    margin: '-2.5rem 0 1.5rem'
  },
  back: {
    display: 'flex',
    alignItems: 'center'
  },
  backIcon: {
    fontSize: '2.6rem'
  },
  title: {
    fontSize: '1rem',
    marginBottom: '1rem'
  },
  info: {
    margin: '0',
    padding: '0',
    listStyle: 'none',
    display: 'flex',
    '& li': {
      marginRight: '2.5rem'
    }
  }
}));

export const ImageGalleryHeader = () => {
  const classes = useStyles();

  const {
    params: { datasetId, bucketId }
  } = useRouteMatch();

  const currentBucket = useTypedSelector((state) => state.data.buckets).find(
    (bucket: Bucket) => bucket.id === bucketId
  );

  const currentDataset = useTypedSelector((state) => state.data.datasets).find(
    (dataset: Dataset) => dataset.id === datasetId
  );

  return (
    <header className={classes.header}>
      <Link to="/gallery" className={classes.back}>
        <ArrowBackIosIcon className={classes.backIcon} />
        <Typography variant="srOnly">Back to datasets list</Typography>
      </Link>
      <div>
        <h1 className={classes.title}>
          {currentBucket?.name}
          {currentDataset?.path}
        </h1>
        <ul className={classes.info}>
          <li>ITEMS: {currentDataset?.items_number}</li>
          <li>LABELS: {currentDataset?.xmls_number}</li>
          <li>
            CREATED:
            {new Date(currentDataset?.created_at ?? 0).toLocaleString()}
          </li>
          <li>FORMAT: {currentDataset?.dataset_format}</li>
        </ul>
      </div>
    </header>
  );
};
