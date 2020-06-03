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
import {
  FormContainer,
  DropZone,
  ProgressLoader
} from "../shared";
import "../shared/style.css";
import { AppState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { uploadMediaFiles, setMediaFiles } from "../../store/media";
import {DEFAULT_FORM_DATA} from "./constants";

type FormData = {
  bucketId: string;
  path: string;
};

export const UploadImages: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    bucketId: DEFAULT_FORM_DATA.BUCKET_ID,
    path: DEFAULT_FORM_DATA.PATH,
  });
  const [showLoader, setShowLoader] = useState(false);
  const { handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: formData,
  });
  const bucketIdValue = watch('bucketId');
  const buckets = useSelector((state: AppState) => state.main.buckets);
  const mediaFiles = useSelector((state: AppState): File[] => state.media.mediaFiles);

  const handleUploadImagesSubmit = (bucketId: string, path: string) => {
    (dispatch(uploadMediaFiles(mediaFiles, bucketId, path)) as any)
      .then(() => setShowLoader(false));
  };

  const handleDropFiles = (files: File[]) => {
    dispatch(setMediaFiles(files));
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
              handleDrop={handleDropFiles}
            />
          </div>
          <div className="upload-images__settings">
            <FormControl className="upload-images__settings-item">
              <InputLabel id="upload-images-bucket-name">
                Bucket
              </InputLabel>
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
              disabled={mediaFiles.length === 0 || bucketIdValue === DEFAULT_FORM_DATA.BUCKET_ID}
            >
              Upload
            </Button>
          </div>
        </form>
      </FormContainer>
      <ProgressLoader show={showLoader} />
    </div>
  );
};
