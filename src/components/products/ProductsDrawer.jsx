import {
  addToast,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Form,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { CloseButton } from "../CloseButton";
import {
  ArrowHookUpRightFilled,
  CheckmarkFilled,
  ChevronDownFilled,
  DismissCircleFilled,
  DismissFilled,
  TextAsteriskFilled,
} from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { required } from "../../js/validators";
import { ProductsModal } from "./ProductsModal";
import { formatDateLiteral } from "../../js/utils";
import {
  getStockCatalogues,
  getProductStatuses,
  getUnitsOfMeasurement,
  getWarehouseTypes,
} from "../../service/product";

export const ProductsDrawer = ({
  isOpen,
  onOpenChange,
  data,
  action,
  onRefresh,
}) => {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onOpenChange: onModalOpenChange,
  } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [catalogues, setCatalogues] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [units, setUnits] = useState([]);
  const [warehouseTypes, setWarehouseTypes] = useState([]);

  const [product, setProduct] = useState({
    id: data?.id != null ? String(data.id) : "",
    stockCatalogueId:
      data?.stockCatalogueId != null ? String(data.stockCatalogueId) : "",
    stockCatalogueName: data?.stockCatalogueName || "",
    productStatusId:
      data?.productStatusId != null ? String(data.productStatusId) : "",
    productStatusName: data?.productStatusName || "",
    unitOfMeasurementId:
      data?.unitOfMeasurementId != null ? String(data.unitOfMeasurementId) : "",
    unitOfMeasurementName: data?.unitOfMeasurementName || "",
    unitOfMeasurementCode: data?.unitOfMeasurementCode || "",
    warehouseTypeId:
      data?.warehouseTypeId != null ? String(data.warehouseTypeId) : "",
    warehouseTypeName: data?.warehouseTypeName || "",
    nombre: data?.nombre != null ? String(data.nombre) : "",
    lote: data?.lote != null ? String(data.lote) : "",
    loteProveedor:
      data?.loteProveedor != null ? String(data.loteProveedor) : "",
    fabricante: data?.fabricante != null ? String(data.fabricante) : "",
    distribuidor: data?.distribuidor != null ? String(data.distribuidor) : "",
    codigoProducto:
      data?.codigoProducto != null ? String(data.codigoProducto) : "",
    numeroAnalisis:
      data?.numeroAnalisis != null ? String(data.numeroAnalisis) : "",
    fechaIngreso: data?.fecha != null ? String(data.fecha) : "",
    fechaCaducidad: data?.caducidad != null ? String(data.caducidad) : "",
    fechaMuestreo:
      data?.fechaMuestreo != null ? String(data.fechaMuestreo) : "",
    reanalisis: data?.reanalisis != null ? String(data.reanalisis) : "",
    cantidadTotal:
      data?.cantidadTotal != null ? String(data.cantidadTotal) : "",
    numeroContenedores:
      data?.numeroContenedores != null ? String(data.numeroContenedores) : "",
  });

  const [productErrors, setProductErrors] = useState({
    stockCatalogueId: [],
    productStatusId: [],
    unitOfMeasurementId: [],
    warehouseTypeId: [],
    nombre: [],
    lote: [],
    loteProveedor: [],
    fabricante: [],
    distribuidor: [],
    codigoProducto: [],
    numeroAnalisis: [],
    fechaIngreso: [],
    fechaCaducidad: [],
    fechaMuestreo: [],
    reanalisis: [],
    cantidadTotal: [],
    numeroContenedores: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cataloguesRes, statusesRes, unitsRes, warehouseTypesRes] =
          await Promise.all([
            getStockCatalogues(),
            getProductStatuses(),
            getUnitsOfMeasurement(),
            getWarehouseTypes(),
          ]);

        setCatalogues(cataloguesRes?.data || []);
        setStatuses(statusesRes?.data || []);
        setUnits(unitsRes?.data || []);
        setWarehouseTypes(warehouseTypesRes?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    setProduct({
      id: data?.id != null ? String(data.id) : "",
      stockCatalogueId:
        data?.stockCatalogueId != null ? String(data.stockCatalogueId) : "",
      stockCatalogueName: data?.stockCatalogueName || "",
      productStatusId:
        data?.productStatusId != null ? String(data.productStatusId) : "",
      productStatusName: data?.productStatusName || "",
      unitOfMeasurementId:
        data?.unitOfMeasurementId != null
          ? String(data.unitOfMeasurementId)
          : "",
      unitOfMeasurementName: data?.unitOfMeasurementName || "",
      unitOfMeasurementCode: data?.unitOfMeasurementCode || "",
      warehouseTypeId:
        data?.warehouseTypeId != null ? String(data.warehouseTypeId) : "",
      warehouseTypeName: data?.warehouseTypeName || "",
      nombre: data?.nombre != null ? String(data.nombre) : "",
      lote: data?.lote != null ? String(data.lote) : "",
      loteProveedor:
        data?.loteProveedor != null ? String(data.loteProveedor) : "",
      fabricante: data?.fabricante != null ? String(data.fabricante) : "",
      distribuidor: data?.distribuidor != null ? String(data.distribuidor) : "",
      codigoProducto:
        data?.codigoProducto != null ? String(data.codigoProducto) : "",
      numeroAnalisis:
        data?.numeroAnalisis != null ? String(data.numeroAnalisis) : "",
      fechaIngreso: data?.fecha != null ? String(data.fecha) : "",
      fechaCaducidad: data?.caducidad != null ? String(data.caducidad) : "",
      fechaMuestreo:
        data?.fechaMuestreo != null ? String(data.fechaMuestreo) : "",
      reanalisis: data?.reanalisis != null ? String(data.reanalisis) : "",
      cantidadTotal:
        data?.cantidadTotal != null ? String(data.cantidadTotal) : "",
      numeroContenedores:
        data?.numeroContenedores != null ? String(data.numeroContenedores) : "",
    });

    setProductErrors({
      stockCatalogueId: [],
      productStatusId: [],
      unitOfMeasurementId: [],
      warehouseTypeId: [],
      lote: [],
      loteProveedor: [],
      fabricante: [],
      distribuidor: [],
      codigoProducto: [],
      numeroAnalisis: [],
      fechaIngreso: [],
      fechaCaducidad: [],
      fechaMuestreo: [],
      reanalisis: [],
      cantidadTotal: [],
      numeroContenedores: [],
    });
  }, [data, action]);

  const resetForm = () => {
    setProduct({
      id: "",
      stockCatalogueId: "",
      stockCatalogueName: "",
      productStatusId: "",
      productStatusName: "",
      unitOfMeasurementId: "",
      unitOfMeasurementName: "",
      unitOfMeasurementCode: "",
      warehouseTypeId: "",
      warehouseTypeName: "",
      nombre: "",
      lote: "",
      loteProveedor: "",
      fabricante: "",
      distribuidor: "",
      codigoProducto: "",
      numeroAnalisis: "",
      fechaIngreso: "",
      fechaCaducidad: "",
      fechaMuestreo: "",
      reanalisis: "",
      cantidadTotal: "",
      numeroContenedores: "",
    });
    setProductErrors({
      stockCatalogueId: [],
      productStatusId: [],
      unitOfMeasurementId: [],
      warehouseTypeId: [],
      nombre: [],
      lote: [],
      loteProveedor: [],
      fabricante: [],
      distribuidor: [],
      codigoProducto: [],
      numeroAnalisis: [],
      fechaIngreso: [],
      fechaCaducidad: [],
      fechaMuestreo: [],
      reanalisis: [],
      cantidadTotal: [],
      numeroContenedores: [],
    });
  };

  useEffect(() => {
    if (
      !product.stockCatalogueName &&
      product.stockCatalogueId &&
      catalogues.length > 0
    ) {
      const selected = catalogues.find(
        (c) => String(c.id) === String(product.stockCatalogueId)
      );
      if (selected)
        setProduct((prev) => ({ ...prev, stockCatalogueName: selected.name }));
    }
  }, [catalogues, product.stockCatalogueId, product.stockCatalogueName]);

  useEffect(() => {
    if (
      !product.productStatusName &&
      product.productStatusId &&
      statuses.length > 0
    ) {
      const selected = statuses.find(
        (s) => String(s.id) === String(product.productStatusId)
      );
      if (selected)
        setProduct((prev) => ({ ...prev, productStatusName: selected.name }));
    }
  }, [statuses, product.productStatusId, product.productStatusName]);

  useEffect(() => {
    if (
      (!product.unitOfMeasurementName || !product.unitOfMeasurementCode) &&
      product.unitOfMeasurementId &&
      units.length > 0
    ) {
      const selected = units.find(
        (u) => String(u.id) === String(product.unitOfMeasurementId)
      );
      if (selected) {
        setProduct((prev) => ({
          ...prev,
          unitOfMeasurementName: selected.name || prev.unitOfMeasurementName,
          unitOfMeasurementCode: selected.code || prev.unitOfMeasurementCode,
        }));
      }
    }
  }, [
    units,
    product.unitOfMeasurementId,
    product.unitOfMeasurementName,
    product.unitOfMeasurementCode,
  ]);

  useEffect(() => {
    if (
      !product.warehouseTypeName &&
      product.warehouseTypeId &&
      warehouseTypes.length > 0
    ) {
      const selected = warehouseTypes.find(
        (w) => String(w.id) === String(product.warehouseTypeId)
      );
      if (selected)
        setProduct((prev) => ({ ...prev, warehouseTypeName: selected.name }));
    }
  }, [warehouseTypes, product.warehouseTypeId, product.warehouseTypeName]);

  const validators = {
    stockCatalogueId: [required],
    productStatusId: [required],
    unitOfMeasurementId: [required],
    warehouseTypeId: [required],
    nombre: [required],
    lote: [required],
    loteProveedor: [required],
    fabricante: [],
    distribuidor: [],
    codigoProducto: [required],
    numeroAnalisis: [required],
    fechaIngreso: [required],
    fechaCaducidad: [],
    fechaMuestreo: [],
    reanalisis: [],
    cantidadTotal: [required],
    numeroContenedores: [required],
  };

  const runValidators = (value, fns) =>
    fns.map((fn) => fn(value)).filter(Boolean);

  const handleInputChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));

    const fns = validators[field] || [];
    const errs = runValidators(value, fns);

    if (field in validators) {
      setProductErrors((prev) => ({ ...prev, [field]: errs }));
    }
  };

  const formatDateShort = (value) => {
    if (!value) return "";
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

  let title;
  let description;

  switch (action) {
    case "create":
      title = "Registrar producto";
      description =
        "Ingrese la información solicitada para poder registrar un nuevo producto.";
      break;
    case "update":
      title = "Actualizar producto";
      description =
        "Edite la información necesaria y guarde los cambios para actualizar el producto.";
      break;
    default:
      title = "Detalles del producto";
      description =
        "Revise la información completa del producto. Esta vista es solo de lectura.";
      break;
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData =
      action !== "create" ? { id: product.id, ...product } : { ...product };

    const errors = {
      stockCatalogueId: runValidators(
        formData.stockCatalogueId,
        validators.stockCatalogueId
      ),
      productStatusId: runValidators(
        formData.productStatusId,
        validators.productStatusId
      ),
      unitOfMeasurementId: runValidators(
        formData.unitOfMeasurementId,
        validators.unitOfMeasurementId
      ),
      warehouseTypeId: runValidators(
        formData.warehouseTypeId,
        validators.warehouseTypeId
      ),
      nombre: runValidators(formData.nombre, validators.nombre),
      lote: runValidators(formData.lote, validators.lote),
      loteProveedor: runValidators(
        formData.loteProveedor,
        validators.loteProveedor
      ),
      codigoProducto: runValidators(
        formData.codigoProducto,
        validators.codigoProducto
      ),
      numeroAnalisis: runValidators(
        formData.numeroAnalisis,
        validators.numeroAnalisis
      ),
      fechaIngreso: runValidators(
        formData.fechaIngreso,
        validators.fechaIngreso
      ),
      cantidadTotal: runValidators(
        formData.cantidadTotal,
        validators.cantidadTotal
      ),
      numeroContenedores: runValidators(
        formData.numeroContenedores,
        validators.numeroContenedores
      ),
    };

    const hasErrors = Object.values(errors).some((err) => err.length > 0);

    if (hasErrors) {
      setProductErrors({
        ...productErrors,
        ...errors,
      });
      addToast({
        title: "Atención",
        description: "Por favor corrija los errores en el formulario.",
        color: "warning",
        icon: <DismissCircleFilled className="size-5" />,
      });
      return;
    }

    setProductErrors({
      stockCatalogueId: [],
      productStatusId: [],
      unitOfMeasurementId: [],
      warehouseTypeId: [],
      nombre: [],
      lote: [],
      loteProveedor: [],
      fabricante: [],
      distribuidor: [],
      codigoProducto: [],
      numeroAnalisis: [],
      fechaIngreso: [],
      fechaCaducidad: [],
      fechaMuestreo: [],
      reanalisis: [],
      cantidadTotal: [],
      numeroContenedores: [],
    });
    setProduct(formData);
    onModalOpen(true);
  };

  return (
    <>
      <Drawer
        hideCloseButton
        size="sm"
        radius="sm"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{ wrapper: "!h-[100dvh]", backdrop: "bg-black/30" }}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              opacity: 1,
              transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              },
            },
            exit: {
              x: 100,
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <DrawerContent className="bg-background">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-2 pb-8">
                <div className="w-full flex justify-between pt-4 pb-2">
                  <p className="text-lg font-bold">{title}</p>
                  <CloseButton onPress={onClose} />
                </div>
                <p className="text-sm font-normal">{description}</p>
              </DrawerHeader>
              <DrawerBody className="h-full flex flex-col justify-between overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary">
                <Form
                  onSubmit={onSubmit}
                  id="product-form"
                  className={
                    action === "create" || action === "update"
                      ? "gap-6 flex flex-col"
                      : "gap-6 flex flex-col pb-8"
                  }
                >
                  {action !== "create" && data && (
                    <div className="flex flex-col gap-4">
                      <div className="pl-0.5 flex flex-col gap-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            Fecha de creación:{" "}
                          </span>
                          {formatDateLiteral(data.createdAt, true)}
                        </p>
                        {data.qrHash && (
                          <p className="text-sm break-all max-w-full">
                            <span className="font-medium">Hash QR: </span>
                            {data.qrHash}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <Select
                    aria-label="Catálogo"
                    className="w-full -mt-4"
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">Catálogo</p>
                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                      </div>
                    }
                    classNames={{
                      value: "text-background-500 !font-normal",
                      trigger:
                        "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent",
                      popoverContent: "bg-background-100 rounded-lg",
                      selectorIcon: "!text-background-500",
                    }}
                    listboxProps={{
                      itemClasses: {
                        base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                      },
                    }}
                    name="stockCatalogueId"
                    selectionMode="single"
                    disallowEmptySelection
                    selectorIcon={<ChevronDownFilled className="size-5" />}
                    labelPlacement="outside"
                    radius="sm"
                    variant="bordered"
                    placeholder={
                      action === "create"
                        ? "Seleccione un catálogo"
                        : product.stockCatalogueName ||
                          data?.stockCatalogueName ||
                          "Seleccione un catálogo"
                    }
                    selectedKeys={
                      product.stockCatalogueId
                        ? new Set([String(product.stockCatalogueId)])
                        : new Set([])
                    }
                    onSelectionChange={(keys) => {
                      const [first] = Array.from(keys);
                      const selectedCatalogue = catalogues.find(
                        (cat) => String(cat.id) === String(first)
                      );

                      handleInputChange("stockCatalogueId", first);
                      if (selectedCatalogue) {
                        handleInputChange(
                          "stockCatalogueName",
                          selectedCatalogue.name
                        );
                      }
                    }}
                    isDisabled={action !== "create" && action !== "update"}
                    isInvalid={productErrors.stockCatalogueId.length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.stockCatalogueId.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  >
                    {catalogues.map((cat) => (
                      <SelectItem key={String(cat.id)} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    aria-label="Estado del Producto"
                    className="w-full -mt-4"
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">Estado</p>
                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                      </div>
                    }
                    classNames={{
                      value: "text-background-500 !font-normal",
                      trigger:
                        "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent",
                      popoverContent: "bg-background-100 rounded-lg",
                      selectorIcon: "!text-background-500",
                    }}
                    listboxProps={{
                      itemClasses: {
                        base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                      },
                    }}
                    name="productStatusId"
                    selectionMode="single"
                    disallowEmptySelection
                    selectorIcon={<ChevronDownFilled className="size-5" />}
                    labelPlacement="outside"
                    radius="sm"
                    variant="bordered"
                    placeholder={
                      action === "create"
                        ? "Seleccione un estado"
                        : product.productStatusName ||
                          data?.productStatusName ||
                          "Seleccione un estado"
                    }
                    selectedKeys={
                      product.productStatusId
                        ? new Set([String(product.productStatusId)])
                        : new Set([])
                    }
                    onSelectionChange={(keys) => {
                      const [first] = Array.from(keys);
                      const selectedStatus = statuses.find(
                        (status) => String(status.id) === String(first)
                      );

                      handleInputChange("productStatusId", first);
                      if (selectedStatus) {
                        handleInputChange(
                          "productStatusName",
                          selectedStatus.name
                        );
                      }
                    }}
                    isDisabled={action !== "create" && action !== "update"}
                    isInvalid={productErrors.productStatusId.length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.productStatusId.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  >
                    {statuses.map((status) => (
                      <SelectItem
                        key={String(status.id)}
                        value={String(status.id)}
                      >
                        {status.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">Nombre</p>
                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                      </div>
                    }
                    classNames={{
                      label:
                        "font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input:
                        "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal",
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current",
                    }}
                    name="nombre"
                    labelPlacement="outside"
                    type="text"
                    radius="sm"
                    variant="bordered"
                    maxLength={200}
                    isReadOnly={action !== "create" && action !== "update"}
                    placeholder={
                      action === "create" ? "Ingrese el nombre" : data?.nombre
                    }
                    value={product.nombre}
                    onValueChange={(value) =>
                      handleInputChange("nombre", value)
                    }
                    isInvalid={(productErrors.nombre || []).length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {(productErrors.nombre || []).map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />

                  <Input
                    label={
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-sm">Lote</p>
                          <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                        </div>
                        <p className="!text-background-500 text-xs font-normal">
                          {product.lote.length + " / 100"}
                        </p>
                      </div>
                    }
                    classNames={{
                      label:
                        "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input:
                        "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",
                      mainWrapper: "group-data-[invalid=true]:animate-shake",
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current",
                    }}
                    name="lote"
                    labelPlacement="outside"
                    type="text"
                    radius="sm"
                    variant="bordered"
                    maxLength={100}
                    isReadOnly={action !== "create" && action !== "update"}
                    placeholder={
                      action === "create" ? "Ingrese el lote" : data?.lote
                    }
                    value={product.lote}
                    onValueChange={(value) => handleInputChange("lote", value)}
                    isInvalid={productErrors.lote.length > 0}
                    endContent={
                      productErrors.lote.length === 0 && product.lote ? (
                        <CheckmarkFilled className="size-4 text-background-500 group-data-[focus=true]:text-primary" />
                      ) : productErrors.lote.length > 0 ? (
                        <DismissFilled className="size-4 text-danger" />
                      ) : null
                    }
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.lote.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />

                  <Input
                    label={
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-sm">
                            Código de Producto
                          </p>
                          <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                        </div>
                        <p className="!text-background-500 text-xs font-normal">
                          {(product.codigoProducto || "").length + " / 50"}
                        </p>
                      </div>
                    }
                    classNames={{
                      label:
                        "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input:
                        "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",
                      mainWrapper: "group-data-[invalid=true]:animate-shake",
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current",
                    }}
                    name="codigoProducto"
                    labelPlacement="outside"
                    type="text"
                    radius="sm"
                    variant="bordered"
                    maxLength={50}
                    isReadOnly={action !== "create" && action !== "update"}
                    placeholder={
                      action === "create"
                        ? "Ingrese el código de producto"
                        : data?.codigoProducto
                    }
                    value={product.codigoProducto || ""}
                    onValueChange={(value) =>
                      handleInputChange("codigoProducto", value)
                    }
                    isInvalid={productErrors.codigoProducto.length > 0}
                    endContent={
                      productErrors.codigoProducto.length === 0 &&
                      product.codigoProducto ? (
                        <CheckmarkFilled className="size-4 text-background-500 group-data-[focus=true]:text-primary" />
                      ) : productErrors.codigoProducto.length > 0 ? (
                        <DismissFilled className="size-4 text-danger" />
                      ) : null
                    }
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.codigoProducto.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />

                  <Input
                    label={
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-sm">
                            Lote del Proveedor
                          </p>
                          <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                        </div>
                        <p className="!text-background-500 text-xs font-normal">
                          {product.loteProveedor.length + " / 100"}
                        </p>
                      </div>
                    }
                    classNames={{
                      label:
                        "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input:
                        "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal",
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current",
                    }}
                    name="loteProveedor"
                    labelPlacement="outside"
                    type="text"
                    radius="sm"
                    variant="bordered"
                    maxLength={100}
                    isReadOnly={action !== "create" && action !== "update"}
                    placeholder={
                      action === "create"
                        ? "Ingrese el lote del proveedor"
                        : data?.loteProveedor
                    }
                    value={product.loteProveedor}
                    onValueChange={(value) =>
                      handleInputChange("loteProveedor", value)
                    }
                    isInvalid={productErrors.loteProveedor.length > 0}
                    endContent={
                      productErrors.loteProveedor.length === 0 &&
                      product.loteProveedor ? (
                        <CheckmarkFilled className="size-4 text-background-500 group-data-[focus=true]:text-primary" />
                      ) : productErrors.loteProveedor.length > 0 ? (
                        <DismissFilled className="size-4 text-danger" />
                      ) : null
                    }
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.loteProveedor.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />

                  <Input
                    label={
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">Fabricante</p>
                        <p className="!text-background-500 text-xs font-normal">
                          {(product.fabricante || "").length + " / 255"}
                        </p>
                      </div>
                    }
                    classNames={{
                      label:
                        "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input:
                        "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal",
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current",
                    }}
                    name="fabricante"
                    labelPlacement="outside"
                    type="text"
                    radius="sm"
                    variant="bordered"
                    maxLength={255}
                    isReadOnly={action !== "create" && action !== "update"}
                    placeholder={
                      action === "create"
                        ? "Ingrese el fabricante (Opcional)"
                        : data?.fabricante || "Sin fabricante"
                    }
                    value={product.fabricante || ""}
                    onValueChange={(value) =>
                      handleInputChange("fabricante", value)
                    }
                  />

                  <Input
                    label={
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">Distribuidor</p>
                        <p className="!text-background-500 text-xs font-normal">
                          {(product.distribuidor || "").length + " / 255"}
                        </p>
                      </div>
                    }
                    classNames={{
                      label:
                        "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input:
                        "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal",
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current",
                    }}
                    name="distribuidor"
                    labelPlacement="outside"
                    type="text"
                    radius="sm"
                    variant="bordered"
                    maxLength={255}
                    isReadOnly={action !== "create" && action !== "update"}
                    placeholder={
                      action === "create"
                        ? "Ingrese el distribuidor (Opcional)"
                        : data?.distribuidor || "Sin distribuidor"
                    }
                    value={product.distribuidor || ""}
                    onValueChange={(value) =>
                      handleInputChange("distribuidor", value)
                    }
                  />

                  <Input
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">Fecha de Ingreso</p>
                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                      </div>
                    }
                    classNames={{
                      label:
                        "font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input: `transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal ${
                        (action === "create" || action === "update") &&
                        !product.fechaIngreso
                          ? "text-background-500 focus:text-current"
                          : "text-current"
                      }`,
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current py-1",
                    }}
                    name="fechaIngreso"
                    labelPlacement="outside"
                    type={
                      action === "create" || action === "update"
                        ? "date"
                        : "text"
                    }
                    radius="sm"
                    variant="bordered"
                    isReadOnly={action !== "create" && action !== "update"}
                    value={
                      action === "create" || action === "update"
                        ? product.fechaIngreso
                        : formatDateShort(product.fechaIngreso)
                    }
                    onValueChange={(value) =>
                      handleInputChange("fechaIngreso", value)
                    }
                    isInvalid={productErrors.fechaIngreso.length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.fechaIngreso.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />

                  <Input
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">
                          Fecha de Caducidad
                        </p>
                      </div>
                    }
                    classNames={{
                      label:
                        "font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input: `transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal ${
                        (action === "create" || action === "update") &&
                        !product.fechaCaducidad
                          ? "text-background-500 focus:text-current"
                          : "text-current"
                      }`,
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current py-1",
                    }}
                    name="fechaCaducidad"
                    labelPlacement="outside"
                    type={
                      action === "create" || action === "update"
                        ? "date"
                        : "text"
                    }
                    radius="sm"
                    variant="bordered"
                    isReadOnly={action !== "create" && action !== "update"}
                    value={
                      action === "create" || action === "update"
                        ? product.fechaCaducidad
                        : formatDateShort(product.fechaCaducidad)
                    }
                    onValueChange={(value) =>
                      handleInputChange("fechaCaducidad", value)
                    }
                    isInvalid={productErrors.fechaCaducidad.length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.fechaCaducidad.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />

                  <Input
                    className="sm:col-span-2"
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">Fecha Reanálisis</p>
                      </div>
                    }
                    classNames={{
                      label:
                        "font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input: `transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal ${
                        (action === "create" || action === "update") &&
                        !product.reanalisis
                          ? "text-background-500 focus:text-current"
                          : "text-current"
                      }`,
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current py-1",
                    }}
                    name="reanalisis"
                    labelPlacement="outside"
                    type={
                      action === "create" || action === "update"
                        ? "date"
                        : "text"
                    }
                    radius="sm"
                    variant="bordered"
                    isReadOnly={action !== "create" && action !== "update"}
                    value={
                      action === "create" || action === "update"
                        ? product.reanalisis || ""
                        : formatDateShort(product.reanalisis)
                    }
                    onValueChange={(value) =>
                      handleInputChange("reanalisis", value)
                    }
                    isInvalid={productErrors.reanalisis.length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.reanalisis.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />

                  <Input
                    className="sm:col-span-2"
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">Fecha muestreo</p>
                      </div>
                    }
                    classNames={{
                      label:
                        "font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input: `transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal ${
                        (action === "create" || action === "update") &&
                        !product.fechaMuestreo
                          ? "text-background-500 focus:text-current"
                          : "text-current"
                      }`,
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current py-1",
                    }}
                    name="fechaMuestreo"
                    labelPlacement="outside"
                    type={
                      action === "create" || action === "update"
                        ? "date"
                        : "text"
                    }
                    radius="sm"
                    variant="bordered"
                    isReadOnly={action !== "create" && action !== "update"}
                    value={
                      action === "create" || action === "update"
                        ? product.fechaMuestreo || ""
                        : formatDateShort(product.fechaMuestreo)
                    }
                    onValueChange={(value) =>
                      handleInputChange("fechaMuestreo", value)
                    }
                    isInvalid={productErrors.fechaMuestreo.length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.fechaMuestreo.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />

                  <Select
                    aria-label="Unidad de Medida"
                    className="w-full -mt-4"
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">Unidad de Medida</p>
                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                      </div>
                    }
                    classNames={{
                      value: "text-background-500 !font-normal",
                      trigger:
                        "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent",
                      popoverContent: "bg-background-100 rounded-lg",
                      selectorIcon: "!text-background-500",
                    }}
                    listboxProps={{
                      itemClasses: {
                        base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                      },
                    }}
                    name="unitOfMeasurementId"
                    selectionMode="single"
                    disallowEmptySelection
                    selectorIcon={<ChevronDownFilled className="size-5" />}
                    labelPlacement="outside"
                    radius="sm"
                    variant="bordered"
                    renderValue={(items) => {
                      const item = Array.from(items)[0];
                      if (!item)
                        return action === "create"
                          ? "Seleccione una unidad"
                          : product.unitOfMeasurementName ||
                              data?.unitOfMeasurementName ||
                              "Seleccione una unidad";
                      return item.textValue;
                    }}
                    placeholder={
                      action === "create"
                        ? "Seleccione una unidad"
                        : product.unitOfMeasurementName ||
                          data?.unitOfMeasurementName ||
                          "Seleccione una unidad"
                    }
                    selectedKeys={
                      product.unitOfMeasurementId
                        ? new Set([String(product.unitOfMeasurementId)])
                        : new Set([])
                    }
                    onSelectionChange={(keys) => {
                      const [first] = Array.from(keys);
                      const selectedUnit = units.find(
                        (unit) => String(unit.id) === String(first)
                      );

                      handleInputChange("unitOfMeasurementId", first);
                      if (selectedUnit) {
                        handleInputChange(
                          "unitOfMeasurementName",
                          selectedUnit.name
                        );
                        handleInputChange(
                          "unitOfMeasurementCode",
                          selectedUnit.code
                        );
                      }
                    }}
                    isDisabled={action !== "create" && action !== "update"}
                    isInvalid={productErrors.unitOfMeasurementId.length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.unitOfMeasurementId.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  >
                    {units.map((unit) => (
                      <SelectItem
                        key={String(unit.id)}
                        value={String(unit.id)}
                        textValue={unit.name}
                      >
                        {unit.name} ({unit.code})
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    aria-label="Tipo de Almacén"
                    className="w-full -mt-4"
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">Tipo de Almacén</p>
                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                      </div>
                    }
                    classNames={{
                      value: "text-background-500 !font-normal",
                      trigger:
                        "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent",
                      popoverContent: "bg-background-100 rounded-lg",
                      selectorIcon: "!text-background-500",
                    }}
                    listboxProps={{
                      itemClasses: {
                        base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                      },
                    }}
                    name="warehouseTypeId"
                    selectionMode="single"
                    disallowEmptySelection
                    selectorIcon={<ChevronDownFilled className="size-5" />}
                    labelPlacement="outside"
                    radius="sm"
                    variant="bordered"
                    renderValue={(items) => {
                      const item = Array.from(items)[0];
                      if (!item)
                        return action === "create"
                          ? "Seleccione un tipo"
                          : product.warehouseTypeName ||
                              data?.warehouseTypeName ||
                              "Seleccione un tipo";
                      return item.textValue;
                    }}
                    placeholder={
                      action === "create"
                        ? "Seleccione un tipo"
                        : product.warehouseTypeName ||
                          data?.warehouseTypeName ||
                          "Seleccione un tipo"
                    }
                    selectedKeys={
                      product.warehouseTypeId
                        ? new Set([String(product.warehouseTypeId)])
                        : new Set([])
                    }
                    onSelectionChange={(keys) => {
                      const [first] = Array.from(keys);
                      const selectedType = warehouseTypes.find(
                        (type) => String(type.id) === String(first)
                      );

                      handleInputChange("warehouseTypeId", first);
                      if (selectedType) {
                        handleInputChange(
                          "warehouseTypeName",
                          selectedType.name
                        );
                      }
                    }}
                    isDisabled={action !== "create" && action !== "update"}
                    isInvalid={productErrors.warehouseTypeId.length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.warehouseTypeId.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  >
                    {warehouseTypes.map((type) => (
                      <SelectItem
                        key={String(type.id)}
                        value={String(type.id)}
                        textValue={type.name}
                      >
                        {type.name} ({type.code})
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">Cantidad Total</p>
                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                      </div>
                    }
                    classNames={{
                      label:
                        "font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input:
                        "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal",
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current",
                    }}
                    name="cantidadTotal"
                    labelPlacement="outside"
                    type="number"
                    radius="sm"
                    variant="bordered"
                    isReadOnly={action !== "create" && action !== "update"}
                    placeholder={
                      action === "create"
                        ? "Ingrese la cantidad total"
                        : data?.cantidadTotal
                    }
                    value={product.cantidadTotal}
                    onValueChange={(value) =>
                      handleInputChange("cantidadTotal", value)
                    }
                    isInvalid={productErrors.cantidadTotal.length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.cantidadTotal.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />

                  <Input
                    label={
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm">
                          Número de Contenedores
                        </p>
                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                      </div>
                    }
                    classNames={{
                      label:
                        "font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input:
                        "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal",
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current",
                    }}
                    name="numeroContenedores"
                    labelPlacement="outside"
                    type="number"
                    radius="sm"
                    variant="bordered"
                    isReadOnly={action !== "create" && action !== "update"}
                    placeholder={
                      action === "create"
                        ? "Ingrese el número de contenedores"
                        : data?.numeroContenedores
                    }
                    value={product.numeroContenedores}
                    onValueChange={(value) =>
                      handleInputChange("numeroContenedores", value)
                    }
                    isInvalid={productErrors.numeroContenedores.length > 0}
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.numeroContenedores.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />

                  <Input
                    label={
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          <p className="font-medium text-sm">
                            Número de Análisis
                          </p>
                          <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                        </div>
                        <p className="!text-background-500 text-xs font-normal">
                          {(product.numeroAnalisis || "").length + " / 50"}
                        </p>
                      </div>
                    }
                    classNames={{
                      label:
                        "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out",
                      input:
                        "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",
                      mainWrapper: "group-data-[invalid=true]:animate-shake",
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current",
                    }}
                    name="numeroAnalisis"
                    labelPlacement="outside"
                    type="text"
                    radius="sm"
                    variant="bordered"
                    maxLength={50}
                    isReadOnly={action !== "create" && action !== "update"}
                    placeholder={
                      action === "create"
                        ? "Ingrese el número de análisis"
                        : data?.numeroAnalisis
                    }
                    value={product.numeroAnalisis || ""}
                    onValueChange={(value) =>
                      handleInputChange("numeroAnalisis", value)
                    }
                    isInvalid={productErrors.numeroAnalisis.length > 0}
                    endContent={
                      productErrors.numeroAnalisis.length === 0 &&
                      product.numeroAnalisis ? (
                        <CheckmarkFilled className="size-4 text-background-500 group-data-[focus=true]:text-primary" />
                      ) : productErrors.numeroAnalisis.length > 0 ? (
                        <DismissFilled className="size-4 text-danger" />
                      ) : null
                    }
                    errorMessage={() => (
                      <div className="flex text-danger">
                        <ul>
                          {productErrors.numeroAnalisis.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  />
                </Form>

                {(action === "create" || action === "update") && (
                  <div className="w-full flex justify-end py-8 sm:gap-4 gap-2">
                    <Button
                      className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                      form="product-form"
                      radius="sm"
                      variant="shadow"
                      color="primary"
                      type="submit"
                      startContent={
                        !isLoading && (
                          <ArrowHookUpRightFilled className="size-5" />
                        )
                      }
                      isLoading={isLoading}
                      isDisabled={
                        product.stockCatalogueId === "" ||
                        product.productStatusId === "" ||
                        product.unitOfMeasurementId === "" ||
                        product.warehouseTypeId === "" ||
                        product.lote === "" ||
                        product.loteProveedor === "" ||
                        product.codigoProducto === "" ||
                        product.numeroAnalisis === "" ||
                        product.fechaIngreso === "" ||
                        product.cantidadTotal === "" ||
                        product.numeroContenedores === "" ||
                        Object.values(productErrors).some(
                          (err) => err.length > 0
                        )
                      }
                    >
                      Siguiente
                    </Button>
                  </div>
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <ProductsModal
        isOpen={isModalOpen}
        onOpenChange={onModalOpenChange}
        data={product}
        initialData={data}
        action={action}
        onRefresh={onRefresh}
        closeDrawer={() => {
          onOpenChange(false);
          resetForm();
        }}
      />
    </>
  );
};
