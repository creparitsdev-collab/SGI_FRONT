import { api } from "./config/api";

export const getLogs = async () => {
	try {
		const response = await api.get('/audit-logs')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getLogs] error:", error);
		throw error
	}
}
