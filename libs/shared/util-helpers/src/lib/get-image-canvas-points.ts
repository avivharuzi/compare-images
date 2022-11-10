import { Base64 } from './from-file-to-base64';

export interface ImageCanvasPoint {
  x: number;
  y: number;
  position: string;
  r: number;
  g: number;
  b: number;
  a: number;
  rgb: string;
  rgba: string;
}

export type ImageCanvasPointRecord = Record<string, ImageCanvasPoint>;

export const getImageCanvasPoints = (
  base64: Base64
): Promise<ImageCanvasPointRecord> =>
  new Promise((resolve) => {
    const image: HTMLImageElement = new Image();

    image.onload = (): void => {
      const { width, height } = image;
      const canvas = document.createElement('canvas');

      canvas.width = width;
      canvas.height = height;

      const canvasContext = canvas.getContext('2d', {
        willReadFrequently: true,
      });

      if (!canvasContext) {
        throw Error('There was a problem to get canvas 2d context');
      }

      canvasContext.drawImage(image, 0, 0);

      const imageData = canvasContext.getImageData(0, 0, width, height);
      const { data } = imageData;
      const canvasPoints: ImageCanvasPointRecord = {};

      for (let index = 0; index < data.length; index += 4) {
        const indexPosition = index / 4;
        const indexWidth = indexPosition % width;
        const indexHeight = Math.floor(indexPosition / width);
        const position = `${indexWidth}x${indexHeight}`;
        const rr = data[index] as number;
        const gg = data[index + 1] as number;
        const bb = data[index + 2] as number;
        const aa = data[index + 3] as number;

        canvasPoints[position] = {
          x: indexWidth,
          y: indexHeight,
          position,
          r: rr,
          g: gg,
          b: bb,
          a: aa,
          rgb: `rgb(${rr}, ${gg}, ${bb})`,
          rgba: `rgba(${rr}, ${gg}, ${bb}, ${aa})`,
        };
      }

      canvas.remove();
      resolve(canvasPoints);
    };

    image.src = base64 as string;
  });
