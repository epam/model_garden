class AnnotationsFormat:
    PASCAL_VOB_ZIP_1_1 = 'PASCAL VOC ZIP 1.1'


class LabelingTaskStatus:
    ANNOTATION = "annotation"
    VALIDATION = "validation"
    COMPLETED = "completed"
    SAVED = "saved"
    ARCHIVED = "archived"
    FAILED = "failed"


class DatasetFormat:
    PASCAL_VOC = 'PASCAL_VOC'


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
