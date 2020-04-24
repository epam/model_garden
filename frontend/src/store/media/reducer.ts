import {
  MediaActionTypes,
  SET_MEDIA_FILES,
  UPLOAD_MEDIA_FILES_START,
  UPLOAD_MEDIA_FILES_SUCCESS,
  UPLOAD_MEDIA_FILES_ERROR,
} from "./types";

export interface MediaState {
  isUploading: boolean;
  mediaFiles: File[];
  butchName: string;
  uploadingErrorMessage: string;
}

const initialState: MediaState = {
  isUploading: false,
  mediaFiles: [],
  butchName: '',
  uploadingErrorMessage: '',
};

export const mediaReducer = (
  state: MediaState = initialState,
  action: MediaActionTypes
): MediaState => {
  switch (action.type) {
    case SET_MEDIA_FILES:
      return {
        ...state,
        mediaFiles: action.mediaFiles
      }
    case UPLOAD_MEDIA_FILES_START:
      return {
        ...state,
        isUploading: true
      }
    case UPLOAD_MEDIA_FILES_SUCCESS:
      return {
        ...state,
        isUploading: false,
        butchName: action.butchName
      }
    case UPLOAD_MEDIA_FILES_ERROR:
      return {
        ...state,
        isUploading: false,
        uploadingErrorMessage: action.error
      }
    default:
      return state;
  }
};
