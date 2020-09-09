import { Bucket, Dataset, LabelingToolUser } from '../../../models';

export interface LabelingProps {
  buckets: Bucket[];
  datasets: Dataset[];
  users: LabelingToolUser[];
  filesCount: number;
  getUnsignedImagesCount: any;
  clearUnsignedImagesCount: any;
  createLabelingTask: any;
  getDatasets: any;
  openCreateTaskDialog: boolean;
  setOpenCreateTaskDialog: any;
}

export interface FormData {
  currentDatasetId: string;
  taskName: string;
  user: string | number;
  filesInTask: number;
  countOfTasks: number;
}
