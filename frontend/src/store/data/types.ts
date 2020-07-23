import { Bucket, Dataset, MediaAssets, LabelingToolUser } from '../../models';

export interface DataState {
  buckets: Bucket[];
  datasets: Dataset[];
  mediaAssets: MediaAssets[];
  labelingToolUsers: LabelingToolUser[];
}
