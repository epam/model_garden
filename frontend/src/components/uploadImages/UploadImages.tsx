import React, { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { useForm, Controller } from 'react-hook-form';
import {
  Typography,
  InputLabel,
  Select,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputAdornment
} from '@material-ui/core';
import {
  FormContainer,
  DropZone,
  ExtendedFile,
  ProgressLoader
} from '../shared';
import { SnackbarAlert } from '../snackbarAlert';
import '../shared/style.css';
import { useAppDispatch, useTypedSelector } from '../../store';
import { uploadMediaFiles } from '../../store/media';
import { DEFAULT_FORM_DATA } from './constants';

type FormData = {
  bucketId: string;
  path: string;
};

export const UploadImages: React.FC = () => {
  const dispatch = useAppDispatch();

  const [notification, setNotification] = useState<{
    show: boolean;
    severity: 'success' | 'info' | 'warning' | 'error' | undefined;
    message: string;
  }>({ show: false, severity: undefined, message: '' });

  const [files, setFiles] = useState<ExtendedFile[]>([]);
  const [formData, setFormData] = useState<FormData>({
    bucketId: DEFAULT_FORM_DATA.BUCKET_ID,
    path: DEFAULT_FORM_DATA.PATH
  });
  const [showLoader, setShowLoader] = useState(false);
  const { handleSubmit, control, watch, reset } = useForm<FormData>({
    defaultValues: formData
  });
  const bucketIdValue = watch('bucketId');
  const buckets = useTypedSelector((state) => state.main.buckets);

  const handleUploadImagesSubmit = (bucketId: string, path: string) => {
    dispatch(uploadMediaFiles({ files, bucketId, path }))
      .then(unwrapResult)
      .then(({ message }) => {
        setNotification({ show: true, severity: 'success', message });
        reset();
        setFiles([]);
      })
      .catch(({ message }) => {
        setNotification({ show: true, severity: 'error', message });
      })
      .finally(() => setShowLoader(false));
  };

  const onSubmit = handleSubmit(({ bucketId, path }) => {
    setShowLoader(true);
    setFormData({ bucketId, path });
    handleUploadImagesSubmit(bucketId, path);
  });

  const selectOptions = buckets.map((bucket) => (
    <MenuItem key={bucket.id} value={bucket.id}>
      {bucket.name}
    </MenuItem>
  ));

  const wipeNotification = () => {
    setNotification((ps) => ({ ...ps, show: false, message: '' }));
  };

  return (
    <>
      <div className="upload-images">
        <FormContainer>
          <Typography variant="h1">Upload Images</Typography>
          <form onSubmit={onSubmit} className="upload-images__form">
            <div className="upload-images__dropzone">
              <DropZone files={files} setFiles={setFiles} />
            </div>
            <div className="upload-images__settings">
              <FormControl className="upload-images__settings-item">
                <InputLabel id="upload-images-bucket-name">Bucket</InputLabel>
                <Controller
                  labelId="upload-images-bucket-name"
                  name="bucketId"
                  control={control}
                  label="Bucket"
                  as={<Select>{selectOptions}</Select>}
                />
              </FormControl>
              <Controller
                className="upload-images__settings-item"
                name="path"
                control={control}
                label="Dataset path:"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">/</InputAdornment>
                  )
                }}
                as={<TextField />}
              />
              <Button
                className="upload-images__settings-item"
                color="primary"
                variant="contained"
                type="submit"
                disabled={
                  files.length === 0 ||
                  bucketIdValue === DEFAULT_FORM_DATA.BUCKET_ID
                }
              >
                Upload
              </Button>
            </div>
          </form>
        </FormContainer>
        <ProgressLoader show={showLoader} />
      </div>
      <SnackbarAlert
        open={notification.show}
        onClose={wipeNotification}
        severity={notification.severity}
      >
        {notification.message}
      </SnackbarAlert>
    </>
  );
};
