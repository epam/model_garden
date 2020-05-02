import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  InputLabel,
  Select,
  TextField,
  Button,
  MenuItem,
} from "@material-ui/core";
import { DropZone, FormContainer } from "../shared";
import "./UploadImages.css";
import { AppState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { uploadMediaFiles, setMediaFiles } from "../../store/media";

type FormData = {
  bucketName: string;
  path: string;
};

export const UploadImages: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    bucketName: "",
    path: "",
  });
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: formData,
  });
  const bucketNames = useSelector((state: AppState) => state.main.bucketNames);
  const isFilesUploading = useSelector(
    (state: AppState) => state.media.isUploading
  );
  const mediaFiles = useSelector((state: AppState) => state.media.mediaFiles);

  const handleUploadImagesSubmit = (bucketName: string, path: string) => {
    dispatch(uploadMediaFiles(mediaFiles, bucketName, path));
  };

  const handleDropFiles = (files: File[]) => {
    dispatch(setMediaFiles(files));
  };

  const onSubmit = handleSubmit(({ bucketName, path }) => {
    setFormData({ bucketName, path });
    handleUploadImagesSubmit(bucketName, path);
  });

  const selectOptions = bucketNames.map((bucketName) => (
    <MenuItem key={bucketName} value={bucketName}>
      {bucketName}
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
            <InputLabel id="upload-images-bucket-name">Bucket Name</InputLabel>
            <Controller
              labelId="upload-images-bucket-name"
              className="upload-images__settings-item"
              name="bucketName"
              control={control}
              label="S3 Bucket name"
              variant="outlined"
              as={<Select>{selectOptions}</Select>}
            />
            <Controller
              className="upload-images__settings-item"
              name="path"
              control={control}
              label="Path"
              variant="outlined"
              as={<TextField />}
            />
            <Button
              className="upload-images__settings-item"
              color="primary"
              variant="contained"
              type="submit"
            >
              Upload
            </Button>
          </div>
        </form>
      </FormContainer>
    </div>
  );
};
