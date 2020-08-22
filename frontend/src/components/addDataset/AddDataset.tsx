import React, { useState, FC, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useRouteMatch } from 'react-router-dom';
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
  MenuItem,
  DialogActions,
  Box
} from '@material-ui/core';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useTypedSelector } from '../../store';
import { addExistingDataset, uploadMediaFiles } from '../../store/media';
import {
  UploadPaper,
  UploadDescription,
  FormData,
  BucketsSelect
} from './utils';
import { UploadFiles } from './uploadImages';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export const AddDataset: FC<any> = (props) => {
  const location = useLocation() as any;
  const match = useRouteMatch();
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[]>([]);
  const buckets = useTypedSelector((state) => state.data.buckets);
  const [submitAction, setSubmitAction] = useState(0);

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
    if (submitAction) {
      AddExistingDataset(bucketId, path, format);
    } else {
      UploadImages(bucketId, path, format);
    }
  });

  const subTabs = [
    {
      label: 'upload images',
      path: 'upload',
      component: (navProps: any) => (
        <UploadFiles {...navProps} files={files} setFiles={setFiles} />
      )
    },
    {
      label: 'add Existing Bucket Path',
      path: 'add',
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

  return (
    <>
      <UploadPaper variant="outlined">
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          value={submitAction}
          onChange={(_, newValue: any) => setSubmitAction(newValue)}
          aria-label="add Dataset Example"
        >
          {subTabs.map((item) => (
            <Tab label={item.label} key={item.path} />
          ))}
        </Tabs>
        {subTabs.map((item, index) =>
          submitAction === index ? <item.component /> : null
        )}
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
                  <MenuItem value="VOC">PASCAL VOC</MenuItem>
                  <MenuItem value="YOLO">YOLO</MenuItem>
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

          <DialogActions>
            <Button type="button" color="primary" onClick={props.onClose}>
              Close
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!formState.isValid}
            >
              {subTabs[submitAction].path}
            </Button>
          </DialogActions>
        </>
      </form>
    </>
  );
};
