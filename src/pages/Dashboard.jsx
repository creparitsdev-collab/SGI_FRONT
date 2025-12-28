import { Card, CardBody, Spinner as SpinnerH } from "@heroui/react";
import {
  BoxMultipleFilled,
  BoxFilled,
  CheckmarkCircleFilled,
  AlertFilled,
  PeopleFilled,
} from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  getStockCatalogues,
  getProductStatuses,
} from "../service/product";
import { getUsers } from "../service/user";
import { useAuth } from "../hooks/useAuth";

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCatalogues: 0,
    totalStatuses: 0,
    totalUsers: 0,
    productsByStatus: [],
    recentProducts: [],
    lowStockProducts: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const isAdmin = user.role === "ADMIN";

        const [productsRes, cataloguesRes, statusesRes, usersRes] =
          await Promise.all([
            getProducts(),
            getStockCatalogues(),
            isAdmin ? getProductStatuses() : Promise.resolve({ data: [] }),
            isAdmin ? getUsers() : Promise.resolve({ data: [] }),
          ]);

        const products = productsRes?.data?.content || [];
        const catalogues = cataloguesRes?.data || [];
        const statuses = statusesRes?.data || [];
        const users = usersRes?.data || [];

        // Calcular productos por estado
        const statusCounts = statuses.map((status) => ({
          id: status.id,
          name: status.name,
          count: products.filter((p) => p.productStatusId === status.id).length,
          color: getStatusColor(status.name),
        }));

        // Productos recientes (últimos 4)
        const recent = [...products]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        // Productos con stock bajo (stock real = cantidadTotal)
        const lowStock = products.filter((p) => (p.cantidadTotal ?? 0) < 10);

        setStats({
          totalProducts: products.length,
          totalCatalogues: catalogues.length,
          totalStatuses: statuses.length,
          totalUsers: users.length,
          productsByStatus: statusCounts,
          recentProducts: recent,
          lowStockProducts: lowStock,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.role]);

  const getStatusColor = (statusName) => {
    const name = statusName?.toLowerCase() || "";
    if (name.includes("sellado") || name.includes("nuevo"))
      return "text-success-600";
    if (name.includes("abierto") || name.includes("uso"))
      return "text-warning-600";
    if (name.includes("cuarentena") || name.includes("caducado"))
      return "text-danger-600";
    return "text-primary-600";
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-full px-1">
        <p className="text-lg font-bold">Dashboard</p>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <SpinnerH
            classNames={{ label: "pt-2 text-sm" }}
            color="current"
            size="md"
            label="Cargando datos..."
          />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Productos",
      value: stats.totalProducts,
      icon: <BoxMultipleFilled className="size-8" />,
      color: "bg-primary-50 text-primary-600",
    },
    {
      title: "Catálogos",
      value: stats.totalCatalogues,
      icon: <BoxFilled className="size-8" />,
      color: "bg-success-50 text-success-600",
    },
    ...(user.role === "ADMIN"
      ? [
          {
            title: "Estados",
            value: stats.totalStatuses,
            icon: <CheckmarkCircleFilled className="size-8" />,
            color: "bg-warning-50 text-warning-600",
          },
          {
            title: "Usuarios",
            value: stats.totalUsers,
            icon: <PeopleFilled className="size-8" />,
            color: "bg-secondary-50 text-secondary-600",
          },
        ]
      : [
          {
            title: "Stock Bajo",
            value: stats.lowStockProducts.length,
            icon: <AlertFilled className="size-8" />,
            color: "bg-warning-50 text-warning-600",
          },
          {
            title: "Recientes",
            value: stats.recentProducts.length,
            icon: <BoxMultipleFilled className="size-8" />,
            color: "bg-secondary-50 text-secondary-600",
          },
        ]),
  ];

  const userDisplayName =
    user?.name || user?.nombre || user?.fullName || user?.username || "";

  return (
    <div className="w-full min-h-full px-4 pb-6">
      <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold">Dashboard</p>
          <p className="text-sm text-background-500">
            Bienvenido de vuelta {userDisplayName}
          </p>
        </div>

        {/* Stats Cards - 4 columnas iguales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statCards.map((stat, index) => {
            const getNavigationPath = (title) => {
              switch (title) {
                case "Total Productos":
                  return "/App/Products";
                case "Catálogos":
                  return "/App/StockCatalogues";
                case "Estados":
                  return "/App/ProductStatuses";
                case "Usuarios":
                  return "/App/Users";
                case "Stock Bajo":
                  return "/App/Products";
                case "Recientes":
                  return "/App/Products";
                default:
                  return "/App";
              }
            };

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  shadow="sm"
                  radius="lg"
                  isPressable
                  onPress={() => navigate(getNavigationPath(stat.title))}
                  className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer w-full h-full"
                >
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-background-500 font-medium">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Content Grid - 2 columnas iguales con altura fija */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Productos por Estado */}
          {user.role === "ADMIN" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="w-full"
            >
              <Card shadow="sm" radius="lg" className="w-full flex flex-col">
                <CardBody className="p-6 flex-1">
                  <div className="flex flex-col gap-4 h-full">
                    <div className="flex items-center justify-between flex-shrink-0">
                      <p className="text-lg font-bold">Productos por Estado</p>
                      <CheckmarkCircleFilled className="size-5 text-background-500" />
                    </div>

                    <div className="flex flex-col gap-3 flex-1 min-h-0">
                      {stats.productsByStatus.map((status, index) => (
                        <motion.div
                          key={status.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                          className="w-full"
                        >
                          <Card
                            shadow="none"
                            radius="lg"
                            isPressable
                            onPress={() => navigate("/App/ProductStatuses")}
                            className="w-full bg-background-100 dark:bg-background-200 transition-colors duration-300 cursor-pointer"
                          >
                            <CardBody className="p-4">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {/*<div className={`w-2 h-2 rounded-full flex-shrink-0 ${status.color.replace('text-', 'bg-')}`} />
                                   */}
                                  <p className="text-sm font-medium truncate">
                                    {status.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <p
                                    className={`text-lg font-bold ${status.color}`}
                                  >
                                    {status.count}
                                  </p>
                                  <p className="text-xs text-background-500">
                                    productos
                                  </p>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Stock Bajo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className={user.role === "ADMIN" ? "w-full" : "w-full lg:col-span-2"}
          >
            <Card shadow="sm" radius="lg" className="w-full flex flex-col">
              <CardBody className="p-6 flex-1">
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex items-center justify-between flex-shrink-0">
                    <p className="text-lg font-bold">Alertas de Stock Bajo</p>
                    <AlertFilled className="size-5 text-warning-600" />
                  </div>

                  {stats.lowStockProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 text-center">
                      <CheckmarkCircleFilled className="size-12 text-success-600 mb-2" />
                      <p className="text-sm font-medium text-background-700">
                        ¡Todo en orden!
                      </p>
                      <p className="text-xs text-background-500">
                        No hay productos con stock bajo
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary">
                      {stats.lowStockProducts
                        .slice(0, 3)
                        .map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.6 + index * 0.05,
                            }}
                            className="w-full h-full"
                          >
                            <Card
                              shadow="none"
                              radius="lg"
                              isPressable
                              onPress={() => navigate("/App/Products")}
                              className="w-full bg-warning-50 dark:bg-warning-100/10 border border-warning-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
                            >
                              <CardBody className="p-4">
                                <div className="flex items-center justify-between gap-3 w-full">
                                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">
                                      {product.stockCatalogueName}
                                    </p>
                                    <p className="text-xs text-background-500 truncate">
                                      Lote: {product.lote}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <p className="text-lg font-bold text-warning-600">
                                      {product.cantidadTotal}
                                    </p>
                                    <p className="text-xs text-background-500">
                                      unidades
                                    </p>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          </motion.div>
                        ))}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Productos Recientes - Ocupa todo el ancho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="w-full"
        >
          <Card shadow="sm" radius="lg">
            <CardBody className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">Productos Recientes</p>
                  <BoxMultipleFilled className="size-5 text-background-500" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                  {stats.recentProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                      className="w-full h-full"
                    >
                      <Card
                        shadow="sm"
                        radius="lg"
                        isPressable
                        onPress={() => navigate("/App/Products")}
                        className="bg-background-100 dark:bg-background-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer w-full h-full"
                      >
                        <CardBody className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-2 min-w-0">
                              <p className="text-sm font-medium line-clamp-2">
                                {product.stockCatalogueName}
                              </p>
                              <div className="flex flex-col gap-1">
                                <p className="text-xs text-background-500 truncate">
                                  <span className="font-medium">Lote:</span>{" "}
                                  {product.lote}
                                </p>
                                <p className="text-xs text-background-500 truncate">
                                  <span className="font-medium">Stock:</span>{" "}
                                  {product.cantidadSobrante} unidades
                                </p>
                              </div>
                            </div>

                            <div
                              className={`p-3 rounded-lg ${getStatusColor(
                                product.productStatusName
                              ).replace("text-", "bg-")}/10`}
                            >
                              <p
                                className={`text-xs font-bold ${getStatusColor(
                                  product.productStatusName
                                )}`}
                              >
                                {product.productStatusName}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
