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

const useStyles = makeStyles(() => ({
  card: {
    position: 'relative',
    overflow: 'hidden',
    height: '100%'
  },
  info: {
    padding: '0.75rem',
    fontSize: '0.75rem',
    minHeight: '3.875rem'
  },
  filename: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    marginBottom: '0.25rem'
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
    margin: '-0.75rem 0 0 -0.75rem'
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
  image,
  setCheckList,
  checklist
}: any): JSX.Element => {
  const classes = useStyles();
  const { remote_path, remote_label_path, filename: fileName } = image;

  const check = (fileNameParam: string) =>
    setCheckList((ps: string[]) =>
      ps
        .filter((x) => ![fileNameParam].includes(x))
        .concat([fileNameParam].filter((x) => !ps.includes(x)))
    );

  return (
    <Paper className={classes.card}>
      <div className={classes.info}>
        {/* todo: Feature toogle. Remove after BE API will be ready */}
        {process.env.NODE_ENV !== 'production' ? (
          <StyledCheckboxLabel
            title={fileName}
            label={fileName}
            checked={checklist.includes(fileName)}
            onChange={() => check(fileName)}
            control={<Checkbox size="small" />}
          />
        ) : (
          <strong className={classes.filename} title={fileName}>
            {fileName}
          </strong>
        )}
        {image.labeling_task_name && `Task: ${image.labeling_task_name}`}
      </div>

      <div className={classes.imgWrap}>
        <img className={classes.img} src={remote_path} alt={fileName}></img>
      </div>
      {remote_label_path && (
        <button
          className={classes.download}
          onClick={() => {
            window.location.href = remote_label_path;
          }}
        >
          Download Label <GetAppIcon />
        </button>
      )}
    </Paper>
  );
};
