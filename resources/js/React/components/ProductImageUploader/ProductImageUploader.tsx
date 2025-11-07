// resources/js/React/components/ProductImageUploader/ProductImageUploader.tsx

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  ChangeEvent,
} from "react";

import uploadImageApi from "@app/js/services/api/uploadImageApi";

type ProductModel = {
  id: string | number;
};

export type ProductImageUploaderRef = {
  enabled: () => void;
  disabled: () => void;
};

type Props = {
  productModel: ProductModel;
  fileFieldName?: string;
};

const ProductImageUploader = forwardRef<ProductImageUploaderRef, Props>(
  ({ productModel, fileFieldName = "image" }, ref) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => ({
      enabled: () => setIsDisabled(false),
      disabled: () => setIsDisabled(true),
    }));

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      setSuccessMessage(null);
      setErrorMessage(null);
      const files = e.target.files;
      if (!files || files.length === 0) return;
      await uploadFile(files[0]);
    };

    const uploadFile = async (file: File) => {
      if (isDisabled) {
        setErrorMessage("Upload está desabilitado.");
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const data = await uploadImageApi(productModel.id, file, fileFieldName);

        if ("error" in data) {
          throw new Error(data.error);
        }

        setSuccessMessage("Upload realizado com sucesso.");
      } catch (err: any) {
        setErrorMessage(err?.message || "Erro no upload.");
      } finally {
        setIsLoading(false);
      }
    };

    const handleManualUploadClick = async () => {
      if (!inputRef.current?.files?.length) {
        setErrorMessage("Selecione um arquivo antes de enviar.");
        return;
      }
      await uploadFile(inputRef.current.files[0]);
    };

    return (
      <div className="product-image-uploader">
        {isDisabled && (
          <div className="alert alert-warning">Upload desabilitado.</div>
        )}

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <div className="mb-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
            disabled={isDisabled || isLoading}
          />
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleManualUploadClick}
            disabled={isDisabled || isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Enviando...
              </>
            ) : (
              "Enviar"
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (inputRef.current) inputRef.current.value = "";
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            disabled={isLoading}
          >
            Limpar
          </button>
        </div>
      </div>
    );
  }
);

ProductImageUploader.displayName = "ProductImageUploader";

export default ProductImageUploader;
