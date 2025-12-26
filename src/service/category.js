import { api } from "./config/api";

export const getCategories = async () => {
	try {
		const response = await api.get('/equipment-categories')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getCategories] error:", error);
		throw error
	}
}

export const createCategory = async (category) => {
	try {
		const response = await api.post('/equipment-categories', category)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[createCategory] error:", error);
		throw error
	}
}

export const updateCategory = async (category) => {
	try {
		const response = await api.put(`/equipment-categories/${category.id}`, category)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[updateCategory] error:", error);
		throw error
	}
}

export const changeStatus = async (category) => {
	try {
		const response = await api.patch(`/equipment-categories/${category.id}/toggle-status`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[changeStatus] error:", error);
		throw error
	}
}
