import React from 'react';
import { Typography } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { Link, useRouteMatch } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useTypedSelector } from '../../../store';
import { Bucket, Dataset } from '../../../models';
import './styles.scss';

export const ImageGalleryHeader = () => {
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
    <header className="mg-gallery-header">
      <div className="mg-gallery-top-row">
        <Link to="/gallery">
          <ArrowBackIosIcon className="mg-gallery-back-icon" />
          <Typography variant="srOnly">Back to datasets list</Typography>
        </Link>
        <h1 className="mg-gallery-title">
          {currentBucket?.name}
          {currentDataset?.path}
        </h1>
      </div>
      <div>
        <ul className="mg-gallery-info">
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
