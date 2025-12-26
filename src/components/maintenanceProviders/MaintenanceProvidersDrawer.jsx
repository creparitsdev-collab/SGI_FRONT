import { addToast, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, Form, Input, InputOtp, Select, SelectItem, useDisclosure } from "@heroui/react"
import { CloseButton } from "../CloseButton"
import { ArrowHookUpRightFilled, CheckmarkFilled, ChevronDownFilled, CircleFilled, DismissCircleFilled, DismissFilled, PersonAvailableFilled, PersonSubtractFilled, TextAsteriskFilled } from "@fluentui/react-icons"
import { useEffect, useState } from "react"
import { noSpaces, onlyLetters, required, validEmail, validPhone, } from "../../js/validators"
import { SecondaryButton } from "../SecondaryButton"
import { formatDateLiteral } from "../../js/utils"
import { getMaintenanceProviders } from "../../service/maintenanceProvider"
import { MaintenanceProvidersModal } from "./MaintenanceProvidersModal"
import { MaintenanceProvidersChangeStatusModal } from "./MaintenanceProvidersChangeStatusModal"

export const MaintenanceProvidersDrawer = ({isOpen, onOpenChange, data, action, onRefresh}) => {
    const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure()
    const {isOpen: isModalCSOpen, onOpen: onModalCSOpen, onOpenChange: onModalCSOpenChange} = useDisclosure()
    
    const [isLoading, setIsLoading] = useState(false)

    const [maintenanceProvider, setMaintenanceProvider] = useState({
        id: data?.id || "",
        name: data?.name || "",
        email: data?.email || "",
        nif: data?.nif || "",
        phone: data?.phone || "",
        address: data?.address || ""
    })

    const [maintenanceProviderErrors, setMaintenanceProviderErrors] = useState({ 
        name: [],
        email: [],
        nif: [],
        phone: [],
        address: []
    })

    useEffect(() => {
        setMaintenanceProvider({
            id: data?.id || "",
            name: data?.name || "",
            email: data?.email || "",
            nif: data?.nif || "",
            phone: data?.phone || "",
            address: data?.address || ""
        })

        setMaintenanceProviderErrors({
            name: [],
            email: [],
            nif: [],
            phone: [],
            address: []
        })
    }, [data, action]);

    const resetForm = () => {
        setMaintenanceProvider({ id:"", name:"", email:"", nif:"", phone:"", address:"" })
        setMaintenanceProviderErrors({ name:[], email:[], nif:[], phone:[], address:[] })
    }

    const validators = {
        name: [required, onlyLetters],
        email: [validEmail],
        nif: [required, noSpaces],
        phone: [validPhone],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChange = (field, value) => {
        setMaintenanceProvider(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setMaintenanceProviderErrors(prev => ({ ...prev, [field]: errs }))
    }

    let title
    let description

    switch (action) {
        case "create":
            title = "Registrar proveedor de servicio"
            description = "Ingrese la información solicitada para poder registrar un nuevo proveedor de servicio."
            break
        case "update":
            title = "Actualizar proveedor de servicio"
            description = "Edite la información necesaria y guarde los cambios para actualizar el proveedor de servicio."
            break
        default:
            title = "Detalles del proveedor de servicio"
            description = "Revise la información completa del proveedor de servicio. Esta vista es solo de lectura."
            break
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))
        
        const formData = action !== "create"
            ? { id: maintenanceProvider.id, ...formEntries }
            : { ...formEntries };

        try {
            setIsLoading(true)

            const response = await getMaintenanceProviders()
            const maintenanceProviders = response.data

            const exists = maintenanceProviders.find(u => u.email.toLowerCase() === formData.email.toLowerCase())
            const existsNIF = maintenanceProviders.find(u => u.nif.toLowerCase()   === formData.nif.toLowerCase())

            const newErrors = { name: [], email: [], nif: [], phone:[], address:[] }

            if (action === "create") {
                if (exists) newErrors.email.push("El correo electrónico ingresado ya está en uso.");
                if (existsNIF) newErrors.nif.push("El RFC ingresado ya está en uso.");
            }

            if (action === "update") {
                if (exists && exists.id !== formData.id) newErrors.email.push("El correo electrónico ingresado ya está en uso.")
                if (existsNIF && existsNIF.id !== formData.id) newErrors.nif.push("El RFC ingresado ya está en uso.")
            }

            if (newErrors.email.length > 0 || newErrors.nif.length > 0) {
                setMaintenanceProviderErrors(newErrors)

                addToast({
                    title: "Algunos datos ingresados no son correctos",
                    description: "Por favor, verifica que sean válidos",
                    color: "danger",
                    icon: <DismissCircleFilled className="size-5"/>
                })

                return
            }
        } catch (error) {
        console.log(error)
            addToast({
                title: `No se pudo verificar el correo ni el RFC. Intenta de nuevo.`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
            return
        } finally {
            setIsLoading(false)
        }

        setMaintenanceProviderErrors({ name: [], email: [], nif: [], phone:[], address:[] });
        setMaintenanceProvider(formData)
        onModalOpen()
    }

    return (
        <>
            <Drawer
                hideCloseButton
                size="sm"
                radius="sm"
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                classNames={{wrapper: "!h-[100dvh]", backdrop: "bg-black/30"}}
                motionProps={{ 
                    variants: {
                        enter: {
                            x: 0,
                            opacity: 1,
                            transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }
                        },
                        exit: {
                            x: 100,
                            opacity: 0,
                            transition: {
                                duration: 0.3,
                                ease: "easeIn"
                            }
                        }
                    }
                }}
            >
                <DrawerContent className="bg-background">
                    {(onClose) => (
                        <>
                        <DrawerHeader className="flex flex-col gap-2 pb-8">
                            <div className="w-full flex justify-between pt-4 pb-2">
                                <p className="text-lg font-bold">{title}</p>
                                <CloseButton onPress={onClose}/>     
                            </div>
                            <p className="text-sm font-normal">{description}</p>
                        </DrawerHeader>
                        <DrawerBody className="h-full flex flex-col justify-between [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary">
                            <Form onSubmit={onSubmit} id="maintenanceProvider-form" className={action === 'create' || action === 'update' ? "gap-6 flex flex-col" : "gap-6 flex flex-col pb-8"}>
                                {action !== "create" && (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-1 pl-0.5">
                                            <p className="font-medium text-sm">Status: </p>
                                            <CircleFilled className={`size-2 ${data.status === "activo" ? "text-primary" : "text-background-500"}`} />
                                            <p className={`text-sm capitalize ${data.status === "activo" ? "text-primary" : "text-background-500"}`}>{data.status}</p>
                                        </div>

                                        <div className="pl-0.5 flex flex-col">
                                            <p className="text-sm"><span className="font-medium ">Fecha de modificación: </span>{formatDateLiteral(data.lastModification, true)}</p>
                                        </div>
                                    </div>
                                )}
                          
                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Nombre</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{maintenanceProvider.name.length + " / 100"}</p>
                                        </div>
                                    }
                                    autoComplete="given-name"
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="name"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={100}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el nombre del proveedor de servicio" : data.name}
                                    value={maintenanceProvider.name}
                                    onValueChange={(value) => handleInputChange('name', value)}
                                    isInvalid={maintenanceProviderErrors.name.length > 0}
                                    endContent={maintenanceProviderErrors.name.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {maintenanceProviderErrors.name.map((error, i) => (
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
                                                <p className="font-medium text-sm">Correo electrónico</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{maintenanceProvider.email.length + " / 50"}</p>
                                        </div>
                                    }
                                    autoComplete="email"
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="email"
                                    labelPlacement="outside"
                                    type="email"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={50}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el correo electrónico del proveedor de servicio" : data.email}
                                    value={maintenanceProvider.email}
                                    onValueChange={(value) => handleInputChange('email', value)}
                                    isInvalid={maintenanceProviderErrors.email.length > 0}
                                    endContent={maintenanceProviderErrors.email.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {maintenanceProviderErrors.email.map((error, i) => (
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
                                                <p className="font-medium text-sm">RFC</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{maintenanceProvider.nif.length + " / 13"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="nif"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={13}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el RFC del proveedor de servicio" : data.nif}
                                    value={maintenanceProvider.nif}
                                    onValueChange={(value) => handleInputChange('nif', value)}
                                    isInvalid={maintenanceProviderErrors.nif.length > 0}
                                    endContent={maintenanceProviderErrors.nif.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {maintenanceProviderErrors.nif.map((error, i) => (
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
                                                <p className="font-medium text-sm">Dirección</p>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{maintenanceProvider.address.length + " / 255"}</p>
                                        </div>
                                    }
                                    autoComplete="street-address"
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="address"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={100}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese la dirección del proveedor de servicio" : (data.address === "" ? " " : data.address)}
                                    value={maintenanceProvider.address}
                                    onValueChange={(value) => handleInputChange('address', value)}
                                    isInvalid={maintenanceProviderErrors.address.length > 0}
                                    endContent={maintenanceProviderErrors.address.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {maintenanceProviderErrors.address.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Teléfono</p>
                                    </div>
                                    <p className="!text-background-500 text-xs font-normal pr-2.5">{maintenanceProvider.phone.length + " / 10"}</p>
                                </div>
                                <InputOtp
                                    autoComplete="tel"
                                    variant="bordered"
                                    color="primary"
                                    classNames={{segment: "w-full min-w-0 rounded-lg bg-background-100 text-current border-background-100", segmentWrapper: "w-full", base: "w-full data-[invalid=true]:animate-shake"}}
                                    className="-mt-6"
                                    name="phone"
                                    length={10} 
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action !== "create" ? data.phone : undefined}
                                    value={maintenanceProvider.phone}
                                    onValueChange={(value) => handleInputChange('phone', value)}
                                    isInvalid={maintenanceProviderErrors.phone.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {maintenanceProviderErrors.phone.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />
                            </Form>

                            {(action === 'create' || action === 'update') && (
                                <div className="w-full flex justify-end py-8 sm:gap-4 gap-2">
                                    {action === "update" && (
                                        <SecondaryButton
                                            label={data.status === "activo" ? "Inhabilitar" : "Habilitar"}
                                            startContent={data.status === "activo" ? <PersonSubtractFilled className="size-5"/> : <PersonAvailableFilled className="size-5"/>}
                                            onPress={onModalCSOpen}
                                        />
                                    )}

                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        form="maintenanceProvider-form"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        startContent={!isLoading && <ArrowHookUpRightFilled className="size-5"/>}
                                        isLoading={isLoading}
                                        isDisabled={maintenanceProvider.name === "" || maintenanceProvider.email === "" || maintenanceProvider.nif === "" || maintenanceProviderErrors.name.length > 0 || maintenanceProviderErrors.email.length > 0 || maintenanceProviderErrors.nif.length > 0 || maintenanceProviderErrors.phone.length > 0 }
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

            <MaintenanceProvidersChangeStatusModal isOpen={isModalCSOpen} onOpenChange={onModalCSOpenChange} data={data} onRefresh={onRefresh}/>
            <MaintenanceProvidersModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} data={maintenanceProvider} initialData={data} action={action} onRefresh={onRefresh} closeDrawer={() => {onOpenChange(false); resetForm()}}/>
        </>
    )
}