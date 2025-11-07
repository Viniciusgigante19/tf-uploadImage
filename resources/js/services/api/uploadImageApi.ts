import { baseAxios } from "../axiosApi";

export type UploadImageResponse = {
  image: string;
};

export default async function uploadImageApi(
  productId: number | string,
  file: File,
  fileFieldName: string = "image"
): Promise<UploadImageResponse | { error: string }> {
  try {
    const formData = new FormData();
    formData.append(fileFieldName, file);

    const { data } = await baseAxios.post<UploadImageResponse>(
      `/api/products/${productId}/image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (err: any) {
    return { error: err?.response?.data?.message || err.message || "Erro no upload" };
  }
}
