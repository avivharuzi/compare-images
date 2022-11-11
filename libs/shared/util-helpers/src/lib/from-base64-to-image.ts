import { Base64 } from './from-file-to-base64';

export const fromBase64ToImage = (base64: Base64): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = (): void => resolve(image);
    image.onerror = (error): void => reject(error);
    image.src = base64 as string;
  });
