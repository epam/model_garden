import { Bucket, Dataset, MediaAssets } from '../../models';

export interface DataState {
  buckets: Bucket[];
  datasets: Dataset[];
  mediaAssets: MediaAssets[];
}
