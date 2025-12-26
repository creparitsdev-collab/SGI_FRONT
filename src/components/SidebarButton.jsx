import { motion, LayoutGroup } from 'framer-motion'

export const SidebarButton = ({
    isDanger = false,       // El hover será del color primary
    isActive = false,       // (Usar solamente en sidebar) ¿El botón está activo? Si sí, será color azul, sino será foreground (blanco / negro)
    label = "null",         // Texto del botón y del tooltip
    startContent,           // Ícono
    onPress,                // Función a ejecutar cuando se presione el botón
    isIconOnly              // ¿El botón es un ícono? Si sí, ignorará el texto del botón, sino lo mostrará
}) => {
    
    // Ponemos el LayoutGroup en el nivel más alto de tu menú (solo hace falta una vez,
    // podrías moverlo fuera y envolver toda la lista de botones)
    return (
        <LayoutGroup>  
            <div className="relative"> {/* ← ahora el padre es relativo */}
                {isActive && (
                    <motion.span
                        layoutId="drawer-layout"
                        layout               // recalcula layout en cada render/scroll
                        transition={{ type: 'spring', stiffness: 900, damping: 60 }}
                        className={`
                        absolute
                        ${isIconOnly
                            ? (label.length > 16 ? "mt-5" : "-left-4 top-3")
                            : (label.length > 22 ? "-left-4 mt-[12px]" : "-left-4 mt-0.5")
                        }
                        w-1 h-8 rounded-full bg-primary
                        `}
                    />
                )}

                <button
                    aria-label={label + " sidebar button"}
                    onClick={onPress}
                    className={`
                        relative z-10 px-4 py-2 rounded-md transition-colors duration-1000 ease-in-out
                        ${isDanger ? 'hover:!text-primary' : 'hover:!text-background-950/60'}
                        ${isIconOnly
                        ? 'min-w-20 min-h-14'
                        : 'min-h-9 -ml-4 rounded-r-md'
                        }
                    `}
                >
                    <div className={`
                        flex ${isIconOnly ? 'flex-col items-center gap-1' : 'items-center gap-2'}
                        ${isActive ? 'text-primary' : ''}
                    `}>
                        {startContent}
                        { !isIconOnly && <p className='text-sm font-medium text-left'>{label}</p> }
                        { isIconOnly && <p className='text-xs font-medium'>{label}</p> }
                    </div>
                </button>
            </div>
        </LayoutGroup>
    )
}

