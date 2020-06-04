import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  InputLabel,
  Select,
  TextField,
  Button,
  MenuItem,
  FormControl, Snackbar,
} from "@material-ui/core";
import { FormContainer, ProgressLoader } from "../shared";
import "../shared/style.css";
import { AppState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import {addExistingDataset} from "../../store/media";
import {DEFAULT_FORM_DATA, TITLE} from "./constants";
import {Alert} from "@material-ui/lab";

type FormData = {
  bucketId: string;
  path: string;
};

export const AddExistingDataset: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    bucketId: DEFAULT_FORM_DATA.BUCKET_ID,
    path: DEFAULT_FORM_DATA.PATH,
  });

  const [open, setOpen] = React.useState(false);

  const raiseSuccessAlert = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const [showLoader, setShowLoader] = useState(false);

  const { handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: formData,
  });
  const {bucketId: bucketIdValue, path: pathValue} = watch(['bucketId', 'path']);

  const buckets = useSelector((state: AppState) => state.main.buckets);

  const addedDataSets = useSelector(
    (state: AppState) => state.media.addedMediaAssets
  );

  const handleAddExistingDatasetSubmit = (bucketId: string, path: string) => {
    (dispatch(addExistingDataset({bucketId, path})) as any).then(() => {
      setShowLoader(false);
      raiseSuccessAlert();
    });
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
        <Typography
          variant="h5"
          component="h1"
          className="upload-images__title"
        >
          {TITLE}
        </Typography>
        <form onSubmit={onSubmit} className="upload-images__form">
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
              disabled={bucketIdValue === DEFAULT_FORM_DATA.BUCKET_ID || pathValue === DEFAULT_FORM_DATA.PATH}
            >
              ADD
            </Button>

            <ProgressLoader show={showLoader} />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={ { vertical: 'top', horizontal: 'right' } } >
              <Alert onClose={handleClose} severity="success">
                Dataset with {addedDataSets} media assets has been added
              </Alert>
            </Snackbar>
          </div>
        </form>
      </FormContainer>
    </div>
  );
};
