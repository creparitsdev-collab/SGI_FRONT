import { api } from "./config/api";

export const getCustomers = async () => {
    try {
        const response = await api.get('/customers')

		if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error("[getCustomers] error:", error);
        throw error
    }
}

export const createCustomer = async (customer) => {
	try {
		const response = await api.post('/customers', customer)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[createCustomer] error:", error);
		throw error
	}
}

export const updateCustomer = async (customer, email) => {
	try {
		const response = await api.put(`/customers/${email}`, customer)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[updateCustomer] error:", error);
		throw error
	}
}

export const changeStatus = async (email) => {
	try {
		const response = await api.patch(`/customers/${email}/toggle-status`)

		if (response.status >= 200 && response.status < 300) {
			return response.data
		}

		throw new Error(`Código de estado inesperado: ${response.status}`)
	} catch (error) {
		console.error("[changeStatus] error:", error);
		throw error
	}
}
