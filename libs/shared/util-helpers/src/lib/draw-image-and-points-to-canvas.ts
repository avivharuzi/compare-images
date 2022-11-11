import { fromBase64ToImage } from './from-base64-to-image';
import { Base64 } from './from-file-to-base64';

export interface DrawImageAndPointsToCanvasPoint {
  x: number;
  y: number;
}

export type DrawImageAndPointsToCanvasPoints =
  DrawImageAndPointsToCanvasPoint[];

export interface DrawImageAndPointsToCanvasOptions {
  points: DrawImageAndPointsToCanvasPoints;
  imageOpacity: number;
  fillStyle: string;
}

const defaultOptions: DrawImageAndPointsToCanvasOptions = {
  points: [],
  imageOpacity: 0.25,
  fillStyle: 'rgb(0, 128, 0)',
};

export const drawImageAndPointsToCanvas = async (
  canvas: HTMLCanvasElement,
  base64: Base64,
  options: Partial<DrawImageAndPointsToCanvasOptions> = {}
): Promise<void> => {
  const { points, imageOpacity, fillStyle } = {
    ...defaultOptions,
    ...options,
  };

  const image = await fromBase64ToImage(base64);
  const { width, height } = image;

  canvas.width = width;
  canvas.height = height;

  const canvasContext = canvas.getContext('2d', {
    willReadFrequently: true,
  });

  if (!canvasContext) {
    throw Error('There was a problem to get canvas 2d context');
  }

  canvasContext.globalAlpha = imageOpacity;
  canvasContext.drawImage(image, 0, 0);
  canvasContext.globalAlpha = 1;
  canvasContext.fillStyle = fillStyle;

  points.forEach(({ x, y }) => {
    canvasContext.fillRect(x, y, 1, 1);
  });
};
