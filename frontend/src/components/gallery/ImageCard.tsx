import React from 'react';
import {
  makeStyles,
  withStyles,
  Paper,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '3.875rem',
    height: '13.9375rem'
  },
  info: {
    backgroundColor: '#ffffff',
    padding: '0 0.75rem 0 0',
    position: 'absolute',
    left: '0',
    top: '0',
    right: '0'
  },
  imgWrap: {
    backgroundColor: blueGrey[50],
    height: '8.4375rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    maxHeight: '100%',
    maxWidth: '100%'
  },
  download: {
    color: 'white',
    width: '100%',
    backgroundColor: blueGrey[700],
    border: 'none',
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.0625rem 0.75rem',
    cursor: 'pointer',
    transition: '0.3s background',
    '&:hover': {
      backgroundColor: blueGrey[800]
    }
  }
}));

const StyledCheckboxLabel = withStyles({
  root: {
    width: '100%',
    margin: '0'
  },
  label: {
    whiteSpace: 'nowrap',
    fontSize: '0.875rem',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    fontWeight: 500
  }
})(FormControlLabel);

export const ImageCard = ({
  imageSrc,
  xmlPath,
  setCheckList,
  checklist
}: any) => {
  const classes = useStyles();
  const fileName = imageSrc.substring(imageSrc.lastIndexOf('/') + 1);

  const check = (fileName: string) =>
    setCheckList((ps: string[]) =>
      ps
        .filter((x) => ![fileName].includes(x))
        .concat([fileName].filter((x) => !ps.includes(x)))
    );

  return (
    <Paper className={classes.card}>
      <div className={classes.info}>
        <StyledCheckboxLabel
          title={fileName}
          label={fileName}
          checked={checklist.includes(fileName)}
          onChange={() => check(fileName)}
          control={<Checkbox size="small" />}
        />
      </div>

      <div className={classes.imgWrap}>
        <img className={classes.img} src={imageSrc} alt={fileName}></img>
      </div>
      {xmlPath && (
        <button
          className={classes.download}
          onClick={() => {
            window.location.href = xmlPath;
          }}
        >
          Download Label <GetAppIcon />
        </button>
      )}
    </Paper>
  );
};
