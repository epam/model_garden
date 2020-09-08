import tempfile
from zipfile import ZipFile


class ZipFileCreationFactory:

    @staticmethod
    def get_empty_zip_file():
        with tempfile.NamedTemporaryFile(mode="w+b", delete=True) as temporaryFile:
            with ZipFile(temporaryFile, 'w') as zipFile:
                zipFile.writestr("annotations/", "")
            temporaryFile.seek(0)
            file_content = temporaryFile.read()
            zipFile.close()
        return file_content
