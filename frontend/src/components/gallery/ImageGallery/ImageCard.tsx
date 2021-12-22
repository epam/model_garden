import React, { useState, useRef, useLayoutEffect } from 'react';
import { makeStyles, Paper, Checkbox } from '@material-ui/core';
import { Modal } from 'antd';
import blueGrey from '@material-ui/core/colors/blueGrey';
import GetAppIcon from '@material-ui/icons/GetApp';

import { StyledCheckboxLabel } from './StyledCheckboxLabel';
import { isProd } from '../../../utils';
import { initCanvas, check } from './utils';

const useStyles = makeStyles((theme) => ({
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
    alignItems: 'center',
    cursor: 'pointer'
  },
  img: {
    maxHeight: '100%',
    maxWidth: '100%'
  },
  canvas: {
    width: '100%',
    height: 'auto'
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
  },
  imgPreview: {
    position: 'relative'
  }
}));

export const ImageCard = ({
  image,
  setCheckList,
  checklist,
  datasetFormat
}: any): JSX.Element => {
  const classes = useStyles();
  const { remote_path, remote_label_path, filename: fileName } = image;
  const canvas = useRef<HTMLCanvasElement>(null);
  const [isOpenImagePreview, setOpenImagePreview] = useState(false);

  useLayoutEffect(() => {
    if (isOpenImagePreview) {
      initCanvas(canvas.current, datasetFormat, remote_label_path, remote_path);
    }
  }, [isOpenImagePreview, datasetFormat, remote_label_path, remote_path]);

  return (
    <Paper className={classes.card}>
      <div className={classes.info}>
        {/* todo: Feature toogle. Remove after BE API will be ready */}
        {isProd() ? (
          <strong className={classes.filename} title={fileName}>
            {fileName}
          </strong>
        ) : (
          <StyledCheckboxLabel
            title={fileName}
            label={fileName}
            checked={checklist.includes(fileName)}
            onChange={() => check(setCheckList, fileName)}
            control={<Checkbox size="small" />}
          />
        )}
        {image.labeling_task_name && `Task: ${image.labeling_task_name}`}
      </div>

      <div
        className={classes.imgWrap}
        onClick={() => setOpenImagePreview(true)}
        title="Click to open preview"
      >
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
      {/* TODO: Remove Modal from each Image component. Keep only one Modal instance on the page */}
      <Modal
        title={fileName}
        visible={isOpenImagePreview}
        onCancel={() => setOpenImagePreview(false)}
        footer={null}
      >
        <div className={classes.imgPreview}>
          <canvas className={classes.canvas} ref={canvas}></canvas>
        </div>
      </Modal>
    </Paper>
  );
};
