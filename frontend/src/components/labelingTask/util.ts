import {
  getDatasets,
  getLabelingToolUsers,
  getUnsignedImagesCount,
  createLabelingTask
} from '../../store/labelingTask';
import { AppState } from '../../store';

export const mstp = ({ main: { buckets }, labelingTask }: AppState) => ({
  buckets,
  currentBucketId: labelingTask.currentBucketId,
  datasets: labelingTask.datasets,
  currentDatasetId: labelingTask.currentDatasetId,
  users: labelingTask.labelingToolUsers,
  unsignedImagesCount: labelingTask.unsignedImagesCount,
  newTask: labelingTask.newTask
});

export const actions = {
  getDatasets,
  getLabelingToolUsers,
  getUnsignedImagesCount,
  createLabelingTask
};
