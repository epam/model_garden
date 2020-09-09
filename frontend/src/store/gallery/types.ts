import { ILabelingTaskStatus, IMediaAssets } from '../../models';

export interface IGalleryState {
  tasks: ILabelingTaskStatus[];
  mediaAssets: IMediaAssets[];
}
