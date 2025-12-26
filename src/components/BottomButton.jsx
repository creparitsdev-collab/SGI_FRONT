import { motion } from 'framer-motion'

export const BottomButton = ({
    isActive = false,   // (Usar solamente en bottom) ¿El botón está activo? Si sí, será color azul, sino será foreground (blanco / negro)
    label = "null",     // Texto del botón y del tooltip
    centerContent,      // Ícono
    onPress             // Función a ejecutar cuando se presione el botón
}) => {

    return (
        <>
            <div className="relative flex items-center justify-center">
                {/* Indicador animado */}
                {isActive && (
                    <motion.span
                    layoutId="bottom-layout"
                    className="absolute -bottom-0 transform w-12 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 900, damping: 60 }}
                    />
                )}

                <button
                    className="w-12 h-12 outline-none focus-visible:bg-background-100 rounded-sm sm:hidden"
                    type="button"
                    onClick={onPress}
                >
                    <div 
                        className={`
                            flex flex-col items-center gap-1 duration-500 ease-in-out
                            ${isActive ? 'text-primary' : ''}
                        `}
                    >
                        {centerContent}
                        <p className='text-xs font-medium'>{label}</p>
                    </div>
                </button>
            </div>
        </>
    );
}