from io import BytesIO
from zipfile import ZipFile


class ZipFileContentFactory:

    @staticmethod
    def get_zip_file_content(*files):
        file = BytesIO()
        zip_file = ZipFile(file=file, mode='w')
        for file_path, file_content in files:
            zip_file.writestr(file_path, file_content)

        zip_file.close()
        return file.getvalue()

    @staticmethod
    def get_empty_zip_file_content(zip_file_obj, folder_subpathes):
        with ZipFile(zip_file_obj, 'w') as zipFile:
            for folder in folder_subpathes:
                folder_with_slash = folder + "/" if folder[-1] != '/' else folder
                zipFile.writestr(folder_with_slash, "")
        zip_file_obj.seek(0)
        file_content = zip_file_obj.read()
        zipFile.close()

        return file_content
