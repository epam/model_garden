import React, { useState, FC, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import {
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  Tab,
  Tabs,
  TextField,
  MenuItem
} from '@material-ui/core';
import { Modal, Button } from 'antd';
import { unwrapResult } from '@reduxjs/toolkit';

import { useAppDispatch, useTypedSelector } from '../../store';
import { addExistingDataset, uploadMediaFiles } from '../../store/media';
import { IAddExistingDataset, IFilePreview } from '../../store/media/types';
import { UploadPaper, UploadDescription, BucketsSelect } from './utils';
import { UploadFiles } from './UploadFiles';
import '../tasksStatuses/createTaskDialog/CreateTaskDialog.tsx';
import { capitalize } from '../../utils';
import { PASCAL_VOC, YOLO } from '../../constants';

const getDefaultState = (location: any): IAddExistingDataset => ({
  bucketId: location.state?.dataset.bucket ?? '',
  path: location.state?.dataset.path.replace('/', '') ?? '',
  format: location.state?.dataset.format ?? ''
});

export const AddDatasetModal: FC<any> = (props) => {
  const location = useLocation() as any;
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<IFilePreview[]>([]);
  const buckets = useTypedSelector((state) => state.data.buckets);
  const [currentTab, setcurrentTab] = useState(0);

  useEffect(
    () => () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const { handleSubmit, control, register, reset, formState } = useForm<
    IAddExistingDataset
  >({
    mode: 'onChange',
    defaultValues: getDefaultState(location)
  });

  const subTabs = [
    {
      label: 'upload images',
      path: 'upload',
      component: () => <UploadFiles files={files} setFiles={setFiles} />,
      action: (payload: IAddExistingDataset) =>
        uploadMediaFiles({ ...payload, files })
    },
    {
      label: 'add Existing Bucket Path',
      path: 'add',
      component: () => <UploadDescription />,
      action: addExistingDataset
    }
  ];

  const CurrentTabComponent = subTabs[currentTab].component;

  const onSubmit = handleSubmit((payload: IAddExistingDataset) => {
    dispatch(subTabs[currentTab].action(payload) as any)
      .then(unwrapResult)
      .then(() => {
        reset(getDefaultState(location));
        setFiles([]);
        props.onClose();
      })
      .catch(() => {});
  });

  return (
    <Modal
      title="Add Dataset"
      visible={props.visible}
      onCancel={props.onClose}
      width="540px"
      footer={[
        <Button key="back" onClick={props.onClose}>
          Close
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={!formState.isValid}
          onClick={onSubmit}
        >
          {capitalize(subTabs[currentTab].path)}
        </Button>
      ]}
    >
      <form>
        <UploadPaper variant="outlined">
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            value={currentTab}
            variant="fullWidth"
            onChange={(_, newValue: any) => setcurrentTab(newValue)}
            aria-label="add Dataset Example"
          >
            {subTabs.map((item) => (
              <Tab label={item.label} key={item.path} />
            ))}
          </Tabs>
          <CurrentTabComponent />
        </UploadPaper>
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
                <MenuItem value={PASCAL_VOC}>{PASCAL_VOC}</MenuItem>
                <MenuItem value={YOLO}>{YOLO}</MenuItem>
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
            startAdornment: <InputAdornment position="start">/</InputAdornment>
          }}
        />
      </form>
    </Modal>
  );
};
