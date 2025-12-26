import { addToast, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, Form, Input, Textarea, useDisclosure } from "@heroui/react"
import { CloseButton } from "../CloseButton"
import { ArrowHookUpRightFilled, CheckmarkFilled, DismissCircleFilled, DismissFilled, TextAsteriskFilled } from "@fluentui/react-icons"
import { useEffect, useState } from "react"
import { noSpaces, required } from "../../js/validators"
import { WarehouseTypesModal } from "./WarehouseTypesModal"
import { formatDateLiteral } from "../../js/utils"

export const WarehouseTypesDrawer = ({isOpen, onOpenChange, data, action, onRefresh}) => {
    const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure()

    const [isLoading, setIsLoading] = useState(false)

    const [warehouseType, setWarehouseType] = useState({
        id: data?.id || "",
        name: data?.name || "",
        code: data?.code || "",
        description: data?.description || "",
    })

    const [warehouseTypeErrors, setWarehouseTypeErrors] = useState({ 
        name: [],
        code: [],
        description: [],
    })

    useEffect(() => {
        setWarehouseType({
            id: data?.id || "",
            name: data?.name || "",
            code: data?.code || "",
            description: data?.description || "",
        })

        setWarehouseTypeErrors({
            name: [],
            code: [],
            description: [],
        })
    }, [data, action])

    const resetForm = () => {
        setWarehouseType({ id:"", name:"", code:"", description:"" })
        setWarehouseTypeErrors({ name:[], code:[], description:[] })
    }

    const validators = {
        name: [required],
        code: [required, noSpaces],
        description: [],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChange = (field, value) => {
        setWarehouseType(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setWarehouseTypeErrors(prev => ({ ...prev, [field]: errs }))
    }

    let title
    let description

    switch (action) {
        case "create":
            title = "Registrar tipo de almacén"
            description = "Ingrese la información solicitada para poder registrar un nuevo tipo de almacén."
            break
        case "update":
            title = "Actualizar tipo de almacén"
            description = "Edite la información necesaria y guarde los cambios para actualizar el tipo de almacén."
            break
        default:
            title = "Detalles del tipo de almacén"
            description = "Revise la información completa del tipo. Esta vista es solo de lectura."
            break
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))

        const formData = action !== "create"
            ? { id: warehouseType.id, ...formEntries }
            : { ...formEntries }

        const nameErrs = runValidators(formData.name, validators.name)
        const codeErrs = runValidators(formData.code, validators.code)

        if (nameErrs.length > 0 || codeErrs.length > 0) {
            setWarehouseTypeErrors({
                name: nameErrs,
                code: codeErrs,
                description: [],
            })
            addToast({
                title: "Atención",
                description: "Por favor corrija los errores en el formulario.",
                color: "warning",
                icon: <DismissCircleFilled className="size-5"/>
            })
            return
        }

        setWarehouseTypeErrors({ name: [], code: [], description: [] })
        setWarehouseType(formData)
        onModalOpen(true)
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
                            <Form onSubmit={onSubmit} id="warehouse-type-form" className={action === 'create' || action === 'update' ? "gap-6 flex flex-col" : "gap-6 flex flex-col pb-8"}>
                                {action !== "create" && data && (
                                    <div className="flex flex-col gap-4">
                                        <div className="pl-0.5 flex flex-col">
                                            <p className="text-sm"><span className="font-medium ">Fecha de creación: </span>{formatDateLiteral(data.createdAt, true)}</p>
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
                                            <p className="!text-background-500 text-xs font-normal">{warehouseType.name.length + " / 100"}</p>
                                        </div>
                                    }
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
                                    placeholder={action === "create" ? "Ingrese el nombre del tipo" : data?.name}
                                    value={warehouseType.name}
                                    onValueChange={(value) => handleInputChange('name', value)}
                                    isInvalid={warehouseTypeErrors.name.length > 0}
                                    endContent={warehouseTypeErrors.name.length === 0 && warehouseType.name ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : warehouseTypeErrors.name.length > 0 ? <DismissFilled className='size-4 text-danger' /> : null }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {warehouseTypeErrors.name.map((error, i) => (
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
                                                <p className="font-medium text-sm">Código</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{warehouseType.code.length + " / 10"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="code"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={10}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el código (Ej: MPS)" : data?.code}
                                    value={warehouseType.code}
                                    onValueChange={(value) => handleInputChange('code', value)}
                                    isInvalid={warehouseTypeErrors.code.length > 0}
                                    endContent={warehouseTypeErrors.code.length === 0 && warehouseType.code ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : warehouseTypeErrors.code.length > 0 ? <DismissFilled className='size-4 text-danger' /> : null }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {warehouseTypeErrors.code.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <Textarea
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Descripción</p>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{warehouseType.description.length + " / 500"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="description"
                                    labelPlacement="outside"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={500}
                                    minRows={3}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese la descripción del tipo (Opcional)" : data?.description || "Sin descripción"}
                                    value={warehouseType.description}
                                    onValueChange={(value) => handleInputChange('description', value)}
                                />
                            </Form>

                            {(action === 'create' || action === 'update') && (
                                <div className="w-full flex justify-end py-8 sm:gap-4 gap-2">
                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        form="warehouse-type-form"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        startContent={!isLoading && <ArrowHookUpRightFilled className="size-5"/>}
                                        isLoading={isLoading}
                                        isDisabled={warehouseType.name === "" || warehouseType.code === "" || warehouseTypeErrors.name.length > 0 || warehouseTypeErrors.code.length > 0}
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

            <WarehouseTypesModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} data={warehouseType} initialData={data} action={action} onRefresh={onRefresh} closeDrawer={() => {onOpenChange(false); resetForm()}}/>
        </>
    )
}
