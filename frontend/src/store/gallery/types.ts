import { LabelingTaskStatus, MediaAssets } from '../../models';

export interface GalleryState {
  tasks: LabelingTaskStatus[];
  mediaAssets: MediaAssets[];
}
