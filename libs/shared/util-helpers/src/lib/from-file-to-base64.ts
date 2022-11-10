export type Base64 = ArrayBuffer | string | null;

export const fromFileToBase64 = (file: File): Promise<Base64> =>
  new Promise((resolve) => {
    const fileReader = new FileReader();

    fileReader.onload = (): void => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });
