import {
  AlertFilled,
  ArrowSyncCheckmarkFilled,
  ArrowSyncCircleFilled,
  BookQuestionMarkFilled,
  BuildingPeopleFilled,
  CheckmarkCircleFilled,
  ClockBillFilled,
  DatabaseSearchFilled,
  DataLineFilled,
  Dismiss12Filled,
  DismissCircleFilled,
  DismissFilled,
  DockFilled,
  DocumentBulletListClockFilled,
  DocumentMultipleFilled,
  DocumentTextClockFilled,
  DoorArrowLeftFilled,
  EditFilled,
  EmojiHandFilled,
  EmojiSadFilled,
  EyeFilled,
  EyeOffFilled,
  InfoFilled,
  InfoSparkleFilled,
  KeyMultipleFilled,
  KeyResetFilled,
  MoreCircleFilled,
  MoreHorizontalFilled,
  PeopleFilled,
  PeopleListFilled,
  PeopleSettingsFilled,
  PeopleStarFilled,
  PeopleToolboxFilled,
  PersonArrowLeftFilled,
  PersonBriefcaseFilled,
  PersonFilled,
  PersonHeartFilled,
  PersonSearchFilled,
  PersonSettingsFilled,
  PersonSquareFilled,
  PersonWrenchFilled,
  ScriptFilled,
  SearchFilled,
  SearchSparkleFilled,
  SettingsCogMultipleFilled,
  SettingsFilled,
  TagFilled,
  TextAsterisk16Filled,
  TextBulletListFilled,
  WeatherMoonFilled,
  WeatherSunnyFilled,
  WrenchSettingsFilled,
  BoxFilled,
  BoxMultipleFilled,
  GridFilled,
} from "@fluentui/react-icons";
import {
  Bars3Icon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  useIsIconOnly,
  useIsIconOnlySmallMedium,
} from "../hooks/useIsIconOnly";
import {
  addToast,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Form,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
  Spinner,
  useDisclosure,
  useDraggable,
  User,
} from "@heroui/react";
import { SidebarButton } from "../components/SidebarButton";
import { BottomButton } from "../components/BottomButton";
import { useTheme } from "@heroui/use-theme";
import { useEffect, useRef, useState } from "react";
import { CloseButton } from "../components/CloseButton";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../hooks/useAuth";
import { changePassword, getProfile } from "../service/user";
import { motion } from "framer-motion";
import { useTour } from "@reactour/tour";
import { SecondaryButton } from "../components/SecondaryButton";
import { Profile } from "../pages/Profile";
import { Notifications } from "../pages/Notifications";

export const UserProfile = ({ user, onRefresh }) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isNOpen, setIsNOpen] = useState(false);
  const [isPOpen, setIsPOpen] = useState(false);
  const [isCPOpen, setIsCPOpen] = useState(false);
  const [isCPLoading, setIsCPLoading] = useState(false);

  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isCPOpen });

  const [cPErrors, setCPErrors] = useState({});

  const [isVisible, setIsVisible] = useState(false);
  const [isNewPVisible, setIsNewPVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleNewPVisibility = () => setIsNewPVisible(!isNewPVisible);

  const tema = `Tema ${theme === "dark" ? "oscuro" : "claro"}`;

  let navigate = useNavigate();

  const onSubmitCP = async (e) => {
    e.preventDefault();

    const formEntries = Object.fromEntries(new FormData(e.currentTarget));

    try {
      setIsCPLoading(true);

      const response = await changePassword(formEntries);

      const success = response.type === "SUCCESS";

      addToast({
        title: success
          ? `Se actualizó su contraseña correctamente`
          : `No se actualizó su contraseña`,
        description: `Para ingresar nuevamente a la aplicación, use la contraseña nueva`,
        color: success ? "primary" : "danger",
        icon: success ? (
          <CheckmarkCircleFilled className="size-5" />
        ) : (
          <DismissCircleFilled className="size-5" />
        ),
      });

      if (success) {
        onRefresh();
      }
    } catch (error) {
      if (error.response.data.message == "Current password is incorrect") {
        addToast({
          title: `No se actualizó su contraseña`,
          description:
            "La contraseña actual es incorrecta. Por favor, verifique que sea válida",
          color: "danger",
          icon: <DismissCircleFilled className="size-5" />,
        });
        setCPErrors({
          currentPassword: "Contraseña incorrecta. Vuelva a intentarlo",
        });
      } else {
        addToast({
          title: `No se actualizó su contraseña`,
          description: error.response.data.message,
          color: "danger",
          icon: <DismissCircleFilled className="size-5" />,
        });
      }
    } finally {
      setIsCPLoading(false);
    }
  };

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.<>?])[A-Za-z0-9!@#$%^&*()_+\-=[\]{}|;:,.<>?]{8,}$/;

  return (
    <>
      <Dropdown
        placement="bottom"
        className="bg-background dark:bg-background-200 shadow-large w-44 transition-colors duration-1000 ease-in-out"
        shadow="lg"
        radius="sm"
      >
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              size: "md",
              radius: "sm",
              name: user.name
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase(),
              className:
                "bg-background-100 transition-colors duration-1000 ease-in-out",
              classNames: { name: "text-base font-medium" },
            }}
            classNames={{
              name: "text-base font-medium hidden lg:flex",
              description: "text-xs text-background-500 hidden lg:flex",
            }}
            className="transition-transform gap-0 lg:gap-2"
            description={user.email}
            name={user.name}
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User Actions"
          variant="light"
          itemClasses={{ base: "mt-1 mb-2" }}
        >
          <DropdownSection
            title="Opciones"
            classNames={{ heading: "text-background-500 font-normal" }}
          >
            <DropdownItem
              className="rounded-md transition-all !duration-1000 ease-in-out "
              key="profile"
              startContent={<PersonFilled className="size-5" />}
              onPress={() => setIsPOpen(true)}
            >
              Mi perfil
            </DropdownItem>

            <DropdownItem
              className="rounded-md transition-all !duration-1000 ease-in-out "
              key="notifications"
              startContent={<AlertFilled className="size-5" />}
              onPress={() => setIsNOpen(true)}
            >
              Mis notificaciones
            </DropdownItem>

            <DropdownItem
              className="rounded-md transition-all !duration-1000 ease-in-out "
              key="password"
              startContent={<KeyMultipleFilled className="size-5" />}
              onPress={() => setIsCPOpen(true)}
            >
              Cambiar contraseña
            </DropdownItem>

            <DropdownItem
              className="rounded-md transition-all !duration-1000 ease-in-out "
              key="theme"
              startContent={
                theme === "dark" ? (
                  <WeatherMoonFilled className="size-5 text-current" />
                ) : (
                  <WeatherSunnyFilled className="size-5 text-current" />
                )
              }
              onPress={() => {
                theme === "dark" ? setTheme("light") : setTheme("dark");
              }}
            >
              {tema}
            </DropdownItem>

            <DropdownItem
              className="rounded-md transition-all !duration-1000 ease-in-out -mb-1"
              key="logout"
              color="primary"
              startContent={<DoorArrowLeftFilled className="size-5" />}
              onPress={() => setIsOpen(true)}
            >
              Cerrar sesión
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <LogOutModal isOpen={isOpen} onOpenChange={setIsOpen} />
      <Profile isOpen={isPOpen} onOpenChange={setIsPOpen} />
      <Notifications isOpen={isNOpen} onOpenChange={setIsNOpen} />

      <Modal
        hideCloseButton
        size="md"
        radius="lg"
        className="my-0"
        isDismissable={false}
        isOpen={isCPOpen}
        onOpenChange={setIsCPOpen}
        classNames={{ wrapper: "overflow-hidden" }}
        ref={targetRef}
        backdrop="blur"
      >
        <ModalContent className="bg-background">
          {(onClose) => (
            <>
              <ModalHeader
                {...moveProps}
                className="flex flex-col gap-2 pb-4 pt-4"
              >
                <div className="w-full flex justify-end">
                  <CloseButton
                    onPress={() => {
                      onClose();
                      setCPErrors({});
                    }}
                  />
                </div>
                <p className="text-lg font-bold text-center">
                  Cambiar contraseña
                </p>
              </ModalHeader>
              <ModalBody className="py-0 gap-0">
                <p className="text-sm font-normal pb-6 text-center">
                  Ingrese su contraseña actual y la nueva contraseña para poder
                  actualizar su contraseña
                </p>
                <Form
                  onSubmit={onSubmitCP}
                  id="cp-form"
                  className="gap-6 flex flex-col"
                  validationErrors={cPErrors}
                >
                  <Input
                    label={
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          <p>Contraseña actual</p>
                          <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                        </div>
                      </div>
                    }
                    classNames={{
                      label: "w-full font-medium !text-current",
                      input:
                        "group-data-[invalid=true]:!text-current font-medium",
                      mainWrapper: "group-data-[invalid=true]:animate-shake",
                      inputWrapper:
                        "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current",
                    }}
                    className="w-full"
                    color="primary"
                    name="currentPassword"
                    autoComplete="current-password"
                    labelPlacement="outside"
                    type={isVisible ? "text" : "password"}
                    radius="sm"
                    size="md"
                    variant="bordered"
                    placeholder="Ingrese su contraseña actual"
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeOffFilled className="size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger" />
                        ) : (
                          <EyeFilled className="size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger" />
                        )}
                      </button>
                    }
                    validate={(value) => {
                      if (value.length === 0) {
                        return "El campo es obligatorio.";
                      }
                    }}
                  />

                  <Input
                    label={
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          <p>Nueva contraseña</p>
                          <TextAsterisk16Filled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger" />
                        </div>
                      </div>
                    }
                    classNames={{
                      label: "w-full font-medium !text-current",
                      input:
                        "group-data-[invalid=true]:!text-current font-medium",
                      mainWrapper: "group-data-[invalid=true]:animate-shake",
                      inputWrapper:
                        "caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-background-100 text-current",
                    }}
                    className="w-full"
                    color="primary"
                    name="newPassword"
                    autoComplete="new-password"
                    labelPlacement="outside"
                    type={isNewPVisible ? "text" : "password"}
                    radius="sm"
                    size="md"
                    variant="bordered"
                    placeholder="Ingrese la nueva contraseña"
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleNewPVisibility}
                      >
                        {isNewPVisible ? (
                          <EyeOffFilled className="size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger" />
                        ) : (
                          <EyeFilled className="size-5 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:text-danger" />
                        )}
                      </button>
                    }
                    description="La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula y un carácter especial."
                    validate={(value) => {
                      if (!passwordRegex.test(value)) {
                        return "La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula y un carácter especial.";
                      }
                    }}
                  />
                </Form>
              </ModalBody>
              <ModalFooter className="flex justify-center pt-4 pb-8 sm:gap-4 gap-2">
                <Button
                  className="bg-transparent dark:bg-background-100"
                  radius="sm"
                  startContent={<DismissFilled className="size-5" />}
                  onPress={() => {
                    onClose();
                    setCPErrors({});
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                  form="cp-form"
                  radius="sm"
                  variant="shadow"
                  color="primary"
                  type="submit"
                  startContent={
                    !isCPLoading && <EditFilled className="size-5" />
                  }
                  isLoading={isCPLoading}
                >
                  Actualizar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export const AppLayout = () => {
  let navigate = useNavigate();
  const { setIsOpen: setIsOpenT } = useTour();
  const { user } = useAuth();
  const isIconOnly = useIsIconOnly();
  const isIconOnlySm = useIsIconOnlySmallMedium();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [profile, setProfile] = useState({});
  const [errors, setErrors] = useState([]);

  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const triggerRefresh = () => setRefreshTrigger((prev) => !prev);

  useEffect(() => {
    const handlePop = () => setSearchValue("");
    const handleClearSearch = () => setSearchValue("");

    window.addEventListener("popstate", handlePop);
    window.addEventListener("clearSearch", handleClearSearch);

    return () => {
      window.removeEventListener("popstate", handlePop);
      window.removeEventListener("clearSearch", handleClearSearch);
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);

        const response = await getProfile();
        const data = response.data;

        if (data) {
          setProfile(data);
          setIsLoading(false);
        } else {
          addToast({
            title: "No se pudo obtener el perfil",
            description: "Ocurrió un error al obtener el perfil",
            color: "danger",
            icon: <DismissCircleFilled className="size-5" />,
          });
          setErrors((prev) => [...prev, "No se pudo obtener el perfil"]);
          setIsLoading(false);
        }
      } catch (err) {
        setErrors((prev) => [...prev, err.message]);
        setIsLoading(false);
      }
    };
    fetchProfile();

    const handleProfileUpdated = () => {
      fetchProfile();
    };
    window.addEventListener("profileUpdated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, [user, refreshTrigger]);

  const navigation = [
    {
      label: "Dashboard",
      icon: <GridFilled className="sm:size-5 size-6" />,
      path: "/App",
    },
    {
      label: "Catálogos",
      icon: <BoxMultipleFilled className="sm:size-5 size-6" />,
      path: "/App/StockCatalogues",
    },
    {
      label: "Productos",
      icon: <BoxFilled className="sm:size-5 size-6" />,
      path: "/App/Products",
    },
  ];

  /* {
            label: "Equipos",
            icon: <SettingsCogMultipleFilled className='sm:size-5 size-6' />,
            path: "/App/Equipments"
        },
        {
            label: "Servicios",
            icon: <WrenchSettingsFilled className='sm:size-5 size-6' />,
            path: "/App/Services"
        }, */

  const adminNavigation = [
    ...navigation,
    {
      label: "Unidades de medida",
      icon: <TagFilled className="sm:size-5 size-6" />,
      path: "/App/UnitsOfMeasurement",
    },
    {
      label: "Tipos de almacén",
      icon: <DockFilled className="sm:size-5 size-6" />,
      path: "/App/WarehouseTypes",
    },
    {
      label: "Estados",
      icon: <CheckmarkCircleFilled className="sm:size-5 size-6" />,
      path: "/App/ProductStatuses",
    },
    {
      label: "Logs",
      icon: <ScriptFilled className="sm:size-5 size-6" />,
      path: "/App/Logs",
    },
    {
      label: "Usuarios",
      icon: <PeopleFilled className="sm:size-5 size-6" />,
      path: "/App/Users",
    },
    /* {
            label: "Clientes",
            icon: <PeopleToolboxFilled className='sm:size-5 size-6' />,
            path: "/App/Customers"
        },
        {
            label: "Proveedores de servicio",
            icon: <PersonWrenchFilled className='size-5' />,
            path: "/App/ServiceProviders"
        } */
  ];

  const operadorNavigation = [...navigation];

  const supervisorNavigation = [...navigation];

  let roleSidebarNavigation;

  switch (user.role) {
    case "ADMIN":
      roleSidebarNavigation = adminNavigation;
      break;
    case "SUPERVISOR":
      roleSidebarNavigation = supervisorNavigation;
      break;
    case "OPERADOR":
      roleSidebarNavigation = operadorNavigation;
      break;

    default:
      roleSidebarNavigation = [];
  }

  const getIsActive = (path) => {
    if (path === "/App") {
      return location.pathname === path;
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="flex w-screen h-screen justify-center items-center">
          <Spinner
            classNames={{ label: "pt-2 text-sm" }}
            color="current"
            size="md"
            label="Espere un poco por favor"
          />
        </div>
      ) : errors.length > 0 ? ( //space-y-4
        <div className="flex h-screen w-full justify-center items-center">
          <div className="flex flex-col gap-5 max-w-[450px] px-6 sm:px-0">
            <EmojiSadFilled className="size-12" />

            <p className="text-lg sm:text-xl">
              Algo ha ido mal al iniciar la aplicación
            </p>
            <p className="text-sm sm:text-base">
              Actualice la aplicación para intentar solucionar el problema. Si
              el problema persiste, comuniquelo con algún administrador
            </p>

            <div className="flex justify-end pt-3">
              <PrimaryButton
                label="Actualizar aplicación"
                startContent={<ArrowSyncCircleFilled className="size-5" />}
                onPress={() => window.location.reload(true)}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* PANTALLA */}
          <div className="flex flex-col w-screen h-dvh bg-background transition-colors duration-1000 ease-in-out sm:p-4 sm:gap-4 overflow-hidden">
            {/* NAVBAR */}
            <div className="flex-shrink-0 h-[72px] bg-background rounded-lg transition-colors duration-1000 ease-in-out flex sm:z-auto z-50 dark:shadow-large shadow-medium">
              <div className="px-4 justify-center w-96 hidden sm:flex flex-col">
                <p className="text-base font-medium">
                  SGI - Sistema de gestión de inventario
                </p>
                <p className="text-xs text-background-500">
                  Creparis S.A de C.V.
                </p>
              </div>

              <div className="px-4 flex w-full justify-end items-center sm:gap-4 gap-2">
                <Button
                  className={`bg-background-100 transition-background !duration-1000 ease-in-out sm:hidden ${
                    isIconOnlySm ? "n1" : ""
                  }`}
                  isIconOnly
                  radius="sm"
                  onPress={() => setIsDrawerOpen(true)}
                >
                  <Bars3Icon className="size-5" />
                </Button>
                <Input
                  classNames={{
                    input:
                      "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",
                    mainWrapper: "group-data-[invalid=true]:animate-shake",
                    inputWrapper:
                      "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current",
                  }}
                  className="grow sm:max-w-72 n6"
                  color="primary"
                  name="search"
                  labelPlacement="inside"
                  type="text"
                  radius="sm"
                  size="md"
                  variant="bordered"
                  maxLength={100}
                  value={searchValue}
                  onValueChange={(val) => {
                    setSearchValue(val);
                  }}
                  isClearable
                  placeholder={
                    location.pathname === "/App/Services"
                      ? "Buscar resultados por código"
                      : location.pathname === "/App/Logs"
                      ? "Buscar resultados por usuario"
                      : "Buscar resultados por nombre"
                  }
                  endContent={
                    <div className="w-full h-full flex items-center justify-center">
                      <DismissFilled className="size-5 group-data-[focus=true]:text-primary" />
                    </div>
                  }
                />
                <UserProfile user={profile} onRefresh={triggerRefresh} />
              </div>
            </div>

            <div className="flex flex-1 min-h-0 bg-transparent gap-4">
              {/* SIDEBAR */}
              <div
                className="flex-shrink-0 flex-col lg:w-52 w-28 hidden sm:flex h-full transition-colors duration-1000 ease-in-out bg-background rounded-lg overflow-y-auto overflow-x-hidden dark:shadow-large shadow-medium n1
                                [&::-webkit-scrollbar]:w-1
                                [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-transparent"
              >
                <div className="flex-shrink-0 lg:px-4 w-full lg:items-start items-center flex flex-col pt-4 gap-1">
                  <p className="text-lg hidden lg:flex font-bold">Dashboard</p>
                  <p className="text-sm hidden lg:flex text-background-500">
                    Bienvenido de vuelta {profile.name}
                  </p>

                  <p className="text-xs text-background-500 hidden lg:flex pt-6">
                    Páginas
                  </p>
                  {roleSidebarNavigation.map(({ label, icon, path }) => (
                    <SidebarButton
                      isActive={getIsActive(path)}
                      key={label}
                      isIconOnly={isIconOnly}
                      label={label}
                      startContent={
                        <div className="size-5 flex items-center justify-center">
                          {icon}
                        </div>
                      }
                      onPress={() => {
                        navigate(path);
                        setSearchValue("");
                      }}
                    />
                  ))}
                  {/*
                                        <p className="text-xs text-background-500 hidden lg:flex pt-6">Módulos</p>
                                        <div className="hidden sm:flex lg:hidden px-2 w-full justify-center py-1">
                                            <div className="h-[1px] rounded-full w-20 bg-background-300"/>
                                        </div>
                                        <SidebarButton
                                            isActive={getIsActive("/App/Maintenance-Calibration")}
                                            isIconOnly={isIconOnly}
                                            label="Mantenimiento y calibración"
                                            startContent={<div className="size-5 flex items-center justify-center"><WrenchSettingsFilled className='size-5' /></div>}
                                            onPress={() => {navigate("/App/Maintenance-Calibration");}}
                                        />*/}
                </div>
                <ScrollShadow
                  className="flex-1 lg:pt-6 lg:pl-6
                                    [&::-webkit-scrollbar]:lg:w-2
                                    [&::-webkit-scrollbar]:w-1
                                    [&::-webkit-scrollbar-track]:rounded-full
                                    [&::-webkit-scrollbar-track]:bg-transparent
                                    [&::-webkit-scrollbar-thumb]:rounded-full
                                    [&::-webkit-scrollbar-thumb]:bg-background-300"
                >
                  <div className="w-full h-full lg:pr-6 lg:justify-normal justify-center flex">
                    {/**<p className="text-xs text-background-500 hidden lg:flex">Documentos</p> header */}
                    {/**Aqui se colocaran los documentos del usuario */}
                  </div>
                </ScrollShadow>
                <div className="flex-shrink-0 pb-4 lg:px-4 lg:items-start items-center flex flex-col gap-1">
                  <Button
                    className={`bg-background-100 transition-background !duration-1000 ease-in-out`}
                    isIconOnly={isIconOnly}
                    fullWidth
                    radius="sm"
                    onPress={() => setIsOpenT(true)}
                    startContent={
                      !isIconOnly && (
                        <BookQuestionMarkFilled className="size-5" />
                      )
                    }
                  >
                    {isIconOnly ? (
                      <BookQuestionMarkFilled className="size-5" />
                    ) : (
                      "¿Cómo empezar?"
                    )}
                  </Button>
                  <div className="w-full flex px-4 text-center">
                    <p className="text-xs font-medium lg:hidden line-clamp-2">
                      ¿Cómo empezar?
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col bg-transparent sm:gap-4 min-w-0">
                {/* CONTENIDO */}
                <div className="flex-1 transition-colors duration-1000 ease-in-out bg-background rounded-lg overflow-y-hidden dark:sm:shadow-large sm:shadow-medium">
                  <ScrollShadow
                    className="h-full bg-transparent pl-3 pt-4 sm:py-6 xs:pl-5
                                        [&::-webkit-scrollbar]:h-1
                                        [&::-webkit-scrollbar]:w-1
                                        [&::-webkit-scrollbar-track]:rounded-full
                                        [&::-webkit-scrollbar-track]:bg-transparent
                                        [&::-webkit-scrollbar-thumb]:rounded-full
                                        [&::-webkit-scrollbar-thumb]:bg-primary"
                  >
                    <div className="w-full h-full flex flex-col pr-3 xs:pr-5">
                      <Outlet
                        context={{
                          searchValue,
                          setSearchValue,
                          userName: profile.name,
                          id: profile.id,
                        }}
                      />
                    </div>
                  </ScrollShadow>
                </div>

                {/* BOTTOM NAVIGATION */}
                <div className="flex-shrink-0 flex justify-center h-16 bg-background sm:hidden rounded-lg z-50 gap-14 dark:shadow-large shadow-medium transition-colors duration-1000 ease-in-out">
                  {roleSidebarNavigation.map(({ label, icon, path }) => (
                    <BottomButton
                      isActive={getIsActive(path)}
                      key={label}
                      label={label}
                      centerContent={icon}
                      onPress={() => {
                        navigate(path);
                        setSearchValue("");
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <LogOutModal isOpen={isOpen} onOpenChange={setIsOpen} />

      <Drawer
        hideCloseButton
        size="xs"
        className="w-[272px]"
        radius="sm"
        placement="left"
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        classNames={{ wrapper: "!h-[100dvh]" }}
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
              x: -100,
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <DrawerContent className="bg-background px-2">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-2 pb-0">
                <div className="w-full flex justify-between pt-4">
                  <p className="text-lg font-bold">
                    Bienvenido de vuelta{" "}
                    {profile.roleName === "ADMIN"
                      ? "administrador"
                      : profile.roleName.toLowerCase()}
                  </p>
                  <CloseButton onPress={onClose} />
                </div>
              </DrawerHeader>
              <DrawerBody className="h-full flex flex-col [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary">
                <p className="text-xs text-background-500 pt-6">Páginas</p>
                {roleSidebarNavigation.map(({ label, icon, path }) => (
                  <SidebarButton
                    isActive={getIsActive(path)}
                    isIconOnly={false}
                    key={label}
                    label={label}
                    startContent={icon}
                    onPress={() => {
                      navigate(path);
                      setSearchValue("");
                      onClose();
                    }}
                  />
                ))}
              </DrawerBody>
              <DrawerFooter>
                <Button
                  className={`bg-background-100 transition-background !duration-1000 ease-in-out`}
                  fullWidth
                  radius="sm"
                  onPress={() => {
                    onClose();
                    setIsOpenT(true);
                  }}
                  startContent={<BookQuestionMarkFilled className="size-5" />}
                >
                  ¿Cómo empezar?
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const LogOutModal = ({ isOpen, onOpenChange }) => {
  const { onClose } = useDisclosure();
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });
  let navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <Modal
        classNames={{ wrapper: "overflow-hidden" }}
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        ref={targetRef}
        hideCloseButton
        className="bg-background my-0"
        size="md"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader {...moveProps} className="flex flex-col gap-2">
                <div className="w-full flex justify-end">
                  <CloseButton onPress={onClose} />
                </div>
                <p className="text-lg font-bold text-center">
                  ¿Desea cerrar la sesión actual?
                </p>
              </ModalHeader>
              <ModalBody>
                <p className="text-center">
                  Está a punto de cerrar sesión, sin embargo, puede ingresar de
                  nuevo sin problema.
                </p>
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
                  label="Cerrar sesión"
                  startContent={<DoorArrowLeftFilled className="size-5" />}
                  onPress={handleLogout}
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
