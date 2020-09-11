export const isArchive = (file: any): boolean =>
  file.type === 'application/zip' || file.type === 'application/x-zip-compressed';

export const accept = `
image/bmp,
image/gif,
image/png,
image/jpeg,
image/svg,
image/tiff,
application/zip,
application/x-zip-compressed`;

export interface IDropZoneProps {
  setFiles?: Function;
  onDrop?: Function;
}
