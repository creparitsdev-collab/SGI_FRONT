import { api } from "./config/api";

export const getAllMaintenancesToMe = async () => {
	try {
		const response = await api.get(`/maintenance/my-maintenance`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getAllMaintenancesToMe] error:", error);
		throw error
	}
}

export const getMaintenancesByMe = async () => {
	try {
		const response = await api.get(`/maintenance/created-by-me`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getMaintenancesByMe] error:", error);
		throw error
	}
}

export const getMaintenancesToMe = async () => {
	try {
		const response = await api.get(`/maintenance/assigned-to-me`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getMaintenancesToMe] error:", error);
		throw error
	}
}

export const createMaintenance = async (maintenance) => {
	try {
		const response = await api.post('/maintenance', maintenance)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[createMaintenance] error:", error);
		throw error
	}
}

export const updateMaintenance = async (maintenance) => {
	try {
		const response = await api.put(`/maintenance/${maintenance.id}`, maintenance)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[updateMaintenance] error:", error);
		throw error
	}
}

export const changeStatus = async (id) => {
	try {
		const response = await api.put(`/maintenance/update-status/${id}`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[changeStatus] error:", error);
		throw error
	}
}

export const rejectMaintenance = async (id, rejectionReason) => {
	try {
		const response = await api.post(`/maintenance/rejected/${id}`, rejectionReason)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[rejectMaintenance] error:", error);
		throw error
	}
}

export const approveMaintenance = async (id) => {
	try {
		const response = await api.post(`/maintenance/approved/${id}`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[approveMaintenance] error:", error);
		throw error
	}
}

export const submitMaintenanceForReview = async (maintenance) => {
	try {
		const response = await api.post(`/maintenance/submit-for-review`, maintenance)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[submitMaintenanceForReview] error:", error);
		throw error
	}
}

export const inProgressMaintenance = async (id) => {
	try {
		const response = await api.post(`/maintenance/progress/${id}`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[inProgressMaintenance] error:", error);
		throw error
	}
}
