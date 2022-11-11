export const downloadCanvasAsImage = (
  canvas: HTMLCanvasElement,
  fileName: string
): void => {
  const link = document.createElement('a');

  link.download = fileName;
  link.href = canvas.toDataURL();
  link.click();
  link.remove();
};
