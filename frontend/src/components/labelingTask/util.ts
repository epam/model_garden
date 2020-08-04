import { connect as connectState } from 'react-redux';
import { Bucket, Dataset } from '../../models';
import { getUnsignedImagesCount, createLabelingTask } from '../../store/labelingTask';
import { getDatasets, getLabelingToolUsers } from '../../store/data';
import { AppState } from '../../store';

export const mapStateToProps = ({ labelingTask, data }: AppState) => ({
  buckets: data.buckets,
  datasets: data.datasets,
  users: data.labelingToolUsers,
  unsignedImagesCount: labelingTask.unsignedImagesCount
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
  users: any;
  unsignedImagesCount: any;
  getLabelingToolUsers: any;
  getUnsignedImagesCount: any;
  createLabelingTask: any;
  getDatasets: any;
}

export const connect = connectState(mapStateToProps, actions);
