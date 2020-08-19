import { Bucket, Dataset } from '../../models';

export interface LabelingProps {
  buckets: Bucket[];
  datasets: Dataset[];
  users: any;
  unsignedImagesCount: any;
  getLabelingToolUsers: any;
  getUnsignedImagesCount: any;
  createLabelingTask: any;
  getDatasets: any;
}
