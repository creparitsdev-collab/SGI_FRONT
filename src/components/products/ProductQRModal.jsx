import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Spinner,
  useDraggable,
} from "@heroui/react";
import { useRef, useState, useEffect } from "react";
import { CloseButton } from "../CloseButton";
import { QrCodeFilled, ArrowDownloadFilled } from "@fluentui/react-icons";
import { getProductByQrHash, getQrCodeImage } from "../../service/product";
import { formatDateLiteral, formatFriendlyDate } from "../../js/utils";

export const ProductQRModal = ({ isOpen, onOpenChange, product }) => {
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  const [qrImage, setQrImage] = useState(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  const [productDetail, setProductDetail] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  useEffect(() => {
    if (product?.qrHash && isOpen) {
      loadQrImage();
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setProductDetail(product ?? null);
    }
  }, [isOpen, product]);

  useEffect(() => {
    let cancelled = false;

    const loadProductDetail = async () => {
      if (!product?.qrHash || !isOpen) return;

      try {
        setIsLoadingProduct(true);
        const response = await getProductByQrHash(product.qrHash);

        const data = response?.data ?? response;
        if (!cancelled && data) {
          setProductDetail(data);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        if (!cancelled) setIsLoadingProduct(false);
      }
    };

    loadProductDetail();
    return () => {
      cancelled = true;
    };
  }, [isOpen, product?.qrHash]);

  const loadQrImage = async () => {
    try {
      setIsLoadingQr(true);
      const imageBlob = await getQrCodeImage(product.qrHash);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrImage(reader.result);
      };
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      console.error("Error loading QR:", error);
    } finally {
      setIsLoadingQr(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrImage || !product) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `QR_${product.lote}_${"producto"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const data = productDetail ?? product;

  const formatExtraLabel = (key) => {
    const map = {
      id: "ID",
      nombre: "Nombre",
      lote: "Lote",
      loteProveedor: "Lote Proveedor",
      stockCatalogueId: "ID Catálogo",
      stockCatalogueName: "Catálogo",
      productStatusId: "ID Estado",
      productStatusName: "Estado",
      unitOfMeasurementId: "ID Unidad",
      unitOfMeasurementName: "Unidad",
      unitOfMeasurementCode: "Código Unidad",
      warehouseTypeId: "ID Tipo Almacén",
      warehouseTypeName: "Tipo Almacén",
      codigoProducto: "Código Producto",
      codigo: "Código",
      numeroAnalisis: "N° Análisis",
      fecha: "Fecha Ingreso",
      fechaIngreso: "Fecha Ingreso",
      caducidad: "Fecha Caducidad",
      fechaCaducidad: "Fecha Caducidad",
      reanalisis: "Fecha Reanálisis",
      muestreo: "Fecha muestreo",
      fechaMuestreo: "Fecha muestreo",
      cantidadTotal: "Cantidad Total",
      numeroContenedores: "N° Contenedores",
      fabricante: "Fabricante",
      distribuidor: "Distribuidor",
      qrHash: "Hash QR",
      createdAt: "Fecha Creación",
      updatedAt: "Fecha Actualización",
      createdByUserName: "Creado por",
      productStatusDescription: "Descripción del estado",
      warehouseTypeCode: "Código tipo almacén",
      stockCatalogueSku: "SKU del catálogo",
      qrCodeId: "ID Código QR",
    };

    if (map[key]) return map[key];

    return String(key)
      .replace(/_/g, " ")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^./, (c) => c.toUpperCase());
  };

  const formatExtraValue = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const excludedExtraKeys = new Set([
    "n",
    "pageIndex",
    "qrImage",
    "__proto__",
    "constructor",
    "prototype",
    "createdByUserId",
    "descuentos",
  ]);

  const renderedKeys = new Set([
    "id",
    "nombre",
    "lote",
    "loteProveedor",
    "stockCatalogueId",
    "stockCatalogueName",
    "productStatusId",
    "productStatusName",
    "unitOfMeasurementId",
    "unitOfMeasurementName",
    "unitOfMeasurementCode",
    "warehouseTypeId",
    "warehouseTypeName",
    "codigoProducto",
    "numeroAnalisis",
    "fecha",
    "fechaIngreso",
    "caducidad",
    "fechaCaducidad",
    "reanalisis",
    "muestreo",
    "fechaMuestreo",
    "cantidadTotal",
    "numeroContenedores",
    "fabricante",
    "distribuidor",
    "qrHash",
    "createdAt",
    "updatedAt",
  ]);

  const extraEntries = Object.entries(data || {})
    .filter(([key]) => !excludedExtraKeys.has(key) && !renderedKeys.has(key))
    .filter(
      ([, value]) => value !== null && value !== undefined && value !== ""
    )
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <Modal
      hideCloseButton
      size="lg"
      radius="lg"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{ backdrop: "bg-black/20" }}
      scrollBehavior="inside"
    >
      <ModalContent className="bg-background">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2 pb-4 pt-4">
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <QrCodeFilled className="size-6 text-primary" />
                  <p className="text-lg font-bold">Código QR</p>
                </div>
                <CloseButton onPress={onClose} />
              </div>
              <p className="text-sm font-normal text-background-500">
                Código QR del producto
              </p>
            </ModalHeader>
            <ModalBody className="no-scrollbar py-6 gap-6">
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="bg-white p-1 rounded-lg shadow-large">
                  {isLoadingQr ? (
                    <div className="w-64 h-64 flex items-center justify-center">
                      <Spinner color="primary" size="lg" />
                    </div>
                  ) : qrImage ? (
                    <img src={qrImage} alt="QR Code" className="w-64 h-64" />
                  ) : (
                    <div className="w-64 h-64 flex flex-col items-center justify-center bg-background-100 rounded-lg">
                      <QrCodeFilled className="size-16 text-background-500" />
                      <p className="text-background-500 mt-4">No disponible</p>
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col gap-2 bg-background-100 p-4 rounded-lg">
                  {isLoadingProduct && (
                    <div className="flex items-center justify-center gap-2 pb-1">
                      <Spinner color="primary" size="sm" />
                      <p className="text-sm text-[#c3c3c3]">
                        Cargando datos del producto...
                      </p>
                    </div>
                  )}
                  {data?.id != null && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] flex-shrink-0 w-40">
                        ID:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.id}
                      </p>
                    </div>
                  )}
                  {data?.nombre && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] flex-shrink-0 w-40">
                        Nombre:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.nombre}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <p className="text-sm text-[#c3c3c3] flex-shrink-0 w-40">
                      Lote:
                    </p>
                    <p className="text-sm font-medium break-all text-right">
                      {data?.lote}
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p className="text-sm text-[#c3c3c3] flex-shrink-0 w-40">
                      Lote proveedor:
                    </p>
                    <p className="text-sm font-medium break-all text-right">
                      {data?.loteProveedor}
                    </p>
                  </div>
                  {data?.stockCatalogueName && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">Catálogo:</p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.stockCatalogueName}
                      </p>
                    </div>
                  )}
                  {data?.productStatusName && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">Estado:</p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.productStatusName}
                      </p>
                    </div>
                  )}
                  {data?.unitOfMeasurementName && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">Unidad:</p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.unitOfMeasurementName}
                        {data.unitOfMeasurementCode
                          ? ` (${data.unitOfMeasurementCode})`
                          : ""}
                      </p>
                    </div>
                  )}
                  {data?.warehouseTypeName && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">
                        Tipo almacén:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.warehouseTypeName}
                      </p>
                    </div>
                  )}

                  {data?.codigoProducto && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">
                        Código producto:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.codigoProducto}
                      </p>
                    </div>
                  )}

                  {data?.numeroAnalisis && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">
                        N° Análisis:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.numeroAnalisis}
                      </p>
                    </div>
                  )}

                  {(data?.fecha || data?.fechaIngreso) && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">
                        Fecha ingreso:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {formatFriendlyDate(data?.fecha ?? data?.fechaIngreso)}
                      </p>
                    </div>
                  )}

                  {(data?.caducidad || data?.fechaCaducidad) && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">
                        Fecha caducidad:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {formatFriendlyDate(
                          data?.caducidad ?? data?.fechaCaducidad
                        )}
                      </p>
                    </div>
                  )}

                  {data?.reanalisis && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">
                        Fecha reanálisis:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {formatFriendlyDate(data.reanalisis)}
                      </p>
                    </div>
                  )}
                  {(data?.muestreo || data?.fechaMuestreo) && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">
                        Fecha muestreo:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {formatFriendlyDate(
                          data?.muestreo ?? data?.fechaMuestreo
                        )}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <p className="text-sm text-[#c3c3c3] w-40">
                      Cantidad Total:
                    </p>
                    <p className="text-sm font-medium break-all text-right">
                      {data?.cantidadTotal}
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p className="text-sm text-[#c3c3c3] w-40">
                      N° Contenedores:
                    </p>
                    <p className="text-sm font-medium break-all text-right">
                      {data?.numeroContenedores}
                    </p>
                  </div>
                  {data?.fabricante && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">Fabricante:</p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.fabricante}
                      </p>
                    </div>
                  )}
                  {data?.distribuidor && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">
                        Distribuidor:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.distribuidor}
                      </p>
                    </div>
                  )}
                  {data?.qrHash && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">Hash QR:</p>
                      <p className="text-sm font-medium break-all text-right">
                        {data.qrHash}
                      </p>
                    </div>
                  )}
                  {data?.createdAt && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">
                        Fecha creación:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {formatDateLiteral(data.createdAt, true)}
                      </p>
                    </div>
                  )}
                  {data?.updatedAt && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-[#c3c3c3] w-40">
                        Fecha actualización:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {formatDateLiteral(data.updatedAt, true)}
                      </p>
                    </div>
                  )}

                  {extraEntries.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {extraEntries.map(([key, value]) => (
                        <div key={key} className="flex justify-between gap-4">
                          <p className="text-sm text-[#c3c3c3] flex-shrink-0 w-40">
                            {formatExtraLabel(key)}:
                          </p>
                          <p className="text-sm font-medium break-all text-right">
                            {formatExtraValue(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="pt-0 pb-6 px-6">
              <Button
                className="w-full tracking-wide font-medium data-[hover=true]:-translate-y-1"
                radius="sm"
                variant="shadow"
                color="primary"
                startContent={<ArrowDownloadFilled className="size-5" />}
                onPress={handleDownloadQr}
                isDisabled={isLoadingQr || !qrImage}
              >
                Descargar código QR
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
