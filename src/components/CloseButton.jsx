import { DismissFilled } from "@fluentui/react-icons";

export const CloseButton = ({ 
    onPress     // Función a ejecutar cuando se presione el botón
}) => {
    
    return (
        <>
            <button
                aria-label="Botón para cerrar los drawer"
                className="outline-none text-background-500 focus:text-current transition-all ease-in-out duration-500"
                type="button"
                onClick={onPress}
            >
                <DismissFilled className='size-5' />
            </button>
        </>
    );
}