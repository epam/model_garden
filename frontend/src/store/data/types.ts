import { Bucket, Dataset } from '../../models';

export interface DataState {
  buckets: Bucket[];
  datasets: Dataset[];
  labelingTasks: any;
  mediaAssets: any;
}
