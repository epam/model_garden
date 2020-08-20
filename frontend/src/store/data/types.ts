import { Bucket, Dataset, LabelingToolUser } from '../../models';

export interface DataState {
  buckets: Bucket[];
  datasets: Dataset[];
  labelingToolUsers: LabelingToolUser[];
}
