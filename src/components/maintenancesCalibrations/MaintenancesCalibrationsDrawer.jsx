import { addToast, Button, DatePicker, Drawer, DrawerBody, DrawerContent, DrawerHeader, Form, Input, InputOtp, NumberInput, Select, SelectItem, Textarea, useDisclosure } from "@heroui/react"
import { CloseButton } from "../CloseButton"
import { ArrowHookUpRightFilled, ArrowSyncCircleFilled, CalendarFilled, CheckmarkCircleFilled, CheckmarkFilled, ChevronDownFilled, CircleFilled, ClockFilled, DismissCircleFilled, DismissFilled, PersonAvailableFilled, PersonSubtractFilled, SubtractCircleFilled, TextAsteriskFilled } from "@fluentui/react-icons"
import { useEffect, useState } from "react"
import { onlyLetters, required, requiredNumber, validateDatePicker, validEmail, validPhone, validRoleId } from "../../js/validators"
import { SecondaryButton } from "../SecondaryButton"
import { MaintenancesCalibrationsChangeStatusModal } from "./MaintenancesCalibrationsChangeStatusModal"
import { MaintenancesCalibrationsModal } from "./MaintenancesCalibrationsModal"
import { calendarDateTimeToISO, formatDateLiteral, parseISOToCalendarDateTime } from "../../js/utils"
import { CalendarDate, getLocalTimeZone, today} from "@internationalized/date";

