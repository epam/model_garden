import qs from 'qs';
import { getRequest, patchRequest, BE_HOST_PORT } from './api.service';
import { ILabelingTasksResponse } from '../models';

export const getLabelingTasksRequest = (params: Object) =>
  getRequest<ILabelingTasksResponse>(`${BE_HOST_PORT}/api/labeling-tasks/`, {
    params,
    paramsSerializer: (serializerParams: any) => {
      return qs.stringify(serializerParams, { arrayFormat: 'repeat' });
    }
  });

export const archiveTaskLabelingRequest = (taskIds: Array<number>) =>
  patchRequest(`${BE_HOST_PORT}/api/labeling-tasks/archive/`, { id: taskIds });

export const retryLabelingTaskRequest = (id: Array<number>) =>
  patchRequest(`${BE_HOST_PORT}/api/labeling-tasks/retry/`, { id });
