import React from 'react';
import {
  withStyles,
  MenuItem,
  Paper,
  Typography,
  StyledComponentProps
} from '@material-ui/core';
import { IBucket } from '../../models';

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
})((props: StyledComponentProps) => (
  <Typography className={props.classes?.root} variant="body2">
    Images should be already upload to the bucket (e.g. by CyberDuck) and not to
    be referenced in the database yet
  </Typography>
));

export const BucketsSelect = (buckets: IBucket[]): Array<JSX.Element> =>
  buckets.map((bucket: IBucket) => (
    <MenuItem key={bucket.id} value={bucket.id}>
      {bucket.name}
    </MenuItem>
  ));

export interface IFormData {
  bucketId: string;
  path: string;
  format: string;
}
