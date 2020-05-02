import {
  MediaActionTypes,
  SET_MEDIA_FILES,
  UPLOAD_MEDIA_FILES_START,
  UPLOAD_MEDIA_FILES_SUCCESS,
} from "./types";

export interface MediaState {
  isUploading: boolean;
  mediaFiles: File[];
  butchName: string;
}

const initialState: MediaState = {
  isUploading: false,
  mediaFiles: [],
  butchName: ''
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
    default:
      return state;
  }
};
