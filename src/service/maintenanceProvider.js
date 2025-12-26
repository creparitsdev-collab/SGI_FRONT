import { api } from "./config/api";

export const getMaintenanceProviders = async () => {
    try {
        const response = await api.get('/maintenance-providers')

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error("[getMaintenanceProviders] error:", error);
        throw error
    }
}

export const createMaintenanceProvider = async (maintenanceProvider) => {
	try {
		const response = await api.post('/maintenance-providers', maintenanceProvider)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[createMaintenanceProvider] error:", error);
		throw error
	}
}

export const updateMaintenanceProvider = async (maintenanceProvider) => {
	try {
		const response = await api.put(`/maintenance-providers/${maintenanceProvider.id}`, maintenanceProvider)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[updateMaintenanceProvider] error:", error);
		throw error
	}
}

export const changeStatus = async (maintenanceProvider) => {
	try {
		const response = await api.patch(`/maintenance-providers/${maintenanceProvider.id}/toggle-status`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[changeStatus] error:", error);
		throw error
	}
}
