import React from 'react';
import { withStyles, MenuItem, Paper, Typography } from '@material-ui/core';
import { Bucket } from '../../models';

export const UploadPaper = withStyles({
  root: {
    minHeight: '10.125rem',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1.25rem'
  }
})(Paper);

export const UploadDescription = withStyles({
  root: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '1.25rem'
  }
})(Typography);

export const BucketsSelect = (buckets: Bucket[]) =>
  buckets.map((bucket: Bucket) => (
    <MenuItem key={bucket.id} value={bucket.id}>
      {bucket.name}
    </MenuItem>
  ));

export type FormData = {
  bucketId: string;
  path: string;
  format: string;
};
