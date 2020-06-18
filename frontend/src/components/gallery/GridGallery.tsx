import React from 'react';
import {
  Box,
  GridList,
  GridListTile,
  makeStyles,
  GridListTileBar,
  IconButton
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

import { Empty } from 'antd';

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

export const GridGallery = ({ photos }: any) => {
  const classes = useStyles();
  return (
    <Box paddingTop={3}>
      {!photos.length && <Empty />}

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
