import { api } from "./config/api";

export const getMaintenanceTypes = async () => {
	try {
		const response = await api.get('/maintenance-types')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getMaintenanceTypes] error:", error);
		throw error
	}
}

export const createMaintenanceType = async (maintenanceType) => {
	try {
		const response = await api.post('/maintenance-types', maintenanceType)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[createMaintenanceType] error:", error);
		throw error
	}
}

export const updateMaintenanceType = async (maintenanceType) => {
	try {
		const response = await api.put("/maintenance-types", maintenanceType)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[updateMaintenanceType] error:", error);
		throw error
	}
}

export const changeStatus = async (maintenanceType) => {
	try {
		const response = await api.delete(`/maintenance-types/${maintenanceType.id}`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[changeStatus] error:", error);
		throw error
	}
}
