export interface MediaState {
  addedMediaAssets?: number;
  addingExistingDataSet: boolean;
  batchName: string;
  photos: [{}?];
}

export interface UploadFiles {
  files: File[];
  bucketId: string;
  path: string;
}

export interface AddExistingDataset {
  bucketId: string;
  path: string;
}

export const initialState: MediaState = {
  addedMediaAssets: undefined,
  addingExistingDataSet: false,
  batchName: '',
  photos: []
};
