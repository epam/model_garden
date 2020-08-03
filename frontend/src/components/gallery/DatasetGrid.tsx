import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { makeStyles, Grid, Link, Paper } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import { Empty } from 'antd';

import { Dataset } from '../../models';
import { useTypedSelector } from '../../store';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '19.5rem',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: theme.shadows[4],
    '&:hover': {
      transition: 'all 0.1s ease-in-out',
      boxShadow: theme.shadows[3],
      transform: 'scale(1.01)'
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
  data: {
    marginBottom: '0.625rem',
    fontSize: '0.73rem',
    lineHeight: 14 / 12,
    whiteSpace: 'nowrap'
  },
  items: {
    display: 'flex',
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
  },
  empty: {
    margin: '0 auto'
  }
}));

export const DatasetGrid = ({ searchTerm, currentBucketId }: any) => {
  const classes = useStyles();
  const datasets = useTypedSelector(({ data }) =>
    data.datasets.filter((dataset) =>
      searchTerm
        ? dataset.path.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
  );
  const match = useRouteMatch();

  if (!currentBucketId) {
    // we have to make sure we hide datasets if we don't have an active bucketId , otherwise we won't have a bucketID to navigate to
    return null;
  }

  return (
    <Grid container spacing={2}>
      {!datasets.length && (
        <Empty
          description="To get started, select the buсket in the list on the top"
          className={classes.empty}
        />
      )}
      {datasets.map((dataset: Dataset) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={dataset.id}>
          <Paper className={classes.card}>
            <Link
              className={classes.link}
              component={RouterLink}
              to={`${match?.url}/bucket/${currentBucketId}/dataset/${dataset.id}`}
            >
              <div className={classes.imgWrap}>
                {dataset.preview_image ? (
                  <img
                    className={classes.img}
                    src={dataset.preview_image}
                    alt={dataset.path}
                  ></img>
                ) : (
                  <PhotoLibraryIcon className={classes.photoIcon} />
                )}
              </div>

              <div className={classes.info}>
                <strong className={classes.name}>{dataset.path}</strong>
                <div className={classes.data}>Format: PASCAL VOC</div>
                <div className={classes.data}>
                  Created: {new Date(dataset.created_at).toLocaleString()}
                </div>
                <div className={classes.items}>
                  <dl>
                    <dt>ITEMS</dt>
                    <dd>{dataset.items_number}</dd>
                  </dl>
                  <dl>
                    <dt>LABELS</dt>
                    <dd>{dataset.xmls_number}</dd>
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
