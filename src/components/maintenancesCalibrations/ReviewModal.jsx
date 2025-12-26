import { ArrowHookUpRightFilled, ArrowSyncCircleFilled, CheckmarkCircleFilled, CheckmarkFilled, ClockFilled, DismissCircleFilled, DismissFilled } from "@fluentui/react-icons"
import { addToast, Button, Card, CardBody, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDraggable } from "@heroui/react"
import { useEffect, useRef, useState } from "react"
import { PrimaryButton } from "../PrimaryButton"
import { required } from "../../js/validators"
import { approveMaintenance, inProgressMaintenance, rejectMaintenance, submitMaintenanceForReview } from "../../service/maintenanceCalibration"
import { CloseButton } from "../CloseButton"

export const ReviewModal = ({isOpen, onOpenChange, data, action, onRefresh}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const targetRef = useRef(null)
    const targetRef2 = useRef(null)

    const {moveProps} = useDraggable({targetRef, isDisabled: !isOpen})
    const {moveProps: moveProps2} = useDraggable({targetRef2, isDisabled: !isModalOpen})
    
    let title = ""
    let description = ""
    let icon = null
    let buttonLabel = ""

    switch (action) {
        case "IN_PROGRESS": 
            title = `¿Desea marcar en progreso el siguiente servicio: ${data?.code}?`
            description = "Al marcar en progreso el servicio, usted indica que volverá a realizarlo."
            buttonLabel = "Marcar en progreso"
            icon = <ArrowSyncCircleFilled className='size-5' />
            break
        case "PENDING": 
            title = `¿Desea marcar como pendiente el siguiente servicio: ${data?.code}?`
            description = "Al marcar como pendiente el servicio, usted indica que lo realizó. La persona que le asigno dicho servicio podrá aprobar o rechazar este servicio."
            buttonLabel = "Marcar como pendiente"
            icon = <ClockFilled className='size-5' />
            break
        case "APPROVED": 
            title = `¿Desea marcar como aprobado el siguiente servicio: ${data?.code}?`
            description = "Al aprobar el servicio, usted indica que el servicio se realizó correctamente. Está acción no se puede deshacer."
            buttonLabel = "Aprobar"
            icon = <CheckmarkCircleFilled className='size-5' />
            break
        case "REJECTED": 
            title = `¿Desea marcar como rechazado el siguiente servicio: ${data?.code}?`
            description = "Al rechazar el servicio, usted indica que el responsable tendrá que volver a realizarlo hasta que se marque como aprobado."
            buttonLabel = "Rechazar"
            icon = <DismissCircleFilled className='size-5' />
            break
    }

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        let verb

        switch (action) {
            case "IN_PROGRESS": 
                verb = "marcó como en progreso a"
                break
            case "PENDING": 
                verb = "marcó como pendiente a"
                break
            case "APPROVED": 
                verb = `aprobó`
                break
        }

        try {
            setIsLoading(true)
            
            let response 
            
            switch (action) {
                case "IN_PROGRESS": 
                    response = await inProgressMaintenance(data.id)
                    break
                case "PENDING": 
                    const objectId = {
                        maintenanceId: data.id
                    }
                    response = await submitMaintenanceForReview(objectId)
                    break
                case "APPROVED": 
                    response = await approveMaintenance(data.id)
                    break
            }

            const success = response.type === "SUCCESS"

            addToast({
                title: success
                    ? `Se ${verb} el servicio correctamente`
                    : `No se ${verb} el servicio`,
                description: `con código: ${data?.code}`,
                color: success ? "primary" : "danger",
                icon: success
                    ? <CheckmarkCircleFilled className="size-5"/>
                    : <DismissCircleFilled className="size-5"/>
            })

            if (success){onRefresh()}
        } catch (error){
            addToast({
                title: `No se ${verb} el servicio`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
        } finally {
            setIsLoading(false)
            onOpenChange(false)
        }
    }

    const maintenanceDetails = (maintenance) => {
        return (
            <Card shadow="none" radius="sm" className="w-full transition-colors !duration-1000 ease-in-out bg-transparent dark:bg-background-100 shadow-large">
                <CardBody className="pl-4">
                    <div className="absolute left-0 inset-y-4 w-1 bg-primary rounded-full"></div>
                    
                    <div className="w-full flex flex-col gap-1">
                        <div className="w-full flex justify-between pb-2">
                            <p className="font-semibold break-all line-clamp-2 pr-4">{maintenance.description ? maintenance.description : "(Sin descripción)"}</p>
                        </div>
                        <p className="text-sm line-clamp-2 break-all"><span className="font-medium">Equipo: </span>{maintenance.equipmentName}</p>
                        <p className="text-sm"><span className="font-medium">Prioridad: </span>{maintenance.priorityName}</p>
                        <p className="text-sm"><span className="font-medium">Responsable: </span>{maintenance.responsibleUserName}</p>
                        <p className="text-sm"><span className="font-medium">Tipo de servicio: </span>{maintenance.maintenanceTypeName}</p>
                    </div>
                </CardBody>
            </Card>
        )
    }

    const [rejectionReason, setRejectionReason] = useState("")
    const [rejectionReasonError, setRejectionReasonError] = useState([])
    
    useEffect(() => {
        setRejectionReason("")
        setRejectionReasonError([])
    }, [data, action])

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const validators = {
        rejectionReason: [required]
    }

    const handleInputChange = (value) => {
        setRejectionReason(value)
        const errs = runValidators(value, validators.rejectionReason)
        setRejectionReasonError(errs)
    }

    const onSubmitRejected = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))

        try {
            setIsLoading(true)
            
            const response = await rejectMaintenance(data.id, formEntries)
            const success = response.type === "SUCCESS"
            
            addToast({
                title: success
                    ? `Se rechazó el servicio correctamente`
                    : `No se rechazó el servicio`,
                description: `con código: ${data?.code}`,
                color: success ? "primary" : "danger",
                icon: success
                    ? <CheckmarkCircleFilled className="size-5"/>
                    : <DismissCircleFilled className="size-5"/>
            })

            if (success){onRefresh()}
        } catch (error){
            addToast({
                title: `No se rechazó el servicio`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
        } finally {
            setIsLoading(false)
            setIsModalOpen(false)
            setRejectionReasonError([])
            onOpenChange(false)
        }
    }

    return (
        <>
            <Modal
                hideCloseButton
                size="lg"
                radius="lg"
                isKeyboardDismissDisabled
                isDismissable={false}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{wrapper: "overflow-hidden", backdrop: "bg-black/20"}}
                ref={targetRef} 
                className="my-0"
            >
                <ModalContent className="bg-background">
                    {(onClose) => (
                        <>
                        <ModalHeader {...moveProps} className="flex flex-col gap-2 pb-4 pt-4">
                            <div className="w-full flex justify-end">
                                <CloseButton onPress={onClose}/>     
                            </div>
                            <p className="text-lg font-bold text-center">{title}</p>
                        </ModalHeader>
                        <ModalBody className="py-0 gap-0">
                            <p className="text-sm font-normal pb-4 text-center">{description}</p>
                            {maintenanceDetails(data)}
                        </ModalBody>
                        <ModalFooter className="flex justify-center pt-4 pb-8 sm:gap-4 gap-2">
                            <Button
                                className="bg-transparent dark:bg-background-100"
                                radius="sm"
                                startContent={<DismissFilled className="size-5"/>}
                                onPress={onClose}
                            >
                                Cancelar
                            </Button>

                            <PrimaryButton
                                label={action === "REJECTED" ? "Siguiente" : buttonLabel}
                                startContent={action === "REJECTED" ? <ArrowHookUpRightFilled className="size-5"/> : icon}
                                onPress={() => {
                                    if (action === "REJECTED") {
                                        setIsModalOpen(true)
                                    } else {
                                        handleSubmit()
                                    }
                                }}
                                isLoading={isLoading}
                            />
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                hideCloseButton
                size="md"
                radius="lg"
                isKeyboardDismissDisabled
                isDismissable={false}
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                classNames={{wrapper: "overflow-hidden", backdrop: "bg-black/20"}}
                ref={targetRef2} 
                className="my-0"
            >
                <ModalContent className="bg-background">
                    {(onClose) => (
                        <>
                        <ModalHeader {...moveProps2} className="flex flex-col gap-2 pb-4 pt-4">
                            <div className="w-full flex justify-end">
                                <CloseButton onPress={onClose}/>     
                            </div>
                            <p className="text-lg font-bold text-center">Proporcione una explicación</p>
                        </ModalHeader>
                        <ModalBody className="py-0 gap-0">
                            <p className="text-sm font-normal pb-4 text-center">Debe proporcionar una explicación para notificarle al responsable del servicio la justificación del rechazo</p>
                            <Form onSubmit={onSubmitRejected} id="form" className="gap-6 flex flex-col">
                                <Textarea
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Razón</p>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{rejectionReason.length + " / 500"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal",  mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    className="w-full"
                                    color="primary"
                                    name="rejectionReason"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    size="md"
                                    variant="bordered"
                                    maxLength={500}
                                    placeholder={"Ingrese la razón del rechazo"}
                                    value={rejectionReason}
                                    onValueChange={handleInputChange}
                                    isInvalid={rejectionReasonError.length > 0}
                                    endContent={rejectionReasonError.length === 0 ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : <DismissFilled className='size-4 text-danger' /> }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {rejectionReasonError.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />
                            </Form>
                        </ModalBody>
                        <ModalFooter className="flex justify-center pt-4 pb-8 sm:gap-4 gap-2">
                            <Button
                                className="bg-transparent dark:bg-background-100"
                                radius="sm"
                                startContent={<DismissFilled className="size-5"/>}
                                onPress={onClose}
                            >
                                Cancelar
                            </Button>

                            <Button
                                className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                form="form"
                                radius="sm"
                                variant="shadow"
                                color="primary"
                                type="submit"
                                startContent={isLoading ? undefined : icon}
                                isLoading={isLoading}
                                isDisabled={rejectionReason === "" || rejectionReasonError.length > 0}
                            >
                                {buttonLabel}
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
