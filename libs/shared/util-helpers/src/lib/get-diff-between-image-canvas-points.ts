import {
  ImageCanvasPoint,
  ImageCanvasPointRecord,
} from './get-image-canvas-points';

export interface DiffBetweenImageCanvasPointsInputs {
  originalPoints: ImageCanvasPointRecord;
  changedPoints: ImageCanvasPointRecord;
}

export interface DiffBetweenImageCanvasPointsOptions {
  inRGB: number;
  inPercent?: number;
}

const defaultOptions: DiffBetweenImageCanvasPointsOptions = {
  inRGB: 0,
};

export interface DiffBetweenImageCanvasPoints {
  keys: string[];
  diffs: DiffBetweenImageCanvasPointsDiff[];
}

export interface DiffBetweenImageCanvasPointsDiff {
  originalPoint: ImageCanvasPoint;
  changedPoint: ImageCanvasPoint;
}

export const getDiffBetweenImageCanvasPoints = (
  { originalPoints, changedPoints }: DiffBetweenImageCanvasPointsInputs,
  options: Partial<DiffBetweenImageCanvasPointsOptions> = {}
): DiffBetweenImageCanvasPoints => {
  const mergedOptions: DiffBetweenImageCanvasPointsOptions = {
    ...defaultOptions,
    ...options,
  };

  let { inRGB } = mergedOptions;

  const { inPercent } = mergedOptions;

  if (!isNaN(Number(inPercent))) {
    inRGB = Math.ceil(255 * (inPercent as number));
  }

  const keys = Object.keys(originalPoints).filter((key) => {
    const originalImageCanvasPoint = originalPoints[key];
    const changedImageCanvasPoint = changedPoints[key];

    if (!originalImageCanvasPoint || !changedImageCanvasPoint) {
      return false;
    }

    const rDiff = Math.abs(
      originalImageCanvasPoint.r - changedImageCanvasPoint.r
    );

    const gDiff = Math.abs(
      originalImageCanvasPoint.g - changedImageCanvasPoint.g
    );

    const bDiff = Math.abs(
      originalImageCanvasPoint.b - changedImageCanvasPoint.b
    );

    if (inRGB === 0) {
      return rDiff > inRGB || gDiff > inRGB || bDiff > inRGB;
    }

    return rDiff >= inRGB || gDiff >= inRGB || bDiff >= inRGB;
  });

  const diffs: DiffBetweenImageCanvasPointsDiff[] = keys.map((key) => {
    return {
      originalPoint: originalPoints[key] as ImageCanvasPoint,
      changedPoint: changedPoints[key] as ImageCanvasPoint,
    };
  });

  return {
    keys,
    diffs,
  };
};
