import {
  addToast,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDraggable,
} from "@heroui/react";
import { useRef, useState } from "react";
import { CloseButton } from "../CloseButton";
import {
  ArrowHookUpLeftFilled,
  ArrowHookUpRightFilled,
  CheckmarkCircleFilled,
  DismissCircleFilled,
  DismissFilled,
  AddFilled,
  EditFilled,
} from "@fluentui/react-icons";
import { PrimaryButton } from "../PrimaryButton";
import { Tooltip } from "../Tooltip";
import { createProduct, updateProduct } from "../../service/product";

export const ProductsModal = ({
  isOpen,
  onOpenChange,
  data,
  initialData,
  action,
  onRefresh,
  closeDrawer,
}) => {
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  const [showBefore, setShowBefore] = useState(false);
  const description =
    action === "create"
      ? "Una vez registrado, el producto estará disponible en el sistema."
      : "Por favor, verifique que todos los datos sean correctos antes de continuar.";

  const [isLoading, setIsLoading] = useState(false);

  const formatDateShort = (value) => {
    if (!value) return "-";
    const datePart = String(value).slice(0, 10);
    const [year, month, day] = datePart.split("-");
    if (!year || !month || !day) return String(value);

    const months = [
      "ENE",
      "FEB",
      "MAR",
      "ABR",
      "MAY",
      "JUN",
      "JUL",
      "AGO",
      "SEP",
      "OCT",
      "NOV",
      "DIC",
    ];
    const monthIndex = Number(month) - 1;
    const monthText = months[monthIndex] || month;
    return `${day}/${monthText}/${year}`;
  };

  const handleSubmit = async () => {
    const verb = action === "create" ? "registró" : "actualizó";

    try {
      setIsLoading(true);

      const {
        stockCatalogueName,
        productStatusName,
        unitOfMeasurementName,
        unitOfMeasurementCode,
        warehouseTypeName,
        ...rest
      } = data;

      const productData = {
        ...rest,
        stockCatalogueId: parseInt(data.stockCatalogueId),
        productStatusId: parseInt(data.productStatusId),
        unitOfMeasurementId: parseInt(data.unitOfMeasurementId),
        warehouseTypeId: parseInt(data.warehouseTypeId),
        nombre: data.nombre?.trim(),
        lote: data.lote?.trim(),
        loteProveedor: data.loteProveedor?.trim(),
        fabricante: data.fabricante?.trim() || null,
        distribuidor: data.distribuidor?.trim() || null,
        codigoProducto: data.codigoProducto?.trim(),
        numeroAnalisis: data.numeroAnalisis?.trim(),
        fechaIngreso: data.fechaIngreso,
        fechaCaducidad: data.fechaCaducidad,
        reanalisis: data.reanalisis,
        muestreo: data.fechaMuestreo,
        cantidadTotal: parseInt(data.cantidadTotal),
        numeroContenedores: parseInt(data.numeroContenedores),
      };

      const response =
        action === "create"
          ? await createProduct(productData)
          : await updateProduct(productData);

      const success = response.type === "SUCCESS";

      addToast({
        title: success ? `Se ${verb} el producto` : `No se ${verb} el producto`,
        description: success
          ? "El producto está disponible en el sistema."
          : "Ocurrió un error al procesar la solicitud.",
        color: success ? "primary" : "danger",
        icon: success ? (
          <CheckmarkCircleFilled className="size-5" />
        ) : (
          <DismissCircleFilled className="size-5" />
        ),
      });

      if (success) {
        closeDrawer();
        onRefresh();
      }
    } catch (error) {
      addToast({
        title: `No se ${verb} el producto`,
        description:
          error.response?.data?.message ||
          "Ocurrió un error al procesar la solicitud.",
        color: "danger",
        icon: <DismissCircleFilled className="size-5" />,
      });
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  const productDetails = (product) => {
    return (
      <Card
        shadow="none"
        radius="sm"
        className="w-full transition-colors !duration-1000 ease-in-out bg-transparent dark:bg-background-100 shadow-large"
      >
        <CardBody className="pl-4">
          <div className="absolute left-0 inset-y-4 w-1 bg-primary rounded-full"></div>

          <div className="w-full flex flex-col gap-1">
            <div className="w-full flex justify-between">
              <p className="font-semibold break-all line-clamp-2 pr-4">
                Lote: {product.lote}
              </p>
              {action !== "create" && (
                <Tooltip
                  tooltipContent={showBefore ? "Ver después" : "Ver antes"}
                  tooltipPlacement="top"
                >
                  <Button
                    className="bg-transparent"
                    size="sm"
                    radius="sm"
                    isIconOnly
                    onPress={() => setShowBefore(!showBefore)}
                  >
                    {showBefore ? (
                      <ArrowHookUpRightFilled className="size-5" />
                    ) : (
                      <ArrowHookUpLeftFilled className="size-5" />
                    )}
                  </Button>
                </Tooltip>
              )}
            </div>
            {product.stockCatalogueName && (
              <p className="text-sm break-all">
                <span className="font-medium">Catálogo: </span>
                {product.stockCatalogueName}
              </p>
            )}
            {product.productStatusName && (
              <p className="text-sm break-all">
                <span className="font-medium">Estado: </span>
                {product.productStatusName}
              </p>
            )}
            {product.nombre && (
              <p className="text-sm break-all">
                <span className="font-medium">Nombre: </span>
                {product.nombre}
              </p>
            )}
            <p className="text-sm break-all">
              <span className="font-medium">Código de Producto: </span>
              {product.codigoProducto}
            </p>
            <p className="text-sm break-all">
              <span className="font-medium">Lote Proveedor: </span>
              {product.loteProveedor}
            </p>
            {product.fabricante && (
              <p className="text-sm line-clamp-1 break-all">
                <span className="font-medium">Fabricante: </span>
                {product.fabricante}
              </p>
            )}
            {product.distribuidor && (
              <p className="text-sm line-clamp-1 break-all">
                <span className="font-medium">Distribuidor: </span>
                {product.distribuidor}
              </p>
            )}
            <p className="text-sm break-all">
              <span className="font-medium">Fecha de Ingreso: </span>
              {formatDateShort(product.fechaIngreso)}
            </p>
            <p className="text-sm break-all">
              <span className="font-medium">Fecha de Caducidad: </span>
              {formatDateShort(product.fechaCaducidad)}
            </p>
            <p className="text-sm break-all">
              <span className="font-medium">Fecha Reanálisis: </span>
              {formatDateShort(product.reanalisis)}
            </p>
            <p className="text-sm break-all">
              <span className="font-medium">Fecha muestreo: </span>
              {formatDateShort(product.muestreo)}
            </p>
            {product.unitOfMeasurementName && (
              <p className="text-sm break-all">
                <span className="font-medium">Unidad de Medida: </span>
                {product.unitOfMeasurementName}
                {product.unitOfMeasurementCode
                  ? ` (${product.unitOfMeasurementCode})`
                  : ""}
              </p>
            )}
            {product.warehouseTypeName && (
              <p className="text-sm break-all">
                <span className="font-medium">Tipo de Almacén: </span>
                {product.warehouseTypeName}
              </p>
            )}
            <p className="text-sm break-all">
              <span className="font-medium">Cantidad Total: </span>
              {product.cantidadTotal}
            </p>
            <p className="text-sm break-all">
              <span className="font-medium">N° Contenedores: </span>
              {product.numeroContenedores}
            </p>
            <p className="text-sm break-all">
              <span className="font-medium">Número de Análisis: </span>
              {product.numeroAnalisis}
            </p>
            {product.qrHash && (
              <p className="text-sm break-all">
                <span className="font-medium">Hash QR: </span>
                {product.qrHash}
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <Modal
        hideCloseButton
        size="lg"
        radius="lg"
        className="my-0"
        isKeyboardDismissDisabled
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{ wrapper: "overflow-hidden", backdrop: "bg-black/20" }}
        ref={targetRef}
      >
        <ModalContent className="bg-background">
          {(onClose) => (
            <>
              <ModalHeader
                {...moveProps}
                className="flex flex-col gap-2 pb-4 pt-4"
              >
                <div className="w-full flex justify-end">
                  <CloseButton onPress={onClose} />
                </div>
                <p className="text-lg font-bold text-center">
                  ¿Desea {action === "create" ? "registrar" : "actualizar"} el
                  siguiente producto?
                </p>
              </ModalHeader>
              <ModalBody className="py-0 gap-0">
                <p className="text-sm font-normal pb-4 text-center">
                  {description}
                </p>

                {action === "create"
                  ? productDetails(data)
                  : !showBefore
                  ? productDetails(data)
                  : productDetails(initialData)}
              </ModalBody>
              <ModalFooter className="flex justify-center pt-4 pb-8 sm:gap-4 gap-2">
                <Button
                  className="bg-transparent dark:bg-background-100"
                  radius="sm"
                  startContent={<DismissFilled className="size-5" />}
                  onPress={onClose}
                >
                  Cancelar
                </Button>

                <PrimaryButton
                  label={action === "create" ? "Registrar" : "Actualizar"}
                  startContent={
                    action === "create" ? (
                      <AddFilled className="size-5" />
                    ) : (
                      <EditFilled className="size-5" />
                    )
                  }
                  onPress={handleSubmit}
                  isLoading={isLoading}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
