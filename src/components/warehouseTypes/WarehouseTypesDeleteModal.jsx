import { CheckmarkCircleFilled, DismissCircleFilled, DeleteFilled } from "@fluentui/react-icons";
import { ChangeStatusModal } from "../ChangeStatusModal"
import { PrimaryButton } from "../PrimaryButton";
import { useState } from "react";
import { addToast } from "@heroui/react";
import { deleteWarehouseType } from "../../service/product";

export const WarehouseTypesDeleteModal = ({isOpen, onOpenChange, data, onRefresh}) => {
    const [isLoading, setIsLoading] = useState(false)

    const onDelete = async () => {
        try {
            setIsLoading(true)

            const response = await deleteWarehouseType(data.id)

            if (response.type === "SUCCESS"){
                addToast({
                    title: `Se eliminó el tipo ${data.name}`,
                    description: "El tipo de almacén ha sido eliminado correctamente.",
                    color: "primary",
                    icon: <CheckmarkCircleFilled className='size-5' />
                })
            } else {
                addToast({
                    title: `No se eliminó el tipo ${data.name}`,
                    color: "danger",
                    icon: <DismissCircleFilled className='size-5' />
                })
            }
        } catch (error) {
            addToast({
                title: `No se eliminó el tipo ${data.name}`,
                description: error.response?.data?.message || "Ocurrió un error al procesar la solicitud.",
                color: "danger",
                icon: <DismissCircleFilled className="size-5"/>
            })
        } finally {
            setIsLoading(false)
            onOpenChange(false)
            onRefresh()
        }
    }

    if (data && data.id){
        return (
            <ChangeStatusModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={`¿Desea eliminar el tipo: ${data.name}?`}
                description="Esta acción no se puede deshacer. El tipo de almacén será eliminado permanentemente del sistema."
            >
                <PrimaryButton
                    label="Eliminar"
                    startContent={<DeleteFilled className="size-5"/>}
                    isLoading={isLoading}
                    onPress={onDelete}
                />
            </ChangeStatusModal>
        )
    }
}
