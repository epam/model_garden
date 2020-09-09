export interface IMediaState {
  addedMediaAssets?: number;
  batchName: string;
}

export interface IUploadFiles {
  files: File[];
  bucketId: string;
  path: string;
  format: string;
}

export interface IAddExistingDataset {
  bucketId: string;
  path: string;
  format: string;
}
