export const SET_MEDIA_FILES = 'SET_MEDIA_FILES';

export const UPLOAD_MEDIA_FILES_TO_S3_START = 'UPLOAD_MEDIA_FILES_TO_S3_START';
export const UPLOAD_MEDIA_FILES_TO_S3_SUCCESS = 'UPLOAD_MEDIA_FILES_TO_S3_SUCCESS';
export const UPLOAD_MEDIA_FILES_TO_S3_ERROR = 'UPLOAD_MEDIA_FILES_TO_S3_ERROR';
export const ADD_EXISTING_DATASET_START = 'ADD_EXISTING_DATASET_START';
export const ADD_EXISTING_DATASET_SUCCESS = 'ADD_EXISTING_DATASET_SUCCESS';

export interface setMediaFiles {
  type: typeof SET_MEDIA_FILES;
  mediaFiles: File[];
}

export interface uploadMediaStart {
  type: typeof UPLOAD_MEDIA_FILES_TO_S3_START;
}

export interface uploadMediaSuccess {
  type: typeof UPLOAD_MEDIA_FILES_TO_S3_SUCCESS;
  batchName: string;
}

export interface uploadMediaError {
  type: typeof UPLOAD_MEDIA_FILES_TO_S3_ERROR;
}

export interface addExistingDatasetStart {
  type: typeof ADD_EXISTING_DATASET_START;
}

export interface addExistingDatasetSuccess {
  type: typeof ADD_EXISTING_DATASET_SUCCESS;
  addedDataSets: number;
}

export type MediaActionTypes =
  | setMediaFiles
  | uploadMediaStart
  | uploadMediaSuccess
  | uploadMediaError
  | addExistingDatasetStart
  | addExistingDatasetSuccess;
  