import { connect as connectState } from 'react-redux';
import { Bucket, Dataset } from '../../models';
import {
  getDatasets,
  getLabelingToolUsers,
  getUnsignedImagesCount,
  createLabelingTask
} from '../../store/labelingTask';
import { AppState } from '../../store';

export const mapStateToProps = ({ data: { buckets }, labelingTask }: AppState) => ({
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
export interface LabelingProps {
  buckets: Bucket[];
  datasets: Dataset[];
  currentBucketId: string;
  currentDatasetId: string;
  newTask: any;
  users: any;
  unsignedImagesCount: any;
  getLabelingToolUsers: any;
  getUnsignedImagesCount: any;
  createLabelingTask: any;
  getDatasets: any;
}

export const connect = connectState(mapStateToProps, actions);
