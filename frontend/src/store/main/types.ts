import { Bucket } from '../../models';

export interface MainState {
  isBucketsLoading: boolean;
  buckets: Bucket[];
}
