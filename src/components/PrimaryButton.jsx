import { Button } from "@heroui/react";
import { Tooltip } from "./Tooltip";
import { Spinner } from "./Spinner";

export const PrimaryButton = ({
    isIconOnly = false,             // ¿El botón es un ícono? Si sí, ignorará el texto del botón, sino lo mostrará
    isDisabled = false,             // ¿El botón está deshabilitado?
    isLoading = false,              // ¿El botón está cargando?
    isSubmit = false,               // ¿El botón se ocupa en un form?
    isSmHidden = false,             // Si es true, el botón será visible solo en pantallas inferiores a sm
    fullWidth = false,              // ¿El botón ocupará todo el ancho?
    label = "null",                 // Texto del botón y del tooltip
    tooltipPlacement = "right",     // Posición del tooltip
    startContent,                   // Ícono
    onPress,                        // Función a ejecutar cuando se presione el botón
}) => {
    
    return (
        <>
            <Tooltip
                tooltipContent={label}
                isDisabled={!isIconOnly}
                tooltipPlacement={tooltipPlacement}
            >
                <Button
                    aria-label={label + " primary button"}
                    fullWidth={fullWidth}
                    isIconOnly={isIconOnly}
                    isDisabled={isDisabled}
                    isLoading={isLoading}
                    onPress={onPress}
                    type={isSubmit ? "submit" : "button"}
                    spinner={<Spinner/>}
                    startContent={isLoading ? null : (isIconOnly ? null : startContent)}
                    color="primary"
                    size="md"
                    radius="sm"
                    variant="shadow"
                    className={`
                        font-medium n9 
                        ${isSmHidden ? 'sm:hidden' : 'tracking-wide data-[hover=true]:-translate-y-1'}
                    `}
                    >
                    {isIconOnly ? startContent : label}
                </Button>
            </Tooltip>
        </>
    );
}