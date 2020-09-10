import { IBucket, IDataset, LabelingToolUser } from '../../models';

export interface IDataState {
  buckets: IBucket[];
  datasets: IDataset[];
  labelingToolUsers: LabelingToolUser[];
}
