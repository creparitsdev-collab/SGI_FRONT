import { Tooltip as HeroUITooltip } from "@heroui/react";

export const Tooltip = ({
    isDisabled = false,             // ¿Se deshabilitará el tooltip?
    tooltipPlacement = "right",     // Posición del tooltip
    tooltipContent = "null",        // Texto del tooltip
    children                        // Botón
}) => {

    return (
        <>
            <HeroUITooltip
                classNames={{ content: "dark:bg-background-200 bg-background border-0 text-current"}}
                isDisabled={isDisabled}
                radius='sm'
                color="primary"
                className="text-sm font-medium"
                placement={tooltipPlacement}
                closeDelay={0}
                delay={0}
                content={ 
                    <div className="flex justify-center items-center m-1">
                        {tooltipContent}
                    </div>
                }
            >
                {children}
            </HeroUITooltip>
        </>
    );
}