import { fromBase64ToImage } from './from-base64-to-image';
import { Base64 } from './from-file-to-base64';

export interface ImageResolution {
  width: number;
  height: number;
}

export const fromBase64ToImageResolution = async (
  base64: Base64
): Promise<ImageResolution> => {
  const { width, height } = await fromBase64ToImage(base64);

  return {
    width,
    height,
  };
};
