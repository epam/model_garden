import {
  ADD_EXISTING_DATASET_START,
  ADD_EXISTING_DATASET_SUCCESS,
  MediaActionTypes,
  SET_MEDIA_FILES,
  UPLOAD_MEDIA_FILES_START,
  UPLOAD_MEDIA_FILES_SUCCESS,
} from "./types";

export interface MediaState {
  addedMediaAssets?: number;
  addingExistingDataSet: boolean;
  isUploading: boolean;
  mediaFiles: File[];
  batchName: string;
}

const initialState: MediaState = {
  addedMediaAssets: undefined,
  addingExistingDataSet: false,
  isUploading: false,
  mediaFiles: [],
  batchName: ''
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
        batchName: action.batchName
      }
    case ADD_EXISTING_DATASET_START:
      return {
        ...state,
        addingExistingDataSet: true
      }
    case ADD_EXISTING_DATASET_SUCCESS:
      return {
        ...state,
        addingExistingDataSet: false,
        addedMediaAssets: action.addedDataSets
      }
    default:
      return state;
  }
};
