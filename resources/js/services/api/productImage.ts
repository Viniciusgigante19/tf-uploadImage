import { baseAxios } from "../axiosApi";

export type ProductImageResponse = {
  path: string;
};

export default async function getProductImageApi(
  productId: number | string
): Promise<ProductImageResponse | { error: string }> {
  try {
    const { data } = await baseAxios.get<ProductImageResponse>(
      `/api/products/${productId}/getImage`
    );
    return data;
  } catch (err: any) {
    return { error: err?.response?.data?.error || err.message || "Erro ao buscar imagem" };
  }
}
