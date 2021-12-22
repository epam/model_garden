import { getRequest, BE_HOST_PORT } from './api.service';
import { IMediaAssets } from '../models';

export const getMediaAssetsRequest = ({ datasetId }: any) =>
  getRequest<{ results: IMediaAssets[] }>(`${BE_HOST_PORT}/api/media-assets/?dataset_id=${datasetId}`);
