import { Accordion, AccordionItem, addToast, Button, Card, CardBody, Checkbox, DatePicker, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Form, Input, InputOtp, NumberInput, Select, SelectItem, Spinner, Textarea, useDisclosure } from "@heroui/react"
import { CloseButton } from "../CloseButton"
import { AddCircleFilled, ArrowHookUpRightFilled, CalendarFilled, CheckmarkCircleFilled, CheckmarkFilled, ChevronDownFilled, CircleFilled, DeleteFilled, DismissCircleFilled, DismissFilled, PersonAvailableFilled, PersonSubtractFilled, SubtractCircleFilled, SubtractFilled, TextAsteriskFilled, WrenchScrewdriverFilled } from "@fluentui/react-icons"
import React, { useEffect, useState, useTransition } from "react"
import { required, requiredNumber, validateDatePicker } from "../../js/validators"
import { SecondaryButton } from "../SecondaryButton"
import { EquipmentsChangeStatusModal } from "./EquipmentsChangeStatusModal"
import { getEquipments } from "../../service/equipment"
import { EquipmentsModal } from "./EquipmentsModal"
import { formatDateLiteral } from "../../js/utils"
import { getMaintenanceTypes } from "../../service/maintenanceType"
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";

export const EquipmentsDrawer = ({isOpen, onOpenChange, data, action, onRefresh, users, categories, maintenanceProviders}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [isDrawerLoading, setIsDrawerLoading] = useState(false)
    
    const [errors, setErrors] = useState([])
    const [maintenances, setMaintenances] = useState([])
    const [maintenanceTypes, setMaintenanceTypes] = useState([])
    
    const [, startTransition] = useTransition()

    const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure()
    const {isOpen: isModalCSOpen, onOpen: onModalCSOpen, onOpenChange: onModalCSOpenChange} = useDisclosure()
    
    const [isLoading, setIsLoading] = useState(false)

    const [maintenance, setMaintenance] = useState({
        equipmentId: "00000000-0000-0000-0000-000000000000",
        maintenanceTypeId: "",
        responsibleUserId: "",
        description: "",
        priority: "",
        nextMaintenanceDate: null,
        frequencyValue: null,
        frequencyType: ""
    })

    const [maintenanceErrors, setMaintenanceErrors] = useState({ 
        maintenanceTypeId: [],
        responsibleUserId: [],
        description: [],
        priority: [],
        nextMaintenanceDate: [],
        frequencyValue: [],
        frequencyType: []
    })

    const [equipment, setEquipment] = useState({
        id: data?.id || "",
        name: data?.name || "",
        code: data?.code || "",
        serialNumber: data?.serialNumber || "",
        location: data?.location || "",
        brand: data?.brand || "",
        model: data?.model || "",
        remarks: data?.remarks || "",
        assignedToId: data?.assignedToId || "",
        equipmentCategoryId: data?.equipmentCategoryId || "",
        maintenanceProviderId: data?.maintenanceProviderId || "",
    })

    const [equipmentErrors, setEquipmentErrors] = useState({ 
        name: [],
        code: [],
        serialNumber: [],
        location: [],
        brand: [],
        model: [],
        remarks: [],
        assignedToId: [],
        equipmentCategoryId: [],
        maintenanceProviderId: [],
    })
    
    useEffect(() => {
        if (!isOpen) setIsDrawerOpen(false)
    }, [isOpen])
    
    useEffect(() => {
        setMaintenance({
            equipmentId: "00000000-0000-0000-0000-000000000000",
            maintenanceTypeId: "",
            responsibleUserId: "",
            description: "",
            priority: "",
            nextMaintenanceDate: null,
            frequencyValue: null,
            frequencyType: ""
        })

        setMaintenanceErrors({
            maintenanceTypeId: [],
            responsibleUserId: [],
            description: [],
            priority: [],
            nextMaintenanceDate: [],
            frequencyValue: [],
            frequencyType: []
        })

        setEquipment({
            id: data?.id || "",
            name: data?.name || "",
            code: data?.code || "",
            serialNumber: data?.serialNumber || "",
            location: data?.location || "",
            brand: data?.brand || "",
            model: data?.model || "",
            remarks: data?.remarks || "",
            assignedToId: data?.assignedToId || "",
            equipmentCategoryId: data?.equipmentCategoryId || "",
            maintenanceProviderId: data?.maintenanceProviderId || "",
        })

        setEquipmentErrors({
            name: [],
            code: [],
            serialNumber: [],
            location: [],
            brand: [],
            model: [],
            remarks: [],
            assignedToId: [],
            equipmentCategoryId: [],
            maintenanceProviderId: [],
        })

        setMaintenances([])
    }, [data, action]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsDrawerLoading(true)

                const maintenanceTypesResponse = await getMaintenanceTypes()

                const maintenanceTypesData = maintenanceTypesResponse.data
                
                if (maintenanceTypesData) {
                    startTransition(() => {
                        setMaintenanceTypes(maintenanceTypesData.filter(u  => u.status === true))
                        setIsDrawerLoading(false)
                    })
                } else {
                    addToast({
                        title: "No se pudieron obtener los datos",
                        description: "Ocurrió un error al obtener los datos",
                        color: "danger",
                        icon: <DismissCircleFilled className='size-5' />
                    })
                    startTransition(() => {
                        setErrors(prev => [...prev, "No se pudieron obtener los datos"])
                        setIsDrawerLoading(false)
                    })
                }
            } catch (err) {
                startTransition(() => {
                    setErrors(prev => [...prev, err.message])
                    setIsDrawerLoading(false)
                })
            }
        }
        fetchData()
    }, [])

    const resetForm = () => {
        setMaintenance({ equipmentId: "00000000-0000-0000-0000-000000000000", maintenanceTypeId: "", responsibleUserId: "", description: "", priority: "", nextMaintenanceDate: null, frequencyValue: null, frequencyType: "" })
        setMaintenanceErrors({ maintenanceTypeId: [], responsibleUserId: [], description: [], priority: [], nextMaintenanceDate: [], frequencyValue: [], frequencyType: [] })
        setEquipment({ id:"", name:"", code:"", serialNumber:"", location:"", brand:"", model:"", remarks:"", assignedToId:"", equipmentCategoryId:"", maintenanceProviderId:"" })
        setEquipmentErrors({ name:[], code:[], serialNumber:[], location:[], brand:[], model:[], remarks:[], assignedToId:[], equipmentCategoryId:[], maintenanceProviderId:[] })
        setMaintenances([])
        setIsSelected(false)
    }

    const maintenanceValidators = {
        maintenanceTypeId: [required],
        responsibleUserId: [required],
        priority: [required],
        nextMaintenanceDate: [validateDatePicker],
        frequencyValue: [requiredNumber],
        frequencyType: [required]
    }

    const validators = {
        name: [required],
        code: [required],
        serialNumber: [required],
        location: [required],
        brand: [required],
        model: [required],
        assignedToId: [required],
        equipmentCategoryId: [required],
        maintenanceProviderId: [required],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChangeMaintenance = (field, value) => {
        setMaintenance(prev => ({ ...prev, [field]: value }))

        const fns = maintenanceValidators[field] || []
        const errs = runValidators(value, fns)
        setMaintenanceErrors(prev => ({ ...prev, [field]: errs }))
    }

    const handleInputChange = (field, value) => {
        setEquipment(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setEquipmentErrors(prev => ({ ...prev, [field]: errs }))
    }

    let title
    let description

    switch (action) {
        case "create":
            title = "Registrar equipo"
            description = "Ingrese la información solicitada para poder registrar un nuevo equipo."
            break
        case "update":
            title = "Actualizar equipo"
            description = "Edite la información necesaria y guarde los cambios para actualizar el equipo."
            break
        default:
            title = "Detalles del equipo"
            description = "Revise la información completa del equipo. Esta vista es solo de lectura."
            break
    }

    const priorityLabels = {
        LOW:      'Baja',
        MEDIUM:   'Media',
        HIGH:     'Alta',
        CRITICAL: 'Crítica'
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))
        
        const formData = action !== "create"
            ? { id: equipment.id, ...formEntries }
            : { ...formEntries };

        try {
            setIsLoading(true)

            const response = await getEquipments()
            const equipments = response.data

            const exists = equipments.find(
                (u) => u.name.trim().toLowerCase() === formData.name.trim().toLowerCase()
            )
            
            if (exists && (action === "create" || exists.id !== formData.id)) {
                setEquipmentErrors((prev) => ({
                    ...prev,
                    name: ["El nombre ingresado ya está en uso."],
                }))
                addToast({
                    title: "El nombre ingresado ya está en uso.",
                    description: "Por favor, ingrese uno distinto.",
                    color: "danger",
                    icon: <DismissCircleFilled className="size-5"/>
                })
                return
            }
        } catch (error) {
            addToast({
                title: `No se pudo verificar el nombre. Intenta de nuevo.`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
            return
        } finally {
            setIsLoading(false)
        }

        setEquipmentErrors({ name:[], code:[], serialNumber:[], location:[], brand:[], model:[], remarks:[], assignedToId:[], equipmentCategoryId:[], maintenanceProviderId:[] })
        setEquipment(formData)
        onModalOpen()
    }

    const onSubmitWithMaintenances = async () => {
        try {
            setIsLoading(true)

            const response = await getEquipments()
            const equipments = response.data

            const exists = equipments.find(
                (u) => u.name.trim().toLowerCase() === equipment.name.trim().toLowerCase()
            )
            
            if (exists && (action === "create")) {
                setIsDrawerOpen(false)
                setEquipmentErrors((prev) => ({
                    ...prev,
                    name: ["El nombre ingresado ya está en uso."],
                }))
                addToast({
                    title: "El nombre ingresado ya está en uso.",
                    description: "Por favor, ingrese uno distinto.",
                    color: "danger",
                    icon: <DismissCircleFilled className="size-5"/>
                })
                return
            }
        } catch (error) {
            addToast({
                title: `No se pudo verificar el nombre del equipo. Intenta de nuevo.`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
            return
        } finally {
            setIsLoading(false)
        }

        setEquipmentErrors({ name:[], code:[], serialNumber:[], location:[], brand:[], model:[], remarks:[], assignedToId:[], equipmentCategoryId:[], maintenanceProviderId:[] })
        setMaintenanceErrors({ maintenanceTypeId: [], responsibleUserId: [], description: [], priority: [], nextMaintenanceDate: [], frequencyValue: [], frequencyType: [] })
        onModalOpen()
    }

    const handleAddMaintenance = () => {
        const newEntry = {
            ...maintenance,
            nextMaintenanceDate: maintenance.nextMaintenanceDate.toDate().toISOString() 
        }

        setMaintenances(prevItems => [
            ...prevItems, 
            newEntry  
        ])

        setMaintenance({
            equipmentId: "00000000-0000-0000-0000-000000000000", 
            maintenanceTypeId: "",
            responsibleUserId: "",
            description: "",
            priority: "",
            nextMaintenanceDate: null,
            frequencyValue: null,
            frequencyType: "",
        })

        setMaintenanceErrors({
            maintenanceTypeId: [],
            responsibleUserId: [],
            description: [],
            priority: [],
            nextMaintenanceDate: [],
            frequencyValue: [],
            frequencyType: []
        })
    }

    const handleRemoveMaintenance = (indexToRemove) => {
        setMaintenances(prev =>
            prev.filter((_, idx) => idx !== indexToRemove)
        )
    }

    const getFrequencyText = (type, value) => {
        if (!type || !value) return ""

        const units = {
            DAILY:   value > 1 ? "días"    : "día",
            WEEKLY:  value > 1 ? "semanas" : "semana",
            MONTHLY: value > 1 ? "meses"   : "mes",
            YEARLY:  value > 1 ? "años"    : "año",
        }

        const unit = units[type] || ""
        return `Cada: ${value} ${unit}`
    }

    const userMap = React.useMemo(() => {
        return Object.fromEntries(users.map(u => [u.id, u.name]))
    }, [users])

    const maintenanceTypeMap = React.useMemo(() => {
        return Object.fromEntries(maintenanceTypes.map(mt => [mt.id, mt.name]))
    }, [maintenanceTypes])

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
                            <Form onSubmit={onSubmit} id="equipment-form" className={action === 'create' || action === 'update' ? "gap-6 flex flex-col" : "gap-6 flex flex-col pb-8"}>
                                {action !== "create" && (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-1 pl-0.5">
                                            <p className="font-medium text-sm">Status: </p>
                                            <CircleFilled className={`size-2 ${data.status === "activo" ? "text-primary" : "text-background-500"}`} />
                                            <p className={`text-sm capitalize ${data.status === "activo" ? "text-primary" : "text-background-500"}`}>{data.status}</p>
                                        </div>

                                        <div className="pl-0.5 flex flex-col">
                                            <p className="text-sm"><span className="font-medium ">Fecha de modificación: </span>{formatDateLiteral(data.updatedAt, true)}</p>
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
                                            <p className="!text-background-500 text-xs font-normal">{equipment.name.length + " / 100"}</p>
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
                                    placeholder={action === "create" ? "Ingrese el nombre del equipo" : data.name}
                                    value={equipment.name}
                                    onValueChange={(value) => handleInputChange('name', value)}
                                    isInvalid={equipmentErrors.name.length > 0}
                                    endContent={equipmentErrors.name.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.name.map((error, i) => (
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
                                            <p className="!text-background-500 text-xs font-normal">{equipment.code.length + " / 10"}</p>
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
                                    placeholder={action === "create" ? "Ingrese el código del equipo" : data.code}
                                    value={equipment.code}
                                    onValueChange={(value) => handleInputChange('code', value)}
                                    isInvalid={equipmentErrors.code.length > 0}
                                    endContent={equipmentErrors.code.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.code.map((error, i) => (
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
                                                <p className="font-medium text-sm">Número de serie</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.serialNumber.length + " / 24"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="serialNumber"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={24}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el número de serie del equipo" : data.serialNumber}
                                    value={equipment.serialNumber}
                                    onValueChange={(value) => handleInputChange('serialNumber', value)}
                                    isInvalid={equipmentErrors.serialNumber.length > 0}
                                    endContent={equipmentErrors.serialNumber.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.serialNumber.map((error, i) => (
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
                                                <p className="font-medium text-sm">Locación</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.location.length + " / 255"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="location"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={255}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese la locación del equipo" : data.location}
                                    value={equipment.location}
                                    onValueChange={(value) => handleInputChange('location', value)}
                                    isInvalid={equipmentErrors.location.length > 0}
                                    endContent={equipmentErrors.location.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.location.map((error, i) => (
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
                                                <p className="font-medium text-sm">Marca</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.brand.length + " / 50"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="brand"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={50}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese la marca del equipo" : data.brand}
                                    value={equipment.brand}
                                    onValueChange={(value) => handleInputChange('brand', value)}
                                    isInvalid={equipmentErrors.brand.length > 0}
                                    endContent={equipmentErrors.brand.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.brand.map((error, i) => (
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
                                                <p className="font-medium text-sm">Modelo</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.model.length + " / 100"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="model"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={100}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el modelo del equipo" : data.model}
                                    value={equipment.model}
                                    onValueChange={(value) => handleInputChange('model', value)}
                                    isInvalid={equipmentErrors.model.length > 0}
                                    endContent={equipmentErrors.model.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.model.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Asignado a:</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Asignado a:"
                                    className="w-full -mt-4"
                                    name="assignedToId"
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    placeholder="Selecciona un usuario"
                                    radius="sm"
                                    selectedKeys={new Set([`${equipment.assignedToId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('assignedToId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={equipmentErrors.assignedToId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {equipmentErrors.assignedToId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {users.map((user) => (<SelectItem key={user.id}>{user.name}</SelectItem>))}
                                </Select>
                                
                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Categoría</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Categoría"
                                    className="w-full -mt-4"
                                    name="equipmentCategoryId"
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    placeholder="Selecciona una categoría"
                                    radius="sm"
                                    selectedKeys={new Set([`${equipment.equipmentCategoryId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('equipmentCategoryId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={equipmentErrors.equipmentCategoryId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {equipmentErrors.equipmentCategoryId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {categories.map((category) => (<SelectItem key={category.id}>{category.name}</SelectItem>))}
                                </Select>

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Proveedor de servicio</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Proveedor de servicio"
                                    className="w-full -mt-4"
                                    name="maintenanceProviderId"
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    placeholder="Selecciona un proveedor de servicio"
                                    radius="sm"
                                    selectedKeys={new Set([`${equipment.maintenanceProviderId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('maintenanceProviderId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={equipmentErrors.maintenanceProviderId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {equipmentErrors.maintenanceProviderId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {maintenanceProviders.map((maintenanceProvider) => (<SelectItem key={maintenanceProvider.id}>{maintenanceProvider.name}</SelectItem>))}
                                </Select>

                                <Textarea
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Observaciones</p>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{equipment.remarks.length + " / 1000"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="remarks"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={1000}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese las observaciones del equipo" : data.remarks}
                                    value={equipment.remarks}
                                    onValueChange={(value) => handleInputChange('remarks', value)}
                                    isInvalid={equipmentErrors.remarks.length > 0}
                                    endContent={equipmentErrors.remarks.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {equipmentErrors.remarks.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />
                            </Form>

                            {(action === 'create' || action === 'update') && (
                                <div className="w-full flex justify-end py-8 gap-4">
                                    {action === "update" && (
                                        <SecondaryButton
                                            label={data.status === "activo" ? "Inhabilitar" : "Habilitar"}
                                            startContent={data.status === "activo" ? <SubtractCircleFilled className="size-5"/> : <CheckmarkCircleFilled className="size-5"/>}
                                            onPress={onModalCSOpen}
                                        />
                                    )}
                                    {action === "create" && (
                                        <SecondaryButton
                                            label="Asignarle servicios"
                                            startContent={<WrenchScrewdriverFilled className="size-5"/>}
                                            onPress={() => setIsDrawerOpen(true)}
                                            isDisabled={equipment.name === "" || equipment.code === "" || equipment.serialNumber === "" || equipment.location === "" || equipment.brand === "" || equipment.model === "" || equipment.assignedToId === "" || equipment.equipmentCategoryId === "" || equipment.maintenanceProviderId === "" || equipmentErrors.name.length > 0 || equipmentErrors.code.length > 0 || equipmentErrors.serialNumber.length > 0 || equipmentErrors.location.length > 0 || equipmentErrors.brand.length > 0 || equipmentErrors.model.length > 0}
                                        />
                                    )}

                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        form="equipment-form"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        startContent={!isLoading && <ArrowHookUpRightFilled className="size-5"/>}
                                        isLoading={isLoading}
                                        isDisabled={equipment.name === "" || equipment.code === "" || equipment.serialNumber === "" || equipment.location === "" || equipment.brand === "" || equipment.model === "" || equipment.assignedToId === "" || equipment.equipmentCategoryId === "" || equipment.maintenanceProviderId === "" || equipmentErrors.name.length > 0 || equipmentErrors.code.length > 0 || equipmentErrors.serialNumber.length > 0 || equipmentErrors.location.length > 0 || equipmentErrors.brand.length > 0 || equipmentErrors.model.length > 0}
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

            <Drawer
                hideCloseButton
                size="sm"
                radius="sm"
                isOpen={isDrawerOpen} 
                onOpenChange={setIsDrawerOpen}
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
                                <p className="text-lg font-bold">Registrar servicios programados</p>
                                <CloseButton onPress={onClose}/>     
                            </div>
                            <p className="text-sm font-normal">Ingrese la información solicitada para poder crear servicios programados asignados a este equipo.</p>
                        </DrawerHeader>
                        <DrawerBody className="h-full flex flex-col gap-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary overflow-x-hidden">
                            <Checkbox isSelected={isSelected} onValueChange={setIsSelected} radius="sm" size="md" classNames={{label: "text-sm font-medium"}}>
                                Servicios programados
                            </Checkbox>
                            {isSelected && ( isLoading ? 
                                <div className="relative w-full h-full">                                    
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <Spinner
                                            classNames={{ label: "pt-2 text-sm" }}
                                            color="current"
                                            size="md"
                                            label="Espere un poco por favor"
                                        />
                                    </div>
                                </div>
                                : <>
                                <div className="gap-6 flex flex-col">
                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Tipo de servicio</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Tipo de servicio"
                                    className="w-full -mt-4"
                                    name="maintenanceTypeId"
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    placeholder="Selecciona un tipo de servicio"
                                    radius="sm"
                                    selectedKeys={new Set([`${maintenance.maintenanceTypeId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChangeMaintenance('maintenanceTypeId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={maintenanceErrors.maintenanceTypeId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {maintenanceErrors.maintenanceTypeId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {maintenanceTypes.map((maintenanceType) => (<SelectItem key={maintenanceType.id}>{maintenanceType.name}</SelectItem>))}
                                </Select>

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Responsable del servicio</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Responsable de servicio"
                                    className="w-full -mt-4"
                                    name="responsibleUserId"
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    placeholder="Selecciona un responsable de servicio"
                                    radius="sm"
                                    selectedKeys={new Set([`${maintenance.responsibleUserId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChangeMaintenance('responsibleUserId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={maintenanceErrors.responsibleUserId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {maintenanceErrors.responsibleUserId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {users.map((user) => (<SelectItem key={user.id}>{user.name}</SelectItem>))}
                                </Select>

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Prioridad</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Prioridad"
                                    className="w-full -mt-4"
                                    name="priority"
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    placeholder="Selecciona una prioridad"
                                    radius="sm"
                                    selectedKeys={new Set([`${maintenance.priority}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChangeMaintenance('priority', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={maintenanceErrors.priority.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {maintenanceErrors.priority.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    <SelectItem key="LOW">Baja</SelectItem>
                                    <SelectItem key="MEDIUM">Media</SelectItem>
                                    <SelectItem key="HIGH">Alta</SelectItem>
                                    <SelectItem key="CRITICAL">Crítica</SelectItem>
                                </Select>

                                <div className="grid-cols-12 w-full grid gap-4">
                                    <div className="col-span-6 flex flex-col gap-6 pt-1">
                                        <NumberInput
                                            label={
                                                <div className="flex justify-between">
                                                    <div className="flex items-center gap-1">
                                                        <p className="font-medium text-sm">Frecuencia:</p>
                                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                                    </div>
                                                </div>
                                            }
                                            classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                            className="w-full"
                                            color="primary"
                                            name="frequencyValue"
                                            labelPlacement="outside"
                                            radius="sm"
                                            size="md"
                                            variant="bordered"
                                            minValue={1}
                                            maxValue={127}
                                            step={1}
                                            value={maintenance.frequencyValue}
                                            placeholder={1}
                                            onValueChange={(value) => handleInputChangeMaintenance('frequencyValue', value)}
                                            isInvalid={maintenanceErrors.frequencyValue.length > 0}
                                            errorMessage={() => (
                                                <div className="flex text-danger">
                                                    <ul>
                                                        {maintenanceErrors.frequencyValue.map((error, i) => (
                                                            <li key={i}>{error}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-6 flex flex-col gap-6">
                                        <div className="w-full flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm pl-0.5">Unidad</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                        </div>
                                        <Select
                                            aria-label="Unidad de tiempo"
                                            className="w-full -mt-4"
                                            name="frequencyType"
                                            classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                            listboxProps={{
                                                itemClasses: {
                                                    base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                                }
                                            }}
                                            selectionMode="single"
                                            disallowEmptySelection
                                            selectorIcon={<ChevronDownFilled className="size-5"/>}
                                            labelPlacement="outside"
                                            placeholder="Unidad"
                                            radius="sm"
                                            selectedKeys={new Set([`${maintenance.frequencyType}`])}
                                            onSelectionChange={(keys) => {
                                                const [first] = Array.from(keys)
                                                handleInputChangeMaintenance('frequencyType', first)
                                            }}
                                            isInvalid={maintenanceErrors.frequencyType.length > 0}
                                            errorMessage={() => (
                                                <div className="flex text-danger font-medium">
                                                    <ul>
                                                        {maintenanceErrors.frequencyType.map((error, i) => (
                                                            <li key={i}>{error}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        >
                                            <SelectItem key="DAILY">Día</SelectItem>
                                            <SelectItem key="WEEKLY">Semana</SelectItem>
                                            <SelectItem key="MONTHLY">Mes</SelectItem>
                                            <SelectItem key="YEARLY">Año</SelectItem>
                                        </Select>
                                    </div>
                                </div>

                                <DatePicker
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Próximo servicio</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                        </div>
                                    }
                                    showMonthAndYearPickers
                                    granularity="second"
                                    timeInputProps={{ classNames: { base: "bg-background dark:bg-background-200", input: "!!!bg-primary"}}}
                                    classNames={{ base: "p-0 !pb-0", label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current"}}
                                    calendarProps={{classNames: { headerWrapper: "bg-background-100 dark:bg-background-300 after:bg-background-100 after:dark:bg-background-300", gridHeader: "bg-background-100 dark:bg-background-300", content: "bg-background dark:bg-background-200", pickerWrapper: "bg-background dark:bg-background-200", header: "bg-background-200", pickerHighlight: "bg-secondary"}}}
                                    className="w-full"
                                    color="primary"
                                    name="nextMaintenanceDate"
                                    labelPlacement="outside"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    minValue={today(getLocalTimeZone()).add({ days: 1 })}
                                    maxValue={new CalendarDate(2038, 1, 18)}
                                    value={maintenance.nextMaintenanceDate}
                                    onChange={(value) => handleInputChangeMaintenance('nextMaintenanceDate', value)}
                                    isInvalid={maintenanceErrors.nextMaintenanceDate.length > 0}
                                    endContent={maintenanceErrors.nextMaintenanceDate.length === 0 ? <CalendarFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <CalendarFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {maintenanceErrors.nextMaintenanceDate.map((error, i) => (
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
                                            <p className="!text-background-500 text-xs font-normal">{maintenance.description?.length + " / 1000"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="description"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={1000}
                                    value={maintenance.description}
                                    placeholder={action === "create" ? "Ingrese las observaciones del equipo" : data.description}
                                    onValueChange={(value) => handleInputChangeMaintenance('description', value)}
                                    isInvalid={maintenanceErrors.description.length > 0}
                                    endContent={maintenanceErrors.description.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {maintenanceErrors.description.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />
                                
                                </div>

                                <div className="flex flex-col w-full">
                                {maintenances.length > 0 && (
                                    <>
                                    <p className="text-base font-semibold py-4">Servicios programados asignados al equipo: {equipment.name}</p>

                                    <div className="w-full flex gap-4">
                                        <Accordion isCompact selectionMode="multiple">
                                            {maintenances.map((maintenanceS, i) => (
                                                <AccordionItem key={i} aria-label={"Servicio " + (i+1)} title={<div className="flex w-full justify-between items-center"><p className="font-semibold">{"Servicio " + (i+1)}</p><div><Button className="!bg-transparent text-danger text-sm font-medium" disableAnimation disableRipple size="sm" onPress={() => handleRemoveMaintenance(i)} as="a" startContent={<DeleteFilled className="size-5"/>}>Eliminar</Button></div></div>}>
                                                    <Card shadow="none" radius="sm" className="w-full transition-colors !duration-1000 ease-in-out bg-transparent dark:bg-background-100 shadow-large">
                                                        <CardBody className="pl-4">
                                                            <div className={`absolute top-1/2 left-0 transform -translate-y-1/2 w-1 ${maintenanceS.description === "" ? "h-32" : "h-40"} bg-primary rounded-full`}></div>
                                                            
                                                            <div className="w-full flex flex-col gap-1">
                                                                {maintenanceS.description !== "" && (
                                                                <div className="w-full flex justify-between">
                                                                    <p className="font-semibold break-words">{maintenanceS.description}</p>
                                                                </div>)}
                                                                <p className="text-sm break-words"><span className="font-medium">Tipo de servicio: </span>{maintenanceTypeMap[maintenanceS.maintenanceTypeId]}</p>
                                                                <p className="text-sm break-words"><span className="font-medium">Responsable: </span>{userMap[maintenanceS.responsibleUserId]}</p>
                                                                <p className="text-sm break-words"><span className="font-medium">Prioridad: </span>{priorityLabels[maintenanceS.priority]}</p>
                                                                <p className="text-sm break-words"><span className="font-medium">Próximo servicio: </span>{formatDateLiteral(maintenanceS.nextMaintenanceDate, true)}</p>
                                                                <p className="text-sm break-words"><span className="font-medium">Frecuencia: </span>{getFrequencyText(maintenanceS.frequencyType, maintenanceS.frequencyValue)}</p>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                    </>
                                )}
                                </div>
                                </>
                            )}
                        </DrawerBody>
                        <DrawerFooter className="flex w-full py-10 sm:gap-4 gap-2">
                            <SecondaryButton
                                label="Asignar servicio"
                                startContent={<AddCircleFilled className="size-5"/>}
                                isDisabled={maintenance.maintenanceTypeId === "" || maintenance.responsibleUserId === "" || maintenance.priority === "" || maintenance.nextMaintenanceDate === null || maintenance.frequencyValue === null || maintenance.frequencyType === "" || maintenanceErrors.maintenanceTypeId.length > 0 || maintenanceErrors.responsibleUserId.length > 0 || maintenanceErrors.description.length > 0 || maintenanceErrors.priority.length > 0 || maintenanceErrors.nextMaintenanceDate.length > 0 || maintenanceErrors.frequencyValue.length > 0 || maintenanceErrors.frequencyType.length > 0}
                                onPress={handleAddMaintenance}
                            />

                            <Button
                                className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                radius="sm"
                                variant="shadow"
                                color="primary"
                                startContent={!isLoading && <ArrowHookUpRightFilled className="size-5"/>}
                                onPress={onSubmitWithMaintenances}
                                isLoading={isLoading}
                                isDisabled={((!(maintenances.length > 0)) || !isSelected)}
                            >
                                Siguiente
                            </Button>
                        </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <EquipmentsChangeStatusModal isOpen={isModalCSOpen} onOpenChange={onModalCSOpenChange} data={data} onRefresh={onRefresh}/>
            <EquipmentsModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} data={equipment} initialData={data} action={action} onRefresh={onRefresh} closeDrawer={() => {resetForm(); onOpenChange(false)}} maintenances={maintenances} withMaintenances={isSelected}/>
        </>
    )
}