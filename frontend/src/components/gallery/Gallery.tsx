import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {useCurrentWitdh} from './useWidth';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    padding: 30,
    paddingTop: 20
  },
  gridList: {
    width: '100%',
    height: '100%'
  }
}));

const Gallery = () => {
  const [fotos, setFotos] = useState([]);
  const width = useCurrentWitdh();
  console.log(width)
  let numberOfColumns;

  if (width > 2000) {
    numberOfColumns = 8;
  }else if (width > 1700) {
    numberOfColumns = 7;
  } else if (width > 1200) {
    numberOfColumns = 5;
  } else if (width > 720) {
    numberOfColumns = 4;
  } else if (width > 500) {
    numberOfColumns = 3;
  }

  const classes = useStyles();
  useEffect(() => {
    axios.get('http://localhost:9000/api/media-assets/').then(({ data }: any) => setFotos(data.results));
  }, []);

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={numberOfColumns}>
        {fotos.map((tile: any) => (
          <GridListTile key={tile.filename+tile.remote_path+tile.dataset} cols={1}>
            <img src={tile.remote_path} alt={'picture'} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

export { Gallery };
