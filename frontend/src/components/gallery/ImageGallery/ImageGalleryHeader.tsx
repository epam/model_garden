import React, { useState } from 'react';
import { makeStyles, Typography, Button, Tooltip } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { Link, useRouteMatch, Redirect } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useTypedSelector } from '../../../store';
import { IBucket, IDataset } from '../../../models';
import DeleteIcon from '@material-ui/icons/Delete';
import { ConformationDialog } from '../../shared';

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: blueGrey[50],
    padding: '1rem',
    margin: '-2.5rem 0 1.5rem'
  },
  topRow: {
    display: 'flex'
  },
  backIcon: {
    fontSize: '1.5rem'
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
  },
  lastHeaderItem: {
    marginLeft: 'auto'
  }
}));

export const ImageGalleryHeader = ({
  removeDataset,
  areTasks
}: any): JSX.Element => {
  const classes = useStyles();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteDataset, setDeleteDataset] = useState(false);

  const {
    params: { datasetId, bucketId }
  } = useRouteMatch();

  const currentBucket = useTypedSelector((state) => state.data.buckets).find(
    (bucket: IBucket) => bucket.id === bucketId
  );

  const currentDataset = useTypedSelector((state) => state.data.datasets).find(
    (dataset: IDataset) => dataset.id === datasetId
  );

  const handleDeleteDataset = () => {
    removeDataset({ datasetId, bucketId }).then(({ type }: any) => {
      if (type.match('fulfilled')) {
        setDeleteDataset(true);
      }
    });
    setOpenConfirmDialog(false);
  };

  return (
    <header className={classes.header}>
      {deleteDataset ? <Redirect to="/gallery" /> : null}
      <div className={classes.topRow}>
        <Link to="/gallery">
          <ArrowBackIosIcon className={classes.backIcon} />
          <Typography variant="srOnly">Back to datasets list</Typography>
        </Link>
        <h1 className={classes.title}>
          {currentBucket?.name}
          {currentDataset?.path}
        </h1>
        <Tooltip
          title={
            areTasks
              ? 'Dataset has active tasks. Please archive them before'
              : ''
          }
          arrow
        >
          <span className={classes.lastHeaderItem}>
            <Button
              color="primary"
              startIcon={<DeleteIcon />}
              disabled={areTasks}
              onClick={() => setOpenConfirmDialog(true)}
            >
              DELETE DATASET
            </Button>
          </span>
        </Tooltip>
      </div>
      <div>
        <ul className={classes.info}>
          <li>ITEMS: {currentDataset?.items_number}</li>
          <li>LABELS: {currentDataset?.xmls_number}</li>
          <li>
            CREATED:
            {new Date(currentDataset?.created_at ?? 0).toLocaleString()}
          </li>
          <li>FORMAT: {currentDataset?.dataset_format}</li>
        </ul>
      </div>
      <ConformationDialog
        title="Delete Dataset Confirmation"
        closeButton="No, Keep Dataset"
        confirmButton="Yes, Delete Dataset"
        open={openConfirmDialog}
        setOpen={(isOpen: boolean) => setOpenConfirmDialog(isOpen)}
        handleConfirm={handleDeleteDataset}
      >
        <p>Are you sure you want to delete the current dataset?</p>
      </ConformationDialog>
    </header>
  );
};
