export interface IFilePreview extends File {
  preview: string;
}

export interface IMediaState {
  imported: number;
  batchName: string;
}

export interface IUploadFiles extends IAddExistingDataset {
  files: IFilePreview[];
}

export interface IAddExistingDataset {
  bucketId: string;
  path: string;
  format: string;
}
