import { CheckmarkCircleFilled, DismissCircleFilled, PersonAvailableFilled, PersonSubtractFilled } from "@fluentui/react-icons";
import { ChangeStatusModal } from "../ChangeStatusModal"
import { PrimaryButton } from "../PrimaryButton";
import { useState } from "react";
import { addToast } from "@heroui/react";
import { changeStatus } from "../../service/user";

export const UsersChangeStatusModal = ({isOpen, onOpenChange, data, onRefresh}) => {
    const [isLoading, setIsLoading] = useState(false)

    const onChangeStatus = async () => {
        try {
            setIsLoading(true)

            const response = await changeStatus(data.id)

            if (response.type === "SUCCESS"){
                addToast({
                    title: `Se ${data.status === "activo" ? "inhabilitó" : "habilitó"} a ${data.name}`,
                    description: `con correo electrónico: ${data.email}`,
                    color: "primary",
                    icon: <CheckmarkCircleFilled className='size-5' />
                })
            } else {
                addToast({
                    title: `No se ${data.status === "activo" ? "inhabilitó" : "habilitó"} a ${data.name}`,
                    color: "danger",
                    icon: <DismissCircleFilled className='size-5' />
                })
            }
        } catch (error) {
            addToast({
                title: `No se ${data.status === "activo" ? "inhabilitó" : "habilitó"} a ${data.name}`,
                description: error.response.data.message,
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
        } finally {
            setIsLoading(false)
            onOpenChange(false)
            onRefresh()
        }
    }

    if (data){
        return (
            <ChangeStatusModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={`¿Desea ${data.status === "activo" ? "inhabilitar" : "habilitar"} al usuario: ${data.name}?`}
                description={data.status === "activo" ? "Al inhabilitar el usuario, se restringirá su acceso a la aplicación de forma temporal, pero podrá ser habilitado nuevamente en cualquier momento." : "Al habilitar el usuario, se restablecerá su acceso a la aplicación con normalidad."}
            >
                <PrimaryButton
                    label={data.status === "activo" ? "Inhabilitar" : "Habilitar"}
                    startContent={data.status === "activo" ? <PersonSubtractFilled className="size-5"/> : <PersonAvailableFilled className="size-5"/>}
                    isLoading={isLoading}
                    onPress={onChangeStatus}
                />
            </ChangeStatusModal>
        )
    }
}