import { addToast, Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDraggable } from "@heroui/react"
import { useRef, useState } from "react"
import { CloseButton } from "../CloseButton"
import { ArrowHookUpLeftFilled, ArrowHookUpRightFilled, CheckmarkCircleFilled, DismissCircleFilled, DismissFilled, PersonAddFilled, PersonEditFilled } from "@fluentui/react-icons"
import { PrimaryButton } from "../PrimaryButton"
import { Tooltip } from "../Tooltip"
import { createUser, updateUser } from "../../service/user"

export const UsersModal = ({isOpen, onOpenChange, data, initialData, action, onRefresh, closeDrawer}) => {
    const targetRef = useRef(null)
    const {moveProps} = useDraggable({targetRef, isDisabled: !isOpen})

    const [showBefore, setShowBefore] = useState(false)
    const description = action === "create"
    ? "Una vez registrado, el usuario recibirá por correo electrónico su contraseña y podrá acceder a la aplicación con sus credenciales."
    : "Por favor, verifique que todos los datos sean correctos antes de continuar."

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        const verb = action === "create" ? "registró" : "actualizó"

        try {
            setIsLoading(true)
            
            const response = action === "create"
                ? await createUser(data)
                : await updateUser(data)

            const success = response.type === "SUCCESS"
            
            addToast({
                title: success
                    ? `Se ${verb} a ${data.name}`
                    : `No se ${verb} a ${data.name}`,
                description: `con correo electrónico: ${data.email}`,
                color: success ? "primary" : "danger",
                icon: success
                    ? <CheckmarkCircleFilled className="size-5"/>
                    : <DismissCircleFilled className="size-5"/>
            })

            if (success){ closeDrawer(); onRefresh()}
        } catch (error){
            addToast({
                title: `No se ${verb} a ${data.name}`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
        } finally {
            setIsLoading(false)
            onOpenChange(false)
        }
    }

    const userDetails = (user) => {
        return (
            <Card shadow="none" radius="sm" className="w-full transition-colors !duration-1000 ease-in-out bg-transparent dark:bg-background-100 shadow-large">

                <CardBody className="pl-4">
                    <div className="absolute left-0 inset-y-4 w-1 bg-primary rounded-full"></div>
                    
                    <div className="w-full flex flex-col gap-1">
                        <div className="w-full flex justify-between">
                            <p className="font-semibold break-all line-clamp-2 pr-4">{user.name}</p>
                            {action !== "create" && (
                                <Tooltip
                                    tooltipContent={showBefore ? "Ver después" : "Ver antes"}
                                    tooltipPlacement="top"
                                >
                                    <Button className="bg-transparent" size="sm" radius="sm" isIconOnly onPress={() => setShowBefore(!showBefore)}>
                                        {showBefore ? <ArrowHookUpRightFilled className="size-5"/> : <ArrowHookUpLeftFilled className="size-5"/>}
                                    </Button>
                                </Tooltip>
                            )}
                        </div>
                        <p className="text-sm line-clamp-2 break-all"><span className="font-medium">Correo electrónico: </span>{user.email}</p>
                        <p className="text-sm"><span className="font-medium">Puesto: </span>{user.position}</p>
                        <p className="text-sm"><span className="font-medium">Rol: </span>{user.roleId == "1" ? "Administrador" : user.roleId == "2" ? "Supervisor" : "Operador"}</p>
                        {user.phone && (<p className="text-sm"><span className="font-medium">Teléfono: </span>{user.phone}</p>)}
                    </div>
                </CardBody>
            </Card>
        );
    }

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
                classNames={{wrapper: "overflow-hidden", backdrop: "bg-black/20"}}
                ref={targetRef} 
            >
                <ModalContent className="bg-background">
                    {(onClose) => (
                        <>
                        <ModalHeader {...moveProps} className="flex flex-col gap-2 pb-4 pt-4">
                            <div className="w-full flex justify-end">
                                <CloseButton onPress={onClose}/>     
                            </div>
                            <p className="text-lg font-bold text-center">¿Desea {action === "create" ? "registrar" : "actualizar"} al siguiente usuario?</p>
                        </ModalHeader>
                        <ModalBody className="py-0 gap-0">
                            <p className="text-sm font-normal pb-4 text-center">{description}</p>

                            {action === "create" ? 
                                userDetails(data)
                            :
                                !showBefore ? userDetails(data) : userDetails(initialData)
                            }
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
                                label={action === "create" ? "Registrar" : "Actualizar"}
                                startContent={action === "create" ? <PersonAddFilled className="size-5"/> : <PersonEditFilled className="size-5"/>}
                                onPress={handleSubmit}
                                isLoading={isLoading}
                            />
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}