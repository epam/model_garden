import React, { useEffect } from 'react';
import {
  Box,
  GridList,
  GridListTile,
  makeStyles,
  GridListTileBar,
  IconButton
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useRouteMatch, Redirect, Link } from 'react-router-dom';
import { Empty } from 'antd';

import { useTypedSelector, useAppDispatch } from '../../store';
import { getMediaAssets } from '../../store/data';

const useStyles = makeStyles((theme) => ({
  item: {
    [theme.breakpoints.down('sm')]: {
      width: `${100 / 3}%`
    },
    [theme.breakpoints.only('md')]: {
      width: `${100 / 4}%`
    },
    [theme.breakpoints.only('lg')]: {
      width: `${100 / 6}%`
    },
    [theme.breakpoints.up('xl')]: {
      width: `${100 / 10}% `
    }
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.9)'
  }
}));

export const GridGallery = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const photos = useTypedSelector(({ data }) => data.mediaAssets);
  const datasets = useTypedSelector(({ data }) => data.datasets);
  const {
    params: { datasetId }
  } = useRouteMatch();

  useEffect(() => {
    if (datasets.length > 0) {
      dispatch(getMediaAssets({ datasetId: parseInt(datasetId) }));
    }
  }, [dispatch, datasetId, datasets.length]);

  if (datasets.length === 0) {
    return <Redirect to="/gallery" />;
  }
  return (
    <Box paddingTop={3}>
      {!photos.length && (
        <Link
          to={{
            pathname: '/add-dataset/upload-images',
            state: {
              dataset: datasets.find(
                (dataset: any) => dataset.id === parseInt(datasetId)
              )
            }
          }}
        >
          <Empty description="this dataset doesn't have any images yet, click to upload" />
        </Link>
      )}

      <GridList>
        {photos.map((tile: any) => (
          <GridListTile className={classes.item} key={tile.remote_path}>
            <img src={tile.remote_path} alt="taggable-item" />
            {tile.remote_xml_path && (
              <GridListTileBar
                title="Download XML"
                actionIcon={
                  <IconButton
                    className={classes.icon}
                    aria-label={`info about ${tile.title}`}
                    onClick={() => {
                      window.location.href = tile.remote_xml_path;
                    }}
                  >
                    <GetAppIcon />
                  </IconButton>
                }
              />
            )}
          </GridListTile>
        ))}
      </GridList>
    </Box>
  );
};
