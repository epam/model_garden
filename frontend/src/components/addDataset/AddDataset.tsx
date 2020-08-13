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
  Typography,
  MenuItem
} from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { FormContainer } from '../shared';
import { useAppDispatch, useTypedSelector } from '../../store';
import { addExistingDataset, uploadMediaFiles } from '../../store/media';
import {
  UploadPaper,
  UploadDescription,
  FormData,
  BucketsSelect
} from './utils';
import { UploadFiles } from './uploadImages';

export const AddDataset: FC<any> = ({ match, location }) => {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[]>([]);
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
      path: location.state?.dataset.path.replace('/', '') ?? '',
      format: location.state?.dataset.format ?? ''
    }
  });

  const resetForm = () => {
    reset({
      path: '',
      bucketId: '',
      format: ''
    });
  };

  const AddExistingDataset = (
    bucketId: string,
    path: string,
    format: string
  ) => {
    dispatch(addExistingDataset({ bucketId, path, format }))
      .then(unwrapResult)
      .then(() => {
        resetForm();
      })
      .catch(() => {});
  };

  const UploadImages = (bucketId: string, path: string, format: string) => {
    dispatch(uploadMediaFiles({ files, bucketId, path, format }))
      .then(unwrapResult)
      .then(() => {
        resetForm();
        setFiles([]);
      })
      .catch(() => {});
  };

  const onSubmit = handleSubmit(({ bucketId, path, format }) => {
    if (location.pathname === `${match.path}/upload-images`) {
      UploadImages(bucketId, path, format);
    } else {
      AddExistingDataset(bucketId, path, format);
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
            <FormControl>
              <InputLabel id="dataset-format">Format</InputLabel>
              <Controller
                labelId="dataset-format"
                name="format"
                control={control}
                rules={{ required: true }}
                label="Format"
                defaultValue=""
                as={
                  <Select>
                    <MenuItem value="PASCAL_VOC">PASCAL VOC</MenuItem>
                    {/* <MenuItem value="YOLO">YOLO</MenuItem> @todo Uncomment when backend will be ready*/}
                  </Select>
                }
              />
            </FormControl>
            <TextField
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
    </>
  );
};
