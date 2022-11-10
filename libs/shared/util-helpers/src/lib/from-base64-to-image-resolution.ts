import { Base64 } from './from-file-to-base64';

export interface ImageResolution {
  width: number;
  height: number;
}

export const fromBase64ToImageResolution = (
  base64: Base64
): Promise<ImageResolution> =>
  new Promise((resolve) => {
    const image: HTMLImageElement = new Image();

    image.onload = (): void => {
      const { width, height } = image;

      return resolve({
        width,
        height,
      });
    };

    image.src = base64 as string;
  });
