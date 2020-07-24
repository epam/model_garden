import React, { useState, FC, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Route, Redirect, Link } from 'react-router-dom';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { FormContainer, ProgressLoader } from '../shared';
import { useAppDispatch, useTypedSelector } from '../../store';
import { addExistingDataset, uploadMediaFiles } from '../../store/media';
import { SnackbarAlert } from '../snackbarAlert';
import {
  UploadPaper,
  UploadDescription,
  FormData,
  BucketsSelect
} from './utils';
import { Alert, Severity } from './../../models';
import { UploadFiles } from './uploadImages';

const alertState: Alert = {
  show: false,
  severity: undefined,
  message: ''
};

export const AddDataset: FC<any> = ({ match, location }) => {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const [notification, setNotification] = useState(alertState);
  const [showLoader, setShowLoader] = useState(false);
  const buckets = useTypedSelector((state) => state.data.buckets);

  useEffect(
    () => () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const { handleSubmit, control, register, reset, formState } = useForm<
    FormData
  >({
    mode: 'onChange',
    defaultValues: {
      bucketId: location.state?.dataset.bucket ?? '',
      path: location.state?.dataset.path.replace('/', '') ?? ''
    }
  });

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

  const resetForm = () => {
    reset({
      path: '',
      bucketId: ''
    });
  };

  const AddExistingDataset = (bucketId: string, path: string) => {
    dispatch(addExistingDataset({ bucketId, path }))
      .then(unwrapResult)
      .then(() => {
        raiseAlert('success', `Dataset has been added`);
        resetForm();
      })
      .catch(({ message }) => {
        raiseAlert('error', message);
      })
      .finally(() => setShowLoader(false));
  };

  const UploadImages = (bucketId: string, path: string) => {
    dispatch(uploadMediaFiles({ files, bucketId, path }))
      .then(unwrapResult)
      .then(({ message }) => {
        raiseAlert('success', message);
        resetForm();
        setFiles([]);
      })
      .catch(({ message }) => {
        raiseAlert('error', message);
      })
      .finally(() => setShowLoader(false));
  };

  const onSubmit = handleSubmit(({ bucketId, path }) => {
    setShowLoader(true);
    if (location.pathname === `${match.path}/upload-images`) {
      UploadImages(bucketId, path);
    } else {
      AddExistingDataset(bucketId, path);
    }
  });

  const subTabs = [
    {
      label: 'upload images',
      path: 'upload-images',
      component: (navProps: any) => (
        <UploadFiles {...navProps} files={files} setFiles={setFiles} />
      )
    },
    {
      label: 'add Existing Bucket Path',
      path: 'bucket-path',
      component: () => (
        <UploadDescription variant="body2">
          <span>
            Images should be already upload to the bucket (e.g. by CyberDuck)
            and not to be referenced in the database yet
          </span>
        </UploadDescription>
      )
    }
  ];

  if (location.pathname === match.path) {
    return <Redirect to={`${match.path}/upload-images`} />;
  }

  return (
    <>
      <FormContainer>
        <Typography variant="h1">Add Dataset</Typography>
        <UploadPaper variant="outlined">
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            value={location.pathname.includes('/upload-images') ? 0 : 1}
            aria-label="add Dataset Example"
          >
            {subTabs.map((item) => (
              <Tab
                label={item.label}
                key={item.path}
                component={Link}
                to={`${match.path}/${item.path}`}
              />
            ))}
          </Tabs>
          {subTabs.map((item) => (
            <Route
              path={`${match.url}/${item.path}`}
              key={item.path}
              component={item.component}
            />
          ))}
        </UploadPaper>
        <form onSubmit={onSubmit}>
          <>
            <FormControl>
              <InputLabel id="upload-images-bucket-name">Bucket</InputLabel>
              <Controller
                labelId="upload-images-bucket-name"
                name="bucketId"
                control={control}
                rules={{ required: true }}
                label="Bucket"
                defaultValue=""
                as={<Select>{BucketsSelect(buckets)}</Select>}
              />
            </FormControl>
            <TextField
              className="upload-images__settings-item"
              name="path"
              label="Dataset path"
              inputRef={register({
                required: true
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">/</InputAdornment>
                )
              }}
            />
            <Button
              fullWidth={true}
              color="primary"
              variant="contained"
              type="submit"
              disabled={!formState.isValid}
            >
              {location.pathname === `${match.path}/upload-images`
                ? 'UPLOAD'
                : 'ADD'}
            </Button>
          </>
        </form>
      </FormContainer>
      <ProgressLoader show={showLoader} />
      <SnackbarAlert
        open={notification.show}
        onClose={handleClose}
        severity={notification.severity}
      >
        {notification.message}
      </SnackbarAlert>
    </>
  );
};
