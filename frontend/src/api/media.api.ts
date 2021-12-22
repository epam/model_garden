import { BE_HOST_PORT, postRequest } from './api.service';
import { IUploadFiles, IAddExistingDataset, IFilePreview } from '../store/media/types';

interface IUploadResponse {
  message: string;
}

interface IAddExistingDataResponse {
  imported: number;
}

type RequestData = IUploadFiles | IAddExistingDataset;

const getUrl = (path: string) => `${BE_HOST_PORT}/api/media-assets/${path}/`;

const getFormData = (data: RequestData): FormData => {
  const formData = new FormData();
  formData.append('bucketId', data.bucketId);
  formData.append('path', data.path);
  formData.append('dataset_format', data.format);

  if ((data as IUploadFiles).files) {
    (data as IUploadFiles).files.forEach((file: IFilePreview) => {
      formData.append('file', file);
    });
  }

  return formData;
};

const makeReuest = <IRes, IReq extends RequestData>(path: string) => (data: IReq) =>
  postRequest<IRes>(getUrl(path), getFormData(data), {
    headers: {
      'Content-Type': 'application/zip'
    }
  });

export const uploadMediaFilesRequest = makeReuest<IUploadResponse, IUploadFiles>('upload');
export const addExistingDatasetRequest = makeReuest<IAddExistingDataResponse, IAddExistingDataset>('import-s3');
