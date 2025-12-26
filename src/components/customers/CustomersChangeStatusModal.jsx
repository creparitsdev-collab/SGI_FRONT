import { CheckmarkCircleFilled, DismissCircleFilled, PersonAvailableFilled, PersonSubtractFilled } from "@fluentui/react-icons";
import { ChangeStatusModal } from "../ChangeStatusModal"
import { PrimaryButton } from "../PrimaryButton";
import { useState } from "react";
import { addToast } from "@heroui/react";
import { changeStatus } from "../../service/customer";

export const CustomersChangeStatusModal = ({isOpen, onOpenChange, data, onRefresh}) => {
    const [isLoading, setIsLoading] = useState(false)

    const onChangeStatus = async () => {
        try {
            setIsLoading(true)

            const response = await changeStatus(data.email)

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
                title={`¿Desea ${data.status === "activo" ? "inhabilitar" : "habilitar"} al cliente: ${data.name}?`}
                description={data.status === "activo" ? "Al inhabilitar el cliente, no estará disponible, pero podrá ser habilitado nuevamente en cualquier momento." : "Al habilitar el cliente, se restablecerá su disponibilidad con normalidad."}
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