import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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

export const ImageGalleryHeader = ({
  bucket,
  dataset,
  imageCount,
  labelCount,
  createdAt
}: any) => {
  const classes = useStyles();
  return (
    <header className={classes.header}>
      <Link to="/gallery" className={classes.back}>
        <ArrowBackIosIcon className={classes.backIcon} />
        <Typography variant="srOnly">Back to datasets list</Typography>
      </Link>
      <div>
        <h1 className={classes.title}>
          {bucket}
          {dataset}
        </h1>
        <ul className={classes.info}>
          <li>ITEMS: {imageCount}</li>
          <li>LABELS: {labelCount}</li>
          <li>CREATED: {new Date(createdAt).toLocaleString()}</li>
        </ul>
      </div>
    </header>
  );
};
