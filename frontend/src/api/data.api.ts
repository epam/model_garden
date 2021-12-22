import { getRequest, postRequest, BE_HOST_PORT } from './api.service';
import { IDatasetsResponse, IBucketsResponse, LabelingToolUser } from '../models';

export const getBucketsRequest = () => getRequest<IBucketsResponse>(`${BE_HOST_PORT}/api/buckets/`);

export const getDatasetsRequest = (bucket_id: string) =>
  getRequest<IDatasetsResponse>(`${BE_HOST_PORT}/api/datasets/`, { params: { bucket_id } });

export const getLabelingToolUsersRequest = () =>
  getRequest<LabelingToolUser[]>(`${BE_HOST_PORT}/api/cvat-users/`, {
    timeout: 4000,
    timeoutErrorMessage: 'Error getting users. Please confirm you are connected to VPN'
  });

export const deleteDatasetRequest = ({ datasetId: id }: any) =>
  postRequest(`${BE_HOST_PORT}/api/datasets/delete/`, { id });
