export type Base64 = ArrayBuffer | string | null;

export const fromFileToBase64 = (file: File): Promise<Base64> =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (): void => resolve(fileReader.result);
    fileReader.onerror = (error): void => reject(error);
    fileReader.readAsDataURL(file);
  });
