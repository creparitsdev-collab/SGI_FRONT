import { api } from "./config/api"

export const forgotPassword = async (passwordResetRequest) => {
	try {
		const response = await api.post('/auth/forgot-password', passwordResetRequest)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[forgotPassword] error:", error)
		throw error
	}
}

export const validateResetToken = async (token) => {
	try {
		const response = await api.post('/auth/validate-reset-token', null, {params: { token }})

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[validateResetToken] error:", error)
		throw error
	}
}

export const resetPassword = async (request) => {
	try {
		const response = await api.post('/auth/reset-password', request)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[resetPassword] error:", error)
		throw error
	}
}
