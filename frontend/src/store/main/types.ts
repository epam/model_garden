import { Bucket } from '../../models';

export const GET_BUCKETS_START = 'GET_BUCKETS_START';
export const GET_BUCKETS_SUCCESS = 'GET_BUCKETS_SUCCESS';

export interface getBucketsStart {
  type: typeof GET_BUCKETS_START;
}

export interface getBucketsSuccess {
  type: typeof GET_BUCKETS_SUCCESS;
  buckets: Bucket[];
}

export type MainActionTypes = getBucketsStart | getBucketsSuccess;
