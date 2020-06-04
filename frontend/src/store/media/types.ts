export interface MediaState {
  addedMediaAssets?: number;
  addingExistingDataSet: boolean;
  mediaFiles: File[];
  batchName: string;
  photos: [{}?]
}

export interface UploadFiles{
     files: File[];
     bucketId: string; 
     path: string 
}


export interface AddExistingDataset{ bucketId: string; path: string; }
export interface setMediaFiles {
  type: string;
  mediaFiles: File[];
}


export const initialState: MediaState = {
  addedMediaAssets: undefined,
  addingExistingDataSet: false,
  mediaFiles: [],
  batchName: '',
  photos: []
};
