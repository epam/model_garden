import { Bucket, Dataset, LabelingToolUser } from '../../models';

export interface IDataState {
  buckets: Bucket[];
  datasets: Dataset[];
  labelingToolUsers: LabelingToolUser[];
}
