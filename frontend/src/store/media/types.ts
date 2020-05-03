export const SET_MEDIA_FILES = 'SET_MEDIA_FILES';

export const UPLOAD_MEDIA_FILES_START = 'UPLOAD_MEDIA_FILES_START';
export const UPLOAD_MEDIA_FILES_SUCCESS = 'UPLOAD_MEDIA_FILES_SUCCESS';
export interface setMediaFiles {
  type: typeof SET_MEDIA_FILES;
  mediaFiles: File[];
}

export interface uploadMediaStart {
  type: typeof UPLOAD_MEDIA_FILES_START;
}

export interface uploadMediaSuccess {
  type: typeof UPLOAD_MEDIA_FILES_SUCCESS;
  butchName: string;
}

export type MediaActionTypes =
  | setMediaFiles
  | uploadMediaStart
  | uploadMediaSuccess;
  