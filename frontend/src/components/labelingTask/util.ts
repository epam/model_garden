import { Bucket, Dataset, LabelingToolUser } from '../../models';

export interface LabelingProps {
  buckets: Bucket[];
  datasets: Dataset[];
  users: LabelingToolUser[];
  filesCount: number;
  getUnsignedImagesCount: any;
  createLabelingTask: any;
  getDatasets: any;
}
