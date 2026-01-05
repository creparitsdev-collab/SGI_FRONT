import {
  addToast,
  Spinner as SpinnerH,
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { getProducts, updateProduct } from "../service/product";
import { PrimaryButton } from "../components/PrimaryButton";
import React, { useEffect, useState, useTransition } from "react";
import { useIsIconOnlyMedium } from "../hooks/useIsIconOnly";
import {
  ArrowSortDownLinesFilled,
  ArrowSortFilled,
  ArrowSortUpLinesFilled,
  ChevronDownFilled,
  CircleFilled,
  DismissCircleFilled,
  MoreVerticalFilled,
  OptionsFilled,
  AddFilled,
  EditFilled,
  DeleteFilled,
  ScriptFilled,
  QrCodeFilled,
} from "@fluentui/react-icons";
import { motion } from "framer-motion";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { formatDateLiteral } from "../js/utils";
import { useAuth } from "../hooks/useAuth";
import { ProductsDrawer } from "../components/products/ProductsDrawer";
import { ProductsDeleteModal } from "../components/products/ProductsDeleteModal";
import { ProductQRModal } from "../components/products/ProductQRModal";

export const Products = () => {
  const { user } = useAuth();

  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const triggerRefresh = () => setRefreshTrigger((prev) => !prev);

  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState([]);

  const isIconOnlyMedium = useIsIconOnlyMedium();
  const [, startTransition] = useTransition();
  const { searchValue, setSearchValue } = useOutletContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountDescription, setDiscountDescription] = useState("");
  const [isDiscountLoading, setIsDiscountLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState({});
  const [action, setAction] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const statusId = searchParams.get("statusId");
        const stockCatalogueId = searchParams.get("stockCatalogueId");

        const response = await getProducts(
          0,
          100,
          stockCatalogueId ? parseInt(stockCatalogueId) : null,
          statusId ? parseInt(statusId) : null
        );

        const data = response?.data?.content || [];

        if (Array.isArray(data)) {
          const dataCount = data.map((item, index) => ({
            ...item,
            n: index + 1,
          }));

          startTransition(() => {
            setProducts(dataCount);

            setSelectedProduct((prev) => {
              if (!prev || !prev.id) return null;
              const updated = dataCount.find((p) => p.id === prev.id);
              return updated ?? prev;
            });

            setIsLoading(false);
          });
        } else {
          addToast({
            title: "No se pudieron obtener los datos",
            description: "Ocurrió un error al obtener los datos",
            color: "danger",
            icon: <DismissCircleFilled className="size-5" />,
          });
          startTransition(() => {
            setErrors((prev) => [...prev, "No se pudieron obtener los datos"]);
            setIsLoading(false);
          });
        }
      } catch (err) {
        startTransition(() => {
          setErrors((prev) => [...prev, err.message]);
          setIsLoading(false);
        });
      }
    };
    fetchData();
  }, [refreshTrigger, searchParams]);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "n",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchValue]);

  const hasSearchFilter = Boolean(searchValue);

  const filteredItems = React.useMemo(() => {
    let filteredProducts = [...products];

    if (hasSearchFilter) {
      const normalizedSearch = String(searchValue).trim().toLowerCase();

      const statusNames = Array.from(
        new Set(
          products
            .map((p) => String(p.productStatusName || "").trim().toLowerCase())
            .filter(Boolean)
        )
      ).sort((a, b) => b.length - a.length);

      const matchedStatus = statusNames.find(
        (statusName) =>
          normalizedSearch === statusName || normalizedSearch.includes(statusName)
      );

      let remainingText = normalizedSearch;
      if (matchedStatus) {
        remainingText = remainingText
          .replace(matchedStatus, " ")
          .replace(/\s+/g, " ")
          .trim();

        filteredProducts = filteredProducts.filter((product) =>
          String(product.productStatusName || "")
            .toLowerCase()
            .includes(matchedStatus)
        );
      }

      if (remainingText) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.nombre?.toLowerCase().includes(remainingText) ||
            product.stockCatalogueName?.toLowerCase().includes(remainingText) ||
            (!matchedStatus &&
              product.productStatusName?.toLowerCase().includes(remainingText)) ||
            product.lote?.toLowerCase().includes(remainingText) ||
            product.fabricante?.toLowerCase().includes(remainingText) ||
            product.distribuidor?.toLowerCase().includes(remainingText)
        );
      }
    }

    return filteredProducts;
  }, [products, searchValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];

      // Handle date strings
      if (sortDescriptor.column === "createdAt") {
        first = new Date(first).getTime();
        second = new Date(second).getTime();
      }

      // Handle null/undefined values
      if (first == null) first = "";
      if (second == null) second = "";

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const paginatedSortedItems = React.useMemo(() => {
    return sortedItems.map((product, idx) => ({
      ...product,
      pageIndex: idx,
    }));
  }, [sortedItems]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback(
    (value) => {
      setSearchValue(value);
      setPage(1);
    },
    [setSearchValue]
  );

  const handleSort = (key) => {
    setSortDescriptor((prev) => ({
      column: key,
      direction:
        prev.column === key
          ? prev.direction === "ascending"
            ? "descending"
            : "ascending"
          : "ascending",
    }));
  };

  const endContent = (key) => {
    return sortDescriptor.column === key ? (
      sortDescriptor.direction === "ascending" ? (
        <ArrowSortUpLinesFilled className="size-5" />
      ) : (
        <ArrowSortDownLinesFilled className="size-5" />
      )
    ) : null;
  };

  const handleReadProduct = (product) => {
    setAction("");
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCreateProduct = () => {
    setAction("create");
    setSelectedProduct(null);
    setIsDrawerOpen(true);
  };

  const handleUpdateProduct = (product) => {
    setAction("update");
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleViewQR = (product) => {
    setSelectedProduct(product);
    setIsQRModalOpen(true);
  };

  const handleOpenDiscountModal = (product) => {
    setSelectedProduct(product);
    setDiscountAmount("");
    setDiscountDescription("");
    setIsDiscountModalOpen(true);
  };

  const handleApplyDiscount = async () => {
    const currentQty = Number(selectedProduct?.cantidadTotal);
    const discountQty = Number(discountAmount);
    const performedAt = new Date().toLocaleString();
    const performedBy =
      user?.name || user?.username || user?.email || user?.fullName || "";

    if (!Number.isFinite(currentQty)) {
      addToast({
        title: "No se puede aplicar el descuento",
        description: "La cantidad total actual no es válida.",
        color: "danger",
        icon: <DismissCircleFilled className="size-5" />,
      });
      return;
    }

    if (!Number.isFinite(discountQty) || discountQty <= 0) {
      addToast({
        title: "Atención",
        description: "Ingrese una cantidad de descuento válida.",
        color: "warning",
        icon: <DismissCircleFilled className="size-5" />,
      });
      return;
    }

    if (discountQty > currentQty) {
      addToast({
        title: "Atención",
        description: "El descuento no puede ser mayor que la cantidad total.",
        color: "warning",
        icon: <DismissCircleFilled className="size-5" />,
      });
      return;
    }

    const stockCatalogueId = parseInt(selectedProduct?.stockCatalogueId);
    const productStatusId = parseInt(selectedProduct?.productStatusId);
    const unitOfMeasurementId = parseInt(selectedProduct?.unitOfMeasurementId);
    const warehouseTypeId = parseInt(selectedProduct?.warehouseTypeId);
    const numeroContenedores = parseInt(selectedProduct?.numeroContenedores);
    const fechaIngreso = selectedProduct?.fechaIngreso ?? selectedProduct?.fecha;

    const hasRequiredFields =
      selectedProduct?.id != null &&
      Number.isFinite(stockCatalogueId) &&
      Number.isFinite(productStatusId) &&
      Number.isFinite(unitOfMeasurementId) &&
      Number.isFinite(warehouseTypeId) &&
      Number.isFinite(numeroContenedores) &&
      String(selectedProduct?.nombre || "").trim() &&
      String(selectedProduct?.lote || "").trim() &&
      String(selectedProduct?.loteProveedor || "").trim() &&
      String(selectedProduct?.codigoProducto || "").trim() &&
      String(selectedProduct?.numeroAnalisis || "").trim() &&
      Boolean(fechaIngreso);

    if (!hasRequiredFields) {
      addToast({
        title: "No se puede aplicar el descuento",
        description:
          "Este producto no tiene todos los datos requeridos para actualizarse desde esta acción. Use 'Actualizar producto'.",
        color: "warning",
        icon: <DismissCircleFilled className="size-5" />,
      });
      return;
    }

    const nextQty = currentQty - discountQty;

    try {
      setIsDiscountLoading(true);

      const productData = {
        id: selectedProduct.id,
        stockCatalogueId,
        productStatusId,
        unitOfMeasurementId,
        warehouseTypeId,
        nombre: selectedProduct.nombre?.trim(),
        lote: selectedProduct.lote?.trim(),
        loteProveedor: selectedProduct.loteProveedor?.trim(),
        fabricante: selectedProduct.fabricante?.trim() || null,
        distribuidor: selectedProduct.distribuidor?.trim() || null,
        codigoProducto: selectedProduct.codigoProducto?.trim(),
        numeroAnalisis: selectedProduct.numeroAnalisis?.trim(),
        fechaIngreso,
        fechaCaducidad:
          selectedProduct.fechaCaducidad ?? selectedProduct.caducidad,
        reanalisis: selectedProduct.reanalisis,
        fechaMuestreo: selectedProduct.fechaMuestreo ?? selectedProduct.muestreo,
        cantidadTotal: parseInt(nextQty),
        numeroContenedores,
      };

      const response = await updateProduct(productData);
      const success = response?.type === "SUCCESS";

      addToast({
        title: success
          ? "Se aplicó el descuento"
          : "No se pudo aplicar el descuento",
        description: success
          ? `Cantidad actualizada a ${nextQty}.${performedBy ? ` Realizado por: ${performedBy}.` : ""} Fecha: ${performedAt}.${discountDescription?.trim() ? ` Descripción: ${discountDescription.trim()}.` : ""}`
          : "Ocurrió un error al procesar la solicitud.",
        color: success ? "primary" : "danger",
        icon: success ? (
          <CircleFilled className="size-5" />
        ) : (
          <DismissCircleFilled className="size-5" />
        ),
      });

      if (success) {
        setIsDiscountModalOpen(false);
        triggerRefresh();
      }
    } catch (error) {
      addToast({
        title: "No se pudo aplicar el descuento",
        description:
          error.response?.data?.message ||
          "Ocurrió un error al procesar la solicitud.",
        color: "danger",
        icon: <DismissCircleFilled className="size-5" />,
      });
    } finally {
      setIsDiscountLoading(false);
    }
  };

  const topContent = React.useMemo(() => {
    const sortOptions = [
      { key: "n", label: "Número" },
      { key: "stockCatalogueName", label: "Catálogo" },
      { key: "lote", label: "Lote" },
      { key: "createdAt", label: "Fecha Creación" },
    ];

    const totalFiltered = filteredItems.length;
    const startIndex = (page - 1) * rowsPerPage + 1;
    const endIndex = Math.min(page * rowsPerPage, totalFiltered);

    return (
      <div className="flex flex-col xs:flex-row xs:justify-between gap-2 xs:gap-4 xs:items-center px-1 n2">
        <div className="flex flex-col n7">
          <p className="text-lg font-bold">Productos</p>
          <span className="text-background-500 text-xs">
            {totalFiltered === 0
              ? "Sin resultados"
              : totalFiltered <= rowsPerPage
              ? `Mostrando todos (${totalFiltered})`
              : `Mostrando ${startIndex}–${endIndex} de ${totalFiltered}`}
          </span>
        </div>

        <div className="flex w-full xs:w-auto justify-end flex-wrap gap-2 sm:gap-4">
          <Popover placement="bottom" shadow="lg" radius="sm">
            <PopoverTrigger>
              <Button
                className="n8 bg-transparent dark:bg-background-100 transition-background !duration-1000 ease-in-out"
                isIconOnly
                radius="sm"
              >
                <OptionsFilled className="size-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-background dark:bg-background-200 transition-colors duration-1000 ease-in-out w-32 shadow-large">
              <div className="p-1 flex flex-col items-start w-full h-full">
                <p className="text-xs text-background-500 pt-1 pb-1">
                  Opciones
                </p>

                <Popover
                  placement="left-start"
                  shadow="lg"
                  radius="sm"
                  crossOffset={-32}
                  offset={11}
                >
                  <PopoverTrigger>
                    <Button
                      className="bg-transparent -ml-2 px-3"
                      disableAnimation
                      radius="sm"
                      endContent={<ArrowSortFilled className="ml-3 size-4" />}
                    >
                      Ordenar
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-background dark:bg-background-200 transition-colors duration-1000 ease-in-out w-32 shadow-large">
                    <div className="p-1 flex flex-col items-start w-full h-full">
                      <p className="text-xs text-background-500 pt-1 pb-1">
                        Ordenar por:
                      </p>

                      {sortOptions.map((opt) => (
                        <Button
                          disableRipple
                          radius="sm"
                          size="sm"
                          key={opt.key}
                          className="!bg-transparent text-sm -ml-2 py-5"
                          onPress={() => handleSort(opt.key)}
                          endContent={endContent(opt.key)}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Select
                  disallowEmptySelection
                  className="w-28 flex-none"
                  aria-label="Select filas"
                  renderValue={(items) => {
                    const selectedKey = items.values().next().value?.key;
                    return <p>Filas: {selectedKey}</p>;
                  }}
                  size="md"
                  radius="sm"
                  selectionMode="single"
                  defaultSelectedKeys={[`${rowsPerPage}`]}
                  onChange={onRowsPerPageChange}
                  selectorIcon={<ChevronDownFilled className="size-5" />}
                  classNames={{
                    trigger: "border-0 shadow-none !bg-transparent -ml-2",
                    popoverContent:
                      "text-current bg-background dark:bg-background-200 shadow-large transition-colors duration-1000 ease-in-out rounded-lg",
                  }}
                  listboxProps={{
                    itemClasses: {
                      base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                    },
                  }}
                >
                  <SelectItem key="5" value="5">
                    5
                  </SelectItem>
                  <SelectItem key="10" value="10">
                    10
                  </SelectItem>
                  <SelectItem key="15" value="15">
                    15
                  </SelectItem>
                  <SelectItem key="20" value="20">
                    20
                  </SelectItem>
                </Select>
              </div>
            </PopoverContent>
          </Popover>

          {user.role === "ADMIN" && (
            <PrimaryButton
              tooltipPlacement="bottom"
              label="Registrar"
              startContent={<AddFilled className="size-5 " />}
              onPress={handleCreateProduct}
            />
          )}
        </div>
      </div>
    );
  }, [
    filteredItems,
    searchValue,
    onSearchChange,
    rowsPerPage,
    onRowsPerPageChange,
    page,
    products.length,
    hasSearchFilter,
    sortDescriptor,
  ]);

  const bottomContent = React.useMemo(() => {
    if (filteredItems.length > 0) {
      return (
        <div className="flex justify-end">
          <Pagination
            showControls
            showShadow
            className="-m-0 px-0 pt-2 pb-2.5 n4"
            aria-label="Pagination tabla"
            radius="sm"
            variant="light"
            color="primary"
            page={page}
            total={pages || 1}
            onChange={setPage}
            classNames={{ cursor: "font-medium", wrapper: "gap-0 sm:gap-1" }}
          />
        </div>
      );
    }
  }, [filteredItems.length, page, pages]);

  const classNames = React.useMemo(
    () => ({
      thead: "[&>tr]:first:shadow-none [&>tr:last-child]:hidden",
      th: "bg-transparent",
      td: [
        "px-1 py-2",
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        "group-data-[middle=true]/tr:before:rounded-none",
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
      ],
      wrapper:
        "rounded-[9px] n3 gap-0 overflow-y-auto overflow-x-auto md:pt-0 md:pb-0 md:pl-2 md:pr-2 p-1 transition-colors duration-1000 bg-transparent [&::-webkit-scrollbar-corner]:bg-transparent [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary",
      base: "h-full",
      table: "bg-transparent md:min-w-[1400px]",
      emptyWrapper: "text-background-950 text-sm",
    }),
    []
  );

  return (
    <>
      {isLoading ? (
        <div className="relative w-full h-full px-1">
          <p className="text-lg font-bold">Productos</p>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <SpinnerH
              classNames={{ label: "pt-2 text-sm" }}
              color="current"
              size="md"
              label="Espere un poco por favor"
            />
          </div>
        </div>
      ) : errors.length > 0 ? (
        <div className="w-full h-full px-1">
          <p className="text-lg font-bold">Productos</p>

          <div className="space-y-4 pt-4">
            {errors.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div
                  key={i}
                  className="bg-danger-50 rounded-lg border-danger-100 border py-4 px-3 flex gap-3"
                >
                  <div className="flex items-center justify-center text-danger-600">
                    <DismissCircleFilled className="size-5" />
                  </div>
                  <div className="text-sm text-danger-600">
                    <p className="font-medium break-words">{msg}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : products.length > 0 ? (
        <Table
          isHeaderSticky
          radius="none"
          shadow="none"
          aria-label="Tabla de productos"
          topContentPlacement="outside"
          bottomContentPlacement="inside"
          hideHeader={isIconOnlyMedium}
          topContent={topContent}
          bottomContent={bottomContent}
          classNames={classNames}
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader className="bg-transparent">
            <TableColumn
              key="card"
              hideHeader={isIconOnlyMedium}
              className="bg-background transition-colors !duration-1000 ease-in-out"
            >
              <Card
                shadow="none"
                className="w-full bg-transparent p-0"
                radius="sm"
              >
                <CardBody className="p-0">
                  <div className="flex w-full items-center justify-between gap-2 text-sm font-medium">
                    <div className="w-7 flex-shrink-0 ml-4">#</div>

                    <div className="flex-1 min-w-0 max-w-[15%]">Catálogo</div>

                    <div className="flex-1 min-w-0 max-w-[10%]">Estado</div>

                    <div className="flex-1 min-w-0 max-w-[15%]">Nombre</div>

                    <div className="flex-1 min-w-0 max-w-[12%]">Lote</div>

                    <div className="flex-1 min-w-0 max-w-[10%]">
                      Código Prod.
                    </div>

                    <div className="flex-1 min-w-0 max-w-[10%] text-center">
                      Cantidad total
                    </div>

                    <div className="flex-1 min-w-0 max-w-[12%]">
                      N° Contenedores
                    </div>

                    <div className="flex-1 min-w-0 max-w-[10%]">Fabricante</div>

                    <div className="flex-1 min-w-0 max-w-[10%]">
                      Distribuidor
                    </div>

                    <div className="flex-1 min-w-0 max-w-[10%] text-center">
                      Ingreso
                    </div>

                    <div className="flex-1 min-w-0 max-w-[10%] text-center">
                      Caducidad
                    </div>

                    <div className="flex-1 min-w-0 max-w-[10%] text-center">
                      Reanálisis
                    </div>

                    <div className="flex-1 min-w-0 max-w-[10%]">Unidad</div>

                    <div className="flex-1 min-w-0 max-w-[10%]">Almacén</div>

                    <div className="flex-1 min-w-0 max-w-[10%]">
                      N° Análisis
                    </div>

                    <div className="w-32 flex-shrink-0">Fecha Creación</div>

                    <div className="flex-shrink-0 flex text-center w-16">
                      Acciones
                    </div>
                  </div>
                </CardBody>
              </Card>
            </TableColumn>
          </TableHeader>

          <TableBody
            className="bg-transparent"
            items={paginatedSortedItems}
            emptyContent={
              filteredItems.length > 0 ? (
                <SpinnerH
                  classNames={{ label: "pt-2 text-sm" }}
                  color="current"
                  size="md"
                  label="Espere un poco por favor"
                />
              ) : (
                "No se encontraron coincidencias"
              )
            }
          >
            {(item) => (
              <TableRow
                aria-label={item.n}
                key={item.n}
                className="hover:-translate-y-1 transition-all duration-250 ease-in-out"
              >
                <TableCell className="px-0 py-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: item.pageIndex * 0.1,
                    }}
                  >
                    <Card
                      shadow="none"
                      radius="sm"
                      className="w-full transition-colors !duration-1000 ease-in-out bg-transparent dark:bg-background-100 shadow-small"
                    >
                      <CardBody className="md:px-2 md:py-1 pl-4 md:pl-0 n5">
                        <div className="absolute left-0 inset-y-4 w-1 bg-primary rounded-full md:inset-y-1"></div>
                        <div className="md:hidden w-full h-full flex justify-between">
                          <div>
                            <div className="xs:flex xs:items-center xs:gap-2 pb-2">
                              <div className="flex gap-1 pb-1 items-end">
                                <p className="text-sm font-medium break-all line-clamp-1">
                                  {item.stockCatalogueName || "-"}
                                </p>
                              </div>
                              <p className="text-xs text-background-500 pb-[2px]">
                                #{item.n}
                              </p>
                            </div>
                            <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                              <span className="text-background-700 font-medium">
                                Estado:{" "}
                              </span>
                              {item.productStatusName}
                            </p>
                            <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                              <span className="text-background-700 font-medium">
                                Nombre:{" "}
                              </span>
                              {item.nombre || "-"}
                            </p>
                            <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                              <span className="text-background-700 font-medium">
                                Lote:{" "}
                              </span>
                              {item.lote}
                            </p>
                            {item.codigoProducto && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  Código Prod.:{" "}
                                </span>
                                {item.codigoProducto}
                              </p>
                            )}
                            {item.cantidadTotal != null && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  Cantidad total:{" "}
                                </span>
                                {item.cantidadTotal}
                              </p>
                            )}
                            {item.fabricante && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  Fabricante:{" "}
                                </span>
                                {item.fabricante}
                              </p>
                            )}
                            {item.distribuidor && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  Distribuidor:{" "}
                                </span>
                                {item.distribuidor}
                              </p>
                            )}
                            {item.fecha && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  Ingreso:{" "}
                                </span>
                                {formatDateLiteral(item.fecha, true)}
                              </p>
                            )}
                            {item.caducidad && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  Caducidad:{" "}
                                </span>
                                {formatDateLiteral(item.caducidad, true)}
                              </p>
                            )}
                            {item.reanalisis && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  Reanálisis:{" "}
                                </span>
                                {formatDateLiteral(item.reanalisis, true)}
                              </p>
                            )}
                            {item.muestreo && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  Fecha muestreo:{" "}
                                </span>
                                {formatDateLiteral(item.muestreo, true)}
                              </p>
                            )}
                            {item.unitOfMeasurementName && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  Unidad:{" "}
                                </span>
                                {item.unitOfMeasurementName}
                              </p>
                            )}
                            {item.warehouseTypeName && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  Almacén:{" "}
                                </span>
                                {item.warehouseTypeName}
                              </p>
                            )}
                            {item.numeroAnalisis && (
                              <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                                <span className="text-background-700 font-medium">
                                  N° Análisis:{" "}
                                </span>
                                {item.numeroAnalisis}
                              </p>
                            )}
                            <p className="text-xs text-background-500 max-w-full break-all line-clamp-1">
                              <span className="text-background-700 font-medium">
                                Creación:{" "}
                              </span>
                              {formatDateLiteral(item.createdAt, true)}
                            </p>
                          </div>
                          <div className="flex items-center pl-2">
                            <Dropdown
                              placement="bottom-end"
                              className="bg-background dark:bg-background-200 shadow-large transition-colors duration-1000 ease-in-out"
                              offset={28}
                              shadow="lg"
                              radius="sm"
                              classNames={{ content: "min-w-44" }}
                            >
                              <DropdownTrigger>
                                <Button
                                  className="bg-transparent"
                                  size="sm"
                                  radius="sm"
                                  isIconOnly
                                  as="a"
                                >
                                  <MoreVerticalFilled className="size-5" />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="Acciones"
                                variant="light"
                                itemClasses={{ base: "mt-1 mb-2" }}
                              >
                                <DropdownSection
                                  title="Acciones"
                                  classNames={{
                                    heading: "text-background-500 font-normal",
                                  }}
                                >
                                  {item.qrHash && (
                                    <DropdownItem
                                      className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                      key="handleViewQR"
                                      startContent={
                                        <QrCodeFilled className="size-5" />
                                      }
                                      onPress={() => handleViewQR(item)}
                                    >
                                      Ver código QR
                                    </DropdownItem>
                                  )}

                                  {user.role === "ADMIN" &&
                                    item.cantidadTotal != null && (
                                      <DropdownItem
                                        className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                        key="handleDiscountProduct"
                                        startContent={
                                          <EditFilled className="size-5" />
                                        }
                                        onPress={() => handleOpenDiscountModal(item)}
                                      >
                                        Generar descuento
                                      </DropdownItem>
                                    )}

                                  {user.role === "ADMIN" && (
                                    <DropdownItem
                                      className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                      key="handleUpdateProduct"
                                      startContent={
                                        <EditFilled className="size-5" />
                                      }
                                      onPress={() => handleUpdateProduct(item)}
                                    >
                                      Actualizar producto
                                    </DropdownItem>
                                  )}

                                  <DropdownItem
                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mt-1"
                                    key="handleReadProduct"
                                    startContent={
                                      <ScriptFilled className="size-5" />
                                    }
                                    onPress={() => handleReadProduct(item)}
                                  >
                                    Ver más detalles
                                  </DropdownItem>

                                  {user.role === "ADMIN" && (
                                    <DropdownItem
                                      className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mb-1"
                                      key="handleDeleteProduct"
                                      startContent={
                                        <DeleteFilled className="size-5" />
                                      }
                                      onPress={() => handleDeleteProduct(item)}
                                    >
                                      Eliminar
                                    </DropdownItem>
                                  )}
                                </DropdownSection>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </div>

                        <div className="hidden md:flex w-full h-full items-center justify-between gap-2">
                          <div className="w-7 flex-shrink-0 ml-4">
                            <p className="text-sm truncate text-primary">
                              {item.n}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[15%]">
                            <p className="text-sm truncate">
                              {item.stockCatalogueName}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate">
                              {item.productStatusName}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[12%]">
                            <p className="text-sm truncate">
                              {item.nombre || "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[12%]">
                            <p className="text-sm truncate">{item.lote}</p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate">
                              {item.codigoProducto || "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate text-center">
                              {item.cantidadTotal ?? "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[12%]">
                            <p className="text-sm truncate">
                              {item.numeroContenedores || "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate">
                              {item.fabricante || "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate">
                              {item.distribuidor || "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate text-center">
                              {item.fecha ? formatDateLiteral(item.fecha) : "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate text-center">
                              {item.caducidad
                                ? formatDateLiteral(item.caducidad)
                                : "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate text-center">
                              {item.reanalisis
                                ? formatDateLiteral(item.reanalisis)
                                : "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate">
                              {item.unitOfMeasurementName || "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate">
                              {item.warehouseTypeName || "-"}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0 max-w-[10%]">
                            <p className="text-sm truncate">
                              {item.numeroAnalisis || "-"}
                            </p>
                          </div>

                          <div className="w-32 flex-shrink-0">
                            <p className="text-sm truncate text-center">
                              {formatDateLiteral(item.createdAt)}
                            </p>
                          </div>

                          <div className="flex justify-center flex-shrink-0 w-16">
                            <Dropdown
                              placement="bottom-end"
                              className="bg-background dark:bg-background-200 shadow-large transition-colors duration-1000 ease-in-out"
                              shadow="lg"
                              radius="sm"
                              classNames={{ content: "min-w-44" }}
                            >
                              <DropdownTrigger>
                                <Button
                                  className="bg-transparent"
                                  size="sm"
                                  radius="sm"
                                  isIconOnly
                                  as="a"
                                >
                                  <MoreVerticalFilled className="size-5" />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label="Acciones"
                                variant="light"
                                itemClasses={{ base: "mt-1 mb-2" }}
                              >
                                <DropdownSection
                                  title="Acciones"
                                  classNames={{
                                    heading: "text-background-500 font-normal",
                                  }}
                                >
                                  {item.qrHash && (
                                    <DropdownItem
                                      className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                      key="handleViewQR"
                                      startContent={
                                        <QrCodeFilled className="size-5" />
                                      }
                                      onPress={() => handleViewQR(item)}
                                    >
                                      Ver código QR
                                    </DropdownItem>
                                  )}

                                  {user.role === "ADMIN" &&
                                    item.cantidadTotal != null && (
                                      <DropdownItem
                                        className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                        key="handleDiscountProduct"
                                        startContent={
                                          <EditFilled className="size-5" />
                                        }
                                        onPress={() => handleOpenDiscountModal(item)}
                                      >
                                        Generar descuento
                                      </DropdownItem>
                                    )}

                                  {user.role === "ADMIN" && (
                                    <DropdownItem
                                      className="rounded-md transition-all !duration-1000 ease-in-out w-40"
                                      key="handleUpdateProduct"
                                      startContent={
                                        <EditFilled className="size-5" />
                                      }
                                      onPress={() => handleUpdateProduct(item)}
                                    >
                                      Actualizar producto
                                    </DropdownItem>
                                  )}

                                  <DropdownItem
                                    className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mt-1"
                                    key="handleReadProduct"
                                    startContent={
                                      <ScriptFilled className="size-5" />
                                    }
                                    onPress={() => handleReadProduct(item)}
                                  >
                                    Ver más detalles
                                  </DropdownItem>

                                  {user.role === "ADMIN" && (
                                    <DropdownItem
                                      className="rounded-md transition-all !duration-1000 ease-in-out w-40 -mb-1"
                                      key="handleDeleteProduct"
                                      startContent={
                                        <DeleteFilled className="size-5" />
                                      }
                                      onPress={() => handleDeleteProduct(item)}
                                    >
                                      Eliminar
                                    </DropdownItem>
                                  )}
                                </DropdownSection>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : null}

      <ProductsDeleteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        data={selectedProduct}
        onRefresh={triggerRefresh}
      />
      <ProductsDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        data={selectedProduct}
        action={action}
        onRefresh={triggerRefresh}
      />
      <ProductQRModal
        isOpen={isQRModalOpen}
        onOpenChange={setIsQRModalOpen}
        product={selectedProduct}
      />

      <Modal
        hideCloseButton
        size="md"
        radius="lg"
        isOpen={isDiscountModalOpen}
        onOpenChange={setIsDiscountModalOpen}
        classNames={{ backdrop: "bg-black/20" }}
      >
        <ModalContent className="bg-background">
          {(onClose) => {
            const currentQty = Number(selectedProduct?.cantidadTotal);
            const discountQty = Number(discountAmount);
            const nextQty =
              Number.isFinite(currentQty) && Number.isFinite(discountQty)
                ? currentQty - discountQty
                : null;
            const performedAt = new Date().toLocaleString();
            const performedBy =
              user?.name || user?.username || user?.email || user?.fullName || "-";

            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <p className="text-lg font-bold">Generar descuento</p>
                  <p className="text-sm font-normal text-background-500">
                    Descuenta una cantidad de la cantidad total actual.
                  </p>
                </ModalHeader>

                <ModalBody className="gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">
                      <span className="font-medium">Producto:</span>{" "}
                      {selectedProduct?.nombre || "-"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Lote:</span>{" "}
                      {selectedProduct?.lote || "-"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Fecha:</span> {performedAt}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Realizado por:</span>{" "}
                      {performedBy}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Cantidad actual:</span>{" "}
                      {selectedProduct?.cantidadTotal ?? "-"}
                    </p>
                  </div>

                  <Input
                    label="Cantidad a descontar"
                    labelPlacement="outside"
                    type="number"
                    radius="sm"
                    variant="bordered"
                    min={1}
                    value={discountAmount}
                    onValueChange={setDiscountAmount}
                    placeholder="Ej: 100"
                    classNames={{
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 border-transparent text-current",
                    }}
                  />

                  <Input
                    label="Descripción (informativa)"
                    labelPlacement="outside"
                    type="text"
                    radius="sm"
                    variant="bordered"
                    value={discountDescription}
                    onValueChange={setDiscountDescription}
                    placeholder="Ej: Muestra para laboratorio"
                    classNames={{
                      inputWrapper:
                        "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 border-transparent text-current",
                    }}
                  />

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-background-500">
                      Cantidad resultante:{" "}
                      <span className="font-medium text-current">
                        {nextQty == null || !Number.isFinite(nextQty)
                          ? "-"
                          : nextQty}
                      </span>
                    </p>
                  </div>
                </ModalBody>

                <ModalFooter className="flex justify-end gap-2">
                  <Button
                    className="bg-transparent dark:bg-background-100"
                    radius="sm"
                    onPress={onClose}
                    isDisabled={isDiscountLoading}
                  >
                    Cancelar
                  </Button>

                  <Button
                    radius="sm"
                    color="primary"
                    variant="shadow"
                    onPress={handleApplyDiscount}
                    isLoading={isDiscountLoading}
                  >
                    Aplicar descuento
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
};
