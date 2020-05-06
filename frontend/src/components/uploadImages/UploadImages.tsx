import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  InputLabel,
  Select,
  TextField,
  Button,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import { DropZone, FormContainer } from "../shared";
import "./UploadImages.css";
import { AppState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { uploadMediaFiles, setMediaFiles } from "../../store/media";

type FormData = {
  bucketId: string;
  path: string;
};

export const UploadImages: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    bucketId: "",
    path: "",
  });
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: formData,
  });
  const buckets = useSelector((state: AppState) => state.main.buckets);
  const isFilesUploading = useSelector(
    (state: AppState) => state.media.isUploading
  );
  const mediaFiles = useSelector((state: AppState): File[] => state.media.mediaFiles);

  const handleUploadImagesSubmit = (bucketId: string, path: string) => {
    dispatch(uploadMediaFiles(mediaFiles, bucketId, path));
  };

  const handleDropFiles = (files: File[]) => {
    dispatch(setMediaFiles(files));
  };

  const onSubmit = handleSubmit(({ bucketId, path }) => {
    setFormData({ bucketId, path });
    handleUploadImagesSubmit(bucketId, path);
  });

  const selectOptions = buckets.map((bucket) => (
    <MenuItem key={bucket.id} value={bucket.id}>
      {bucket.name}
    </MenuItem>
  ));

  return (
    <div className="upload-images">
      <FormContainer>
        <Typography
          variant="h5"
          component="h1"
          className="upload-images__title"
        >
          UPLOAD IMAGES
        </Typography>
        <form onSubmit={onSubmit} className="upload-images__form">
          <div className="upload-images__dropzone">
            <DropZone
              isUploading={isFilesUploading}
              handleDrop={handleDropFiles}
            />
          </div>
          <div className="upload-images__settings">
            <FormControl className="upload-images__settings-item">
              <InputLabel id="upload-images-bucket-name">
                S3 Bucket Name
              </InputLabel>
              <Controller
                labelId="upload-images-bucket-name"
                name="bucketId"
                control={control}
                label="S3 Bucket name"
                variant="outlined"
                helperText="bucket name on the AWS S3"
                as={<Select>{selectOptions}</Select>}
              />
            </FormControl>
            <Controller
              className="upload-images__settings-item"
              name="path"
              control={control}
              label="Path"
              variant="outlined"
              helperText="Path to images dataset"
              as={<TextField />}
            />
            <Button
              className="upload-images__settings-item"
              color="primary"
              variant="contained"
              type="submit"
              disabled={mediaFiles.length === 0}
            >
              Upload
            </Button>
          </div>
        </form>
      </FormContainer>
    </div>
  );
};
