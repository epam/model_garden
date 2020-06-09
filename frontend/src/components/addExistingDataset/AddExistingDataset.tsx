import React, { useState, FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Typography,
  InputLabel,
  Select,
  TextField,
  Button,
  MenuItem,
  FormControl
} from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { FormContainer, ProgressLoader } from '../shared';
import '../shared/style.css';
import { AppState } from '../../store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { addExistingDataset } from '../../store/media';
import { DEFAULT_FORM_DATA, TITLE } from './constants';
import { SnackbarAlert } from '../snackbarAlert';

type FormData = {
  bucketId: string;
  path: string;
};
type Severity = 'success' | 'info' | 'warning' | 'error' | undefined;

type ALERT = {
  show: boolean;
  severity: Severity;
  message: string;
};

const alertState = {
  show: false,
  severity: undefined,
  message: ''
};

export const AddExistingDataset: FC = () => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<FormData>({
    bucketId: DEFAULT_FORM_DATA.BUCKET_ID,
    path: DEFAULT_FORM_DATA.PATH
  });
  const [notification, setNotification] = useState<ALERT>(alertState);
  const [showLoader, setShowLoader] = useState(false);

  const { handleSubmit, control, watch, reset } = useForm<FormData>({
    defaultValues: formData
  });
  const { bucketId: bucketIdValue, path: pathValue } = watch([
    'bucketId',
    'path'
  ]);

  const buckets = useSelector((state: AppState) => state.main.buckets);
  const addedDataSets = useSelector(
    (state: AppState) => state.media.addedMediaAssets
  );

  const raiseAlert = (severity: Severity, message: string) => {
    setNotification({ show: true, severity, message });
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification((prevState) => ({
      ...prevState,
      show: false,
      message: ''
    }));
  };

  const handleAddExistingDatasetSubmit = (bucketId: string, path: string) => {
    dispatch(addExistingDataset({ bucketId, path }))
      .then(unwrapResult)
      .then(() => {
        raiseAlert(
          'success',
          `Dataset with ${addedDataSets} media assets has been added`
        );
        reset();
      })
      .catch(({ message }) => {
        raiseAlert('error', message);
      })
      .finally(() => setShowLoader(false));
  };

  const onSubmit = handleSubmit(({ bucketId, path }) => {
    setShowLoader(true);
    setFormData({ bucketId, path });
    handleAddExistingDatasetSubmit(bucketId, path);
  });

  const selectOptions = buckets.map((bucket) => (
    <MenuItem key={bucket.id} value={bucket.id}>
      {bucket.name}
    </MenuItem>
  ));

  return (
    <div className="upload-images">
      <FormContainer>
        <Typography variant="h1">{TITLE}</Typography>
        <form onSubmit={onSubmit} className="upload-images__form">
          <div className="upload-images__settings">
            <FormControl className="upload-images__settings-item">
              <InputLabel id="upload-images-bucket-name">Bucket</InputLabel>
              <Controller
                labelId="upload-images-bucket-name"
                name="bucketId"
                control={control}
                label="Bucket"
                variant="outlined"
                as={<Select>{selectOptions}</Select>}
              />
            </FormControl>
            <Controller
              className="upload-images__settings-item"
              name="path"
              control={control}
              label="Dataset"
              variant="outlined"
              helperText='Dataset path starting with "/"'
              as={<TextField />}
            />
            <Button
              className="upload-images__settings-item"
              color="primary"
              variant="contained"
              type="submit"
              disabled={
                bucketIdValue === DEFAULT_FORM_DATA.BUCKET_ID ||
                pathValue === DEFAULT_FORM_DATA.PATH
              }
            >
              ADD
            </Button>

            <ProgressLoader show={showLoader} />
            <SnackbarAlert
              open={notification.show}
              onClose={handleClose}
              severity={notification.severity}
            >
              {notification.message}
            </SnackbarAlert>
          </div>
        </form>
      </FormContainer>
    </div>
  );
};
