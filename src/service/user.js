import { api } from "./config/api";

export const getUsers = async () => {
	try {
		const response = await api.get('/users')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getUsers] error:", error);
		throw error
	}
}

export const getUsersButMe = async () => {
	try {
		const response = await api.get('/users/ButMe')

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getUsersButMe] error:", error);
		throw error
	}
}

export const getProfile = async () => {
	try {
		const response = await api.get("/users/profile")

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[getProfile] error:", error);
		throw error
	}
}

export const createUser = async (user) => {
	try {
		const response = await api.post('/users', user)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[createUser] error:", error);
		throw error
	}
}

export const updateUser = async (user) => {
	try {
		const response = await api.put('/users', user)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[updateUser] error:", error);
		throw error
	}
}

export const updateProfile = async (user) => {
	try {
		const response = await api.put('/users/profile', user)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[updateProfile] error:", error);
		throw error
	}
}

export const changeStatus = async (email) => {
	try {
		const response = await api.delete(`/users/${email}`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[changeStatus] error:", error);
		throw error
	}
}

export const changePassword = async (passwords) => {
	try {
		const response = await api.post('/users/change-password', passwords)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[changePassword] error:", error);
		throw error
	}
}
