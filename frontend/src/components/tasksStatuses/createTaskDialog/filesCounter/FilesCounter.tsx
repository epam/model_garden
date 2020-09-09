import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '1.25rem',
    fontSize: '1rem'
  },
  description: {
    fontWeight: 400
  },
  count: {
    margin: '0 0 0 0.35rem'
  }
});

interface IFilesCounterProps {
  filesCount: number;
}

export const FilesCounter: React.FC<IFilesCounterProps> = ({
  filesCount
}: IFilesCounterProps) => {
  const classes = useStyles();
  return (
    <dl className={classes.root}>
      <dt className={classes.description}> Files in Queue:</dt>
      <dd className={classes.count}>{filesCount}</dd>
    </dl>
  );
};
