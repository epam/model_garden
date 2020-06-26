import React from 'react';
import { makeStyles, Grid, Link, Paper } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { Dataset } from '../../../models';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

const useStyles = makeStyles((theme) => ({
  card: {
    // height: '19.6875rem',
    height: '15.6875rem', // TODO: delete after adding the data
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transition: 'box-shadow 0.3s',
      boxShadow: theme.shadows[3]
    }
  },
  link: {
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.primary
    }
  },
  imgWrap: {
    backgroundColor: blueGrey[50],
    height: '12.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoIcon: {
    color: blueGrey[200],
    fontSize: '4rem'
  },
  img: {
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  },
  info: {
    backgroundColor: '#ffffff',
    padding: '0.75rem 0.625rem 0.5rem',
    position: 'absolute',
    left: '0',
    right: '0',
    bottom: '0'
  },
  name: {
    display: 'block',
    marginBottom: '0.625rem',
    fontSize: '1rem',
    lineHeight: 20 / 16
  },
  date: {
    display: 'none', // TODO: delete after adding the data
    marginBottom: '0.625rem',
    fontSize: '0.75rem',
    lineHeight: 14 / 12
  },
  items: {
    // display: 'flex',
    display: 'none', // TODO: delete after adding the data
    borderTop: `1px solid ${blueGrey[100]}`,
    '& dl': {
      textAlign: 'center',
      width: '50%',
      borderLeft: `1px solid ${blueGrey[100]}`,
      padding: '0.375rem 0.625rem 0',
      margin: '0',
      lineHeight: 16 / 14,
      '&:first-child': {
        borderLeft: 'none'
      }
    },
    '& dt': {
      textTransform: 'uppercase',
      fontWeight: '500'
    },
    '& dd': {
      fontWeight: 'normal',
      margin: '0'
    }
  }
}));

export const DatasetGrid = ({ datasets }: any) => {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      {datasets.map((dataset: Dataset) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={dataset.id}>
          <Paper className={classes.card}>
            <Link className={classes.link}>
              <div className={classes.imgWrap}>
                {false ? ( // TODO: check if dataset image exist
                  <img className={classes.img} src="" alt={dataset.path}></img>
                ) : (
                  <PhotoLibraryIcon className={classes.photoIcon} />
                )}
              </div>

              <div className={classes.info}>
                <strong className={classes.name}>{dataset.path}</strong>
                <div className={classes.date}>Created: {}</div>
                <div className={classes.items}>
                  <dl>
                    <dt>ITEMS</dt>
                    <dd>{}</dd>
                  </dl>
                  <dl>
                    <dt>XML</dt>
                    <dd>
                      {}/{}
                    </dd>
                  </dl>
                </div>
              </div>
            </Link>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
