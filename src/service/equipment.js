import { api } from "./config/api";

export const getEquipments = async () => {
	try {
		const response = await api.get('/equipment')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getEquipments] error:", error);
		throw error
	}
}

export const createEquipment = async (equipment) => {
	try {
		const response = await api.post('/equipment', equipment)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[createEquipment] error:", error);
		throw error
	}
}

export const createEquipmentWithMaintenances = async (EquipmentWithMaintenances) => {
	try {
		const response = await api.post('/equipment/withMaintenances', EquipmentWithMaintenances)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[createEquipmentWithMaintenances] error:", error);
		throw error
	}
}

export const updateEquipment = async (equipment) => {
	try {
		const response = await api.put(`/equipment/${equipment.id}`, equipment)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[updateEquipment] error:", error);
		throw error
	}
}

export const changeStatus = async (id) => {
	try {
		const response = await api.patch(`/equipment/${id}/toggle-status`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[changeStatus] error:", error);
		throw error
	}
}
