export function required(value) {
    if (value === null || value.trim().length === 0){
        return "El campo es obligatorio."
    }
}

export function validateDatePicker(value) {
    if (!value) return "La fecha es obligatoria."
    
    // Convertir el objeto CalendarDate a Date en UTC
    const selectedDate = new Date(Date.UTC(
        value.year,
        value.month - 1, // Los meses en JavaScript son 0-indexed
        value.day,
        value.hour || 0,
        value.minute || 0,
        value.second || 0
    ))
    
    // Obtener fecha actual en UTC
    const now = new Date()
    const todayUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    ))
    
    // Fecha máxima (2038-01-19 03:14:07 UTC)
    const maxDate = new Date(Date.UTC(2038, 0, 19, 3, 14, 7))
    
    if (selectedDate < todayUTC) {
        return "La fecha debe ser con un día de anticipación como mínimo."
    }
    
    if (selectedDate > maxDate) {
        return "La fecha no puede ser posterior al 19 de enero de 2038."
    }
    
    return null
}

export function requiredNumber(value) {
    if (Number.isNaN(value)) {
        return "El campo no es válido.";
    } else if (value === null || value === undefined) {
        return "El campo es obligatorio."
    }
}

export function noSpaces(value) {
    if (/\s/.test(value)) {
        return "El campo no puede contener espacios.";
    }
}

export function onlyLetters(value) {
    if (value !== null && !value.match(/^\p{L}+(?:\s\p{L}+)*$/u)){
        return "No se permiten números, símbolos, ni espacios al inicio o final."
    }
}

export function validPhone(value) {
    if (value === null || value === "") {
        return;
    }

    if (!/^[0-9]{10}$/.test(value)) {
        return "Ingresa un número de teléfono valido.";
    }
}

export function validRoleId(value) {
    if (value !== null && !/^[0-9]+$/.test(value)) {
        return "Selecciona una opción válida.";
    }
}

export function validEmail(value) {
    if (value !== null && !value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)){
        return "Ingresa una dirección de correo electrónico valida."
    }
}

export function isValidUUID(token) {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    return uuidRegex.test(token)
}
