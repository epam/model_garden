import { ILabelingTaskRequestData } from '../models';
import { BE_HOST_PORT, getRequest, rawPostRequest } from './api.service';

export const getUnsignedImagesCountRequest = (dataset_id: string) =>
  getRequest<{ count: number }>(`${BE_HOST_PORT}/api/media-assets/`, {
    params: {
      dataset_id,
      is_pending: true
    }
  });

export const createLabelingTaskRequest = (taskData: ILabelingTaskRequestData) =>
  rawPostRequest<any>(`${BE_HOST_PORT}/api/labeling-tasks/`, taskData);
