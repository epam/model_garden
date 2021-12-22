import convert from 'xml-js';
import { toast } from 'react-toastify';

import { id } from '../../../utils';
import { getLabelData } from '../../../api';
import { PASCAL_VOC, YOLO } from '../../../constants';

class ParsedData {
  constructor(public width: number = 0, public height: number = 0, public boxSizes: BoxCoords[] = []) {}
}

class BoxCoords {
  constructor(public x: number, public y: number, public width: number, public height: number) {}
}

const getLabelFrameCoordinates = (datasetFormat: string, imgWidth: number, imgHeight: number, res?: any) => {
  const defaultParsedData = new ParsedData(imgWidth, imgHeight);

  try {
    if (res) {
      switch (datasetFormat) {
        case YOLO:
          return parseYoloData(res, imgWidth, imgHeight);

        case PASCAL_VOC:
          return parsePascalVocData(res);
      }
    }
  } catch (err) {
    console.error(`Smth went wrong during parsing ${datasetFormat} format.`, err);
  }

  return defaultParsedData;
};

const parseYoloData = (res: any, imgWidth: number, imgHeight: number): ParsedData => {
  const boxData = res.split('\n').filter(id);

  const boxSizes: BoxCoords[] = boxData.map((rawBox: string) => {
    /*
    YOLO: [<object-class> <x> <y> <width> <height>]
    *---------------*
    |               |
    |   *---x---*   |
    |   |       |   |
    |   *       y   |
    |   |       |   |
    |   *---*---*   |
    |               |
    *---------------*
    */
    const data = rawBox.split(' ');
    const width = imgWidth * +data[3];
    const height = imgHeight * +data[4];
    const x = imgWidth * +data[1] - width / 2;
    const y = imgHeight * +data[2] - height / 2;

    return new BoxCoords(x, y, width, height);
  });

  return new ParsedData(imgWidth, imgHeight, boxSizes);
};

const parsePascalVocData = (res: any): ParsedData => {
  const json = JSON.parse(convert.xml2json(res, { compact: true }));
  const { width, height } = json.annotation.size;
  const boxSizes: BoxCoords[] = (Array.isArray(json.object) ? json.object : [json.object]).map((rawBox: any) => {
    const { xmax, xmin, ymax, ymin } = rawBox.bndbox;
    return new BoxCoords(+xmin._text, +ymin._text, +xmax._text - +xmin._text, +ymax._text - +ymin._text);
  });

  return new ParsedData(+width._text, +height._text, boxSizes);
};

const renderCanvas = (canvas: HTMLCanvasElement | null, imgSrc: string, datasetFormat: string, res?: any) => {
  const ctx = canvas && canvas.getContext('2d');
  if (canvas && ctx) {
    const img = new Image();
    img.onload = () => {
      const { width, height, boxSizes } = getLabelFrameCoordinates(
        datasetFormat,
        img.naturalWidth,
        img.naturalHeight,
        res
      );

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      ctx.strokeStyle = 'red';
      ctx.lineWidth = width / 150;

      boxSizes.forEach(({ x, y, width, height }) => {
        ctx.strokeRect(x, y, width, height);
      });
    };

    img.src = imgSrc;
  }
};

export const initCanvas = (
  canvas: HTMLCanvasElement | null,
  datasetFormat: string,
  urlForLabelData: string,
  imgSrc: string
) => {
  if (urlForLabelData) {
    getLabelData(urlForLabelData)
      .then((res: any) => {
        renderCanvas(canvas, imgSrc, datasetFormat, res);
      })
      .catch(() => {
        toast.warn('Error drawing boxes, showing image without detection layouts.');
      });
  }

  renderCanvas(canvas, imgSrc, datasetFormat);
};

export const check = (setCheckList: any, fileNameParam: string) => {
  setCheckList((ps: string[]) =>
    ps.filter((x) => ![fileNameParam].includes(x)).concat([fileNameParam].filter((x) => !ps.includes(x)))
  );
};
