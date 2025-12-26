import { api } from "./config/api";

export const getNotifications = async () => {
	try {
		const response = await api.get('/notices/my-all-notices')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getNotifications] error:", error);
		throw error
	}
}