export const MaintenancesCalibrationsDrawer = ({isOpen, onOpenChange, data, action, onRefresh, isScheduled, users, maintenanceTypes, equipments}) => {
    const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure()
    const {isOpen: isModalCSOpen, onOpen: onModalCSOpen, onOpenChange: onModalCSOpenChange} = useDisclosure()
    
    const [names, setNames] = useState({
        equipment: "",
        maintenanceType: "",
        responsible: ""
    })

    const [maintenance, setMaintenance] = useState({
        id: data?.id || "",
        equipmentId: data?.equipmentId || "",
        maintenanceTypeId: data?.maintenanceTypeId || "",
        responsibleUserId: data?.responsibleUserId || "",
        description: data?.description || "",
        priority: data?.priority || ""
    })

    const [scheduledMaintenace, setScheduledMaintenance] = useState({
        id: data?.id || "",
        maintenanceId: data?.maintenanceId || "",
        frequencyType: data?.frequencyType || "",
        frequencyValue: data?.frequencyValue || null,
        nextMaintenanceDate: data?.nextMaintenanceDate 
            ? parseISOToCalendarDateTime(data.nextMaintenanceDate)
            : null
    })

    const [maintenanceErrors, setMaintenanceErrors] = useState({ 
        equipmentId: [],
        maintenanceTypeId: [],
        responsibleUserId: [],
        description: [],
        priority: [],
    })

    const [scheduledMaintenaceErrors, setScheduledMaintenaceErrors] = useState({ 
        maintenanceId: [],
        frequencyType: [],
        nextMaintenanceDate: [],
        frequencyValue: []
    })

    useEffect(() => {
        setMaintenance({
            id: data?.id || "",
            equipmentId: data?.equipmentId || "",
            maintenanceTypeId: data?.maintenanceTypeId || "",
            responsibleUserId: data?.responsibleUserId || "",
            description: data?.description || "",
            priority: data?.priority || "",
        })

        setScheduledMaintenance({
            id: data?.id || "",
            maintenanceId: data?.maintenanceId || "",
            frequencyType: data?.frequencyType || "",
            frequencyValue: data?.frequencyValue || null,
            nextMaintenanceDate: data?.nextMaintenanceDate 
                ? parseISOToCalendarDateTime(data.nextMaintenanceDate)
                : null
        })

        setMaintenanceErrors({
            equipmentId: [],
            maintenanceTypeId: [],
            responsibleUserId: [],
            description: [],
            priority: [],
        })

        setScheduledMaintenaceErrors({
            maintenanceId: [],
            frequencyType: [],
            nextMaintenanceDate: [],
            frequencyValue: []
        })
    }, [data, action]);

    const resetForm = () => {
        setMaintenance({ id:"", equipmentId:"", maintenanceTypeId:"", responsibleUserId:"", description:"", priority:"" })
        setScheduledMaintenance({ id:"", maintenanceId:"", frequencyType:"", nextMaintenanceDate: null, frequencyValue: null })
        setMaintenanceErrors({ equipmentId:[], maintenanceTypeId:[], responsibleUserId:[], description:[], priority:[] })
        setScheduledMaintenaceErrors({ maintenanceId:[], frequencyType:[], nextMaintenanceDate:[], frequencyValue: [] })
    }

    const maintenanceValidators = {
        nextMaintenanceDate: [validateDatePicker],
        frequencyValue: [requiredNumber],
        frequencyType: [required]
    }

    const validators = {
        equipmentId: [required],
        maintenanceTypeId: [required],
        responsibleUserId: [required],
        priority: [required],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChange = (field, value) => {
        setMaintenance(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setMaintenanceErrors(prev => ({ ...prev, [field]: errs }))
    }

    const handleInputChangeScheduledMaintenance = (field, value) => {
        setScheduledMaintenance(prev => ({ ...prev, [field]: value }))

        const fns = maintenanceValidators[field] || []
        const errs = runValidators(value, fns)
        setScheduledMaintenaceErrors(prev => ({ ...prev, [field]: errs }))
    }

    let title
    let description

    switch (action) {
        case "create":
            title = isScheduled ? "Registrar servicio programado" : "Solicitar servicio"
            description = "Ingrese la información solicitada para poder registrar el servicio."
            break
        case "update":
            title = isScheduled ? "Actualizar servicio programado" : "Actualizar solicitud de servicio"
            description = "Edite la información necesaria y guarde los cambios para actualizar el registro."
            break
        default:
            title = "Detalles del servicio"
            description = "Revise la información completa del servicio. Esta vista es solo de lectura."
            break
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))
        
        const formData = action !== "create"
            ? { id: maintenance.id, ...formEntries }
            : { ...formEntries }
        
        const selectedEquipment = equipments.find(eq => eq.id === formData.equipmentId)
        const selectedMaintenanceType = maintenanceTypes.find(mt => mt.id === formData.maintenanceTypeId)
        const selectedUser = users.find(u => u.id === formData.responsibleUserId)

        const equipmentName = selectedEquipment?.name || "—"
        const maintenanceTypeName = selectedMaintenanceType?.name || "—"
        const responsibleUserName = selectedUser?.name || "—"

        setNames({
            equipment: equipmentName,
            maintenanceType: maintenanceTypeName,
            responsible: responsibleUserName
        })

        setMaintenanceErrors({ equipmentId:[], maintenanceTypeId:[], responsibleUserId:[], description:[], priority:[] })
        setMaintenance(formData)
        onModalOpen()
    }

    const reviewStatusEnum = {
        IN_PROGRESS: {
            icon: <ArrowSyncCircleFilled className='size-5' />,
            label: "En progreso",
            colorClassName: "text-background-500"
        },
        PENDING: {
            icon: <ClockFilled className='size-5' />,
            label: "Pendiente",
            colorClassName: "text-warning"
        },
        APPROVED: {
            icon: <CheckmarkCircleFilled className='size-5' />,
            label: "Aprobado",
            colorClassName: "text-primary"
        },
        REJECTED: {
            icon: <DismissCircleFilled className='size-5' />,
            label: "Rechazado",
            colorClassName: "text-danger"
        }
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
                            <Form onSubmit={onSubmit} id="user-form" className={action === 'create' || action === 'update' ? "gap-6 flex flex-col" : "gap-6 flex flex-col pb-8"}>
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

                                        <div className="pl-0.5 flex flex-col">
                                            <p className="text-sm"><span className="font-medium ">Código: </span>{data.code}</p>
                                        </div>

                                        <div className="pl-0.5 flex">
                                            {(() => {
                                                const statusInfo = reviewStatusEnum[data.reviewStatus] || {}
                                                return (
                                                    <div className={"flex items-center gap-1 " + statusInfo.colorClassName}>
                                                        <span className="font-medium text-background-950 text-sm">Revisión: </span>
                                                        {statusInfo.icon}
                                                        <span className="text-sm truncate">{statusInfo.label}</span>
                                                    </div>
                                                    )
                                            })()}
                                        </div>
                                    </div>
                                )}

                                <div className="w-full flex justify-between">
                                    <div className="flex items-center gap-1">
                                        <p className="font-medium text-sm pl-0.5">Equipo</p>
                                        <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                    </div>
                                </div>
                                <Select
                                    aria-label="Equipo"
                                    className="w-full -mt-4"
                                    name="equipmentId"
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
                                    placeholder="Selecciona un equipo"
                                    radius="sm"
                                    selectedKeys={new Set([`${maintenance.equipmentId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('equipmentId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={maintenanceErrors.equipmentId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger font-medium">
                                            <ul>
                                                {maintenanceErrors.equipmentId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {equipments.map((equipment) => (<SelectItem key={equipment.id}>{equipment.name}</SelectItem>))}
                                </Select>

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
                                        handleInputChange('maintenanceTypeId', first)
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
                                    placeholder={data?.responsibleUserName ? data.responsibleUserName : "Selecciona un responsable de servicio"}
                                    radius="sm"
                                    selectedKeys={action === "update" && new Set([`${maintenance.responsibleUserId}`])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('responsibleUserId', first)
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
                                        handleInputChange('priority', first)
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

                                {isScheduled && (
                                    <>
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
                                                isReadOnly={action !== 'create' && action !== 'update'}
                                                value={scheduledMaintenace.frequencyValue}
                                                placeholder={action === "create" ? 1 : data.frequencyValue}
                                                onValueChange={(value) => handleInputChangeScheduledMaintenance('frequencyValue', value)}
                                                isInvalid={scheduledMaintenaceErrors.frequencyValue.length > 0}
                                                errorMessage={() => (
                                                    <div className="flex text-danger">
                                                        <ul>
                                                            {scheduledMaintenaceErrors.frequencyValue.map((error, i) => (
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
                                                selectedKeys={new Set([`${scheduledMaintenace.frequencyType}`])}
                                                onSelectionChange={(keys) => {
                                                    const [first] = Array.from(keys)
                                                    handleInputChangeScheduledMaintenance('frequencyType', first)
                                                }}
                                                isDisabled={action !== 'create' && action !== 'update'}
                                                isInvalid={scheduledMaintenaceErrors.frequencyType.length > 0}
                                                errorMessage={() => (
                                                    <div className="flex text-danger font-medium">
                                                        <ul>
                                                            {scheduledMaintenaceErrors.frequencyType.map((error, i) => (
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
                                        description={<p className="text-background-500 pb-8">{formatDateLiteral(calendarDateTimeToISO(scheduledMaintenace.nextMaintenanceDate), true)}</p>}
                                        showMonthAndYearPickers
                                        granularity="second"
                                        timeInputProps={{ classNames: { base: "bg-background dark:bg-background-200", input: "!!!bg-primary"}}}
                                        classNames={{ base: "p-0 !pb-0", label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current"}}
                                        calendarProps={{classNames: { headerWrapper: "bg-background-100 dark:bg-background-300 after:bg-background-100 after:dark:bg-background-300", gridHeader: "bg-background-100 dark:bg-background-300", content: "bg-background dark:bg-background-200", pickerWrapper: "bg-background dark:bg-background-200", header: "bg-background-200", pickerHighlight: "bg-secondary"}}}
                                        className="w-full mb-2"
                                        color="primary"
                                        name="nextMaintenanceDate"
                                        labelPlacement="outside"
                                        radius="sm"
                                        size="md"
                                        variant="bordered"
                                        minValue={today(getLocalTimeZone()).add({ days: 1 })}
                                        maxValue={new CalendarDate(2038, 1, 18)}
                                        value={scheduledMaintenace.nextMaintenanceDate}
                                        isReadOnly={action !== 'create' && action !== 'update'}
                                        placeholderValue={action === "create" ? null : (data.nextMaintenanceDate 
                                            ? parseISOToCalendarDateTime(data.nextMaintenanceDate)
                                            : null)
                                        }
                                        onChange={(value) => handleInputChangeScheduledMaintenance('nextMaintenanceDate', value)}
                                        isInvalid={scheduledMaintenaceErrors.nextMaintenanceDate.length > 0}
                                        endContent={scheduledMaintenaceErrors.nextMaintenanceDate.length === 0 ? <CalendarFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <CalendarFilled className='size-4 text-danger' /> }
                                        errorMessage={() => (
                                            <div className="flex text-danger">
                                                <ul>
                                                    {scheduledMaintenaceErrors.nextMaintenanceDate.map((error, i) => (
                                                        <li key={i}>{error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    />
                                    </>
                                )}

                                <Textarea
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Descripción</p>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{maintenance.description.length + " / 1000"}</p>
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
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese las observaciones del equipo" : data.description}
                                    value={maintenance.description}
                                    onValueChange={(value) => handleInputChange('description', value)}
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
                            </Form>

                            {(action === 'create' || action === 'update') && (
                                <div className="w-full flex justify-end py-8 sm:gap-4 gap-2">
                                    {action === "update" && (
                                        <SecondaryButton
                                            label={data.status === "activo" ? "Inhabilitar" : "Habilitar"}
                                            startContent={data.status === "activo" ? <SubtractCircleFilled className="size-5"/> : <CheckmarkCircleFilled className="size-5"/>}
                                            onPress={onModalCSOpen}
                                        />
                                    )}

                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        form="user-form"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        startContent={<ArrowHookUpRightFilled className="size-5"/>}
                                        isDisabled={maintenance.equipmentId === "" || maintenance.maintenanceTypeId === "" || maintenance.responsibleUserId === "" || maintenance.priority === "" || maintenanceErrors.equipmentId.length > 0 || maintenanceErrors.maintenanceTypeId.length > 0 || maintenanceErrors.responsibleUserId.length > 0 || maintenanceErrors.description.length > 0 || maintenanceErrors.priority.length > 0}
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

            <MaintenancesCalibrationsChangeStatusModal isOpen={isModalCSOpen} onOpenChange={onModalCSOpenChange} data={data} onRefresh={onRefresh}/>
            <MaintenancesCalibrationsModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} data={maintenance} initialData={data} action={action} onRefresh={onRefresh} equipmentName={names.equipment} responsibleUserName={names.responsible} maintenanceTypeName={names.maintenanceType} closeDrawer={() => {onOpenChange(false); resetForm()}} isScheduled={data ? data.isScheduled : false}/>
        </>
    )
}