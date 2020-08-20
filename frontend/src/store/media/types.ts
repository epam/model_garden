export interface MediaState {
  addedMediaAssets?: number;
  batchName: string;
}

export interface UploadFiles {
  files: File[];
  bucketId: string;
  path: string;
  format: string;
}

export interface AddExistingDataset {
  bucketId: string;
  path: string;
  format: string;
}
