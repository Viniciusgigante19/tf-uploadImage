import ProductImageModel from "../../../../Models/ProductImageModel.js";

export default async function GetProductImageController(request, response) {
  const HTTP_STATUS = CONSTANTS.HTTP;

  const productId = request.params.id;

  try {
    // Pega a primeira imagem do produto (ou todas, se quiser)
    const image = await ProductImageModel.findOne({
      where: { product_id: productId },
      order: [['display_order', 'ASC']]
    });

    if (!image) {
      return response.status(HTTP_STATUS.NOT_FOUND).json({
        error: `Nenhuma imagem encontrada para o produto ${productId}`
      });
    }

    const pathBase = `storage/images/products/`;

    // Retorna o caminho completo mantendo o nome original
    return response.status(HTTP_STATUS.SUCCESS).json({
      path: pathBase + image.relative_path
    });

  } catch (error) {
    return response.status(HTTP_STATUS.SERVER_ERROR).json({
      error: 'Erro de servidor.'
    });
  }
}
