import { api } from "./config/api";

export const getScheduledMaintenancesByMe = async () => {
	try {
		const response = await api.get(`/scheduled-maintenance/created-by-me`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getScheduledMaintenancesByMe] error:", error);
		throw error
	}
}

export const getScheduledMaintenancesToMe = async () => {
	try {
		const response = await api.get(`/scheduled-maintenance/assigned-to-me`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getScheduledMaintenancesToMe] error:", error);
		throw error
	}
}

export const updateScheduledMaintenance = async (maintenance) => {
	try {
		const response = await api.put(`/scheduled-maintenance/${maintenance.id}`, maintenance)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[updateScheduledMaintenance] error:", error);
		throw error
	}
}
