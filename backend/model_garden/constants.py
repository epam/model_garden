class AnnotationsFormat:
    PASCAL_VOB_ZIP_1_1 = 'PASCAL VOC ZIP 1.1'
    YOLO_ZIP_1_1 = 'YOLO ZIP 1.1'


class LabelingTaskStatus:
    ANNOTATION = "annotation"
    VALIDATION = "validation"
    COMPLETED = "completed"
    SAVED = "saved"
    ARCHIVED = "archived"
    FAILED = "failed"


class DatasetFormat:
    PASCAL_VOC = 'VOC'
    YOLO = 'YOLO'


DATASET_FORMATS = {
    DatasetFormat.PASCAL_VOC,
    DatasetFormat.YOLO,
}

IMAGE_EXTENSIONS = {
    'bmp',
    'gif',
    'png',
    'jpe',
    'jpeg',
    'jpg',
    'jfif',
    'svg',
    'tif',
    'tiff',
}
