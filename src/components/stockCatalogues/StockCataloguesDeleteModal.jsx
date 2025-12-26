import { CheckmarkCircleFilled, DismissCircleFilled, DeleteFilled } from "@fluentui/react-icons";
import { ChangeStatusModal } from "../ChangeStatusModal"
import { PrimaryButton } from "../PrimaryButton";
import { useState } from "react";
import { addToast } from "@heroui/react";
import { deleteStockCatalogue } from "../../service/product";

export const StockCataloguesDeleteModal = ({isOpen, onOpenChange, data, onRefresh}) => {
    const [isLoading, setIsLoading] = useState(false)

    const onDelete = async () => {
        try {
            setIsLoading(true)

            const response = await deleteStockCatalogue(data.id)

            if (response.type === "SUCCESS"){
                addToast({
                    title: `Se eliminó el catálogo ${data.name}`,
                    description: "El catálogo ha sido eliminado correctamente.",
                    color: "primary",
                    icon: <CheckmarkCircleFilled className='size-5' />
                })
            } else {
                addToast({
                    title: `No se eliminó el catálogo ${data.name}`,
                    color: "danger",
                    icon: <DismissCircleFilled className='size-5' />
                })
            }
        } catch (error) {
            addToast({
                title: `No se eliminó el catálogo ${data.name}`,
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
                title={`¿Desea eliminar el catálogo: ${data.name}?`}
                description="Esta acción no se puede deshacer. El catálogo será eliminado permanentemente del sistema."
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
