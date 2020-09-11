import React from 'react';
import { Link } from '@material-ui/core';

export const Notification = (newTaskUrl: string): JSX.Element => (
  <>
    <Link
      href={newTaskUrl}
      color="inherit"
      underline="always"
      target="_blank"
      rel="noopener"
    >
      A new task
    </Link>
    &nbsp;has been created
  </>
);
