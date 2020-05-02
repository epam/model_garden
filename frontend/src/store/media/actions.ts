import { AppThunk } from "../index";
import {
  MediaActionTypes,
  SET_MEDIA_FILES,
  UPLOAD_MEDIA_FILES_START,
  UPLOAD_MEDIA_FILES_SUCCESS,
} from "./types";
import { uploadMediaFilesRequest } from "../../api";
import { setErrorAction } from '../error';

export function setMediaFiles(files: File[]): MediaActionTypes {
  return {
    type: SET_MEDIA_FILES,
    mediaFiles: files
  }
}

export function uploadMediaFilesStart(): MediaActionTypes {
  return {
    type: UPLOAD_MEDIA_FILES_START,
  };
}

export function uploadMediaFilesSuccess(butchName: string): MediaActionTypes {
  return {
    type: UPLOAD_MEDIA_FILES_SUCCESS,
    butchName
  }
}

export const uploadMediaFiles = (files: File[], bucketName: string, path: string): AppThunk => dispatch => {
  dispatch(uploadMediaFilesStart());
  return uploadMediaFilesRequest(files, bucketName, path)
    .then((response) => dispatch(uploadMediaFilesSuccess(response.data)))
    .catch((error) => dispatch(setErrorAction(error)));
};
