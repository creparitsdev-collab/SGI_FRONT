import { api } from './config/api'

// ==================== PRODUCTOS ====================

export const getProducts = async (page = 0, size = 100, stockCatalogueId = null, statusId = null) => {
    try {
        const response = await api.get('/products', {
            params: {
                page,
                size,
                stockCatalogueId,
                statusId,
            },
        })
        return response.data
    } catch (error) {
        console.error('[getProducts] Error:', error)
        throw error
    }
}

export const createProduct = async (productData) => {
    try {
        const response = await api.post('/products', productData)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[createProduct] Error:', error)
        throw error
    }
}

export const getProductByQrHash = async (hash) => {
    try {
        const response = await api.get(`/products/qr/${hash}`)
        return response.data
    } catch (error) {
        console.error('[getProductByQrHash] Error:', error)
        throw error
    }
}

export const getQrCodeImage = async (hash) => {
    try {
        const response = await api.get(`/products/qr/${hash}/image`, {
            responseType: 'blob',
        })
        return response.data
    } catch (error) {
        console.error('[getQrCodeImage] Error:', error)
        throw error
    }
}

export const updateProduct = async (productData) => {
    try {
        const response = await api.put('/products', productData)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[updateProduct] Error:', error)
        throw error
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/products/${id}`)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[deleteProduct] Error:', error)
        throw error
    }
}

// ==================== CATÁLOGOS DE STOCK ====================

export const getStockCatalogues = async (search = '') => {
    try {
        const response = await api.get('/stock-catalogues', {
            params: {
                ...(search && { search }),
            },
        })
        return response.data
    } catch (error) {
        console.error('[getStockCatalogues] Error:', error)
        throw error
    }
}

export const createStockCatalogue = async (catalogueData) => {
    try {
        const response = await api.post('/stock-catalogues', catalogueData)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[createStockCatalogue] Error:', error)
        throw error
    }
}

export const updateStockCatalogue = async (catalogueData) => {
    try {
        const response = await api.put('/stock-catalogues', catalogueData)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[updateStockCatalogue] Error:', error)
        throw error
    }
}

export const deleteStockCatalogue = async (id) => {
    try {
        const response = await api.delete(`/stock-catalogues/${id}`)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[deleteStockCatalogue] Error:', error)
        throw error
    }
}

export const toggleStockCatalogueStatus = async (id) => {
    try {
        const response = await api.patch(`/stock-catalogues/${id}/toggle-status`)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[toggleStockCatalogueStatus] Error:', error)
        throw error
    }
}

export const getStockCatalogueById = async (id) => {
    try {
        const response = await api.get(`/stock-catalogues/${id}`)
        return response.data
    } catch (error) {
        console.error('[getStockCatalogueById] Error:', error)
        throw error
    }
}

// ==================== ESTADOS DE PRODUCTOS ====================

export const getProductStatuses = async () => {
    try {
        const response = await api.get('/product-statuses')
        return response.data
    } catch (error) {
        console.error('[getProductStatuses] Error:', error)
        throw error
    }
}

export const createProductStatus = async (statusData) => {
    try {
        const response = await api.post('/product-statuses', statusData)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[createProductStatus] Error:', error)
        throw error
    }
}

export const updateProductStatus = async (statusData) => {
    try {
        const response = await api.put('/product-statuses', statusData)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[updateProductStatus] Error:', error)
        throw error
    }
}

export const deleteProductStatus = async (id) => {
    try {
        const response = await api.delete(`/product-statuses/${id}`)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[deleteProductStatus] Error:', error)
        throw error
    }
}

export const getProductStatusById = async (id) => {
    try {
        const response = await api.get(`/product-statuses/${id}`)
        return response.data
    } catch (error) {
        console.error('[getProductStatusById] Error:', error)
        throw error
    }
}

// ==================== MOVIMIENTOS DE STOCK ====================

export const getStockMovements = async (page = 0, size = 10, stockCatalogueId = null, tipoMovimiento = null, fechaInicio = null, fechaFin = null) => {
    try {
        const response = await api.get('/stock-movements', {
            params: {
                page,
                size,
                stockCatalogueId,
                tipoMovimiento,
                fechaInicio,
                fechaFin,
            },
        })
        return response.data
    } catch (error) {
        console.error('[getStockMovements] Error:', error)
        throw error
    }
}

export const getUnitsOfMeasurement = async () => {
    try {
        const response = await api.get('/units-of-measurement')
        return response.data
    } catch (error) {
        console.error('[getUnitsOfMeasurement] Error:', error)
        throw error
    }
}

export const createUnitOfMeasurement = async (unitData) => {
    try {
        const response = await api.post('/units-of-measurement', unitData)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[createUnitOfMeasurement] Error:', error)
        throw error
    }
}

export const updateUnitOfMeasurement = async (unitData) => {
    try {
        const response = await api.put(`/units-of-measurement/${unitData.id}`, unitData)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[updateUnitOfMeasurement] Error:', error)
        throw error
    }
}

export const deleteUnitOfMeasurement = async (id) => {
    try {
        const response = await api.delete(`/units-of-measurement/${id}`)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[deleteUnitOfMeasurement] Error:', error)
        throw error
    }
}

export const getWarehouseTypes = async () => {
    try {
        const response = await api.get('/warehouse-types')
        return response.data
    } catch (error) {
        console.error('[getWarehouseTypes] Error:', error)
        throw error
    }
}

export const createWarehouseType = async (warehouseTypeData) => {
    try {
        const response = await api.post('/warehouse-types', warehouseTypeData)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[createWarehouseType] Error:', error)
        throw error
    }
}

export const updateWarehouseType = async (warehouseTypeData) => {
    try {
        const response = await api.put(`/warehouse-types/${warehouseTypeData.id}`, warehouseTypeData)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[updateWarehouseType] Error:', error)
        throw error
    }
}

export const deleteWarehouseType = async (id) => {
    try {
        const response = await api.delete(`/warehouse-types/${id}`)

        if (response.status >= 200 && response.status < 300) {
            return response.data
        }

        throw new Error(`Código de estado inesperado: ${response.status}`)
    } catch (error) {
        console.error('[deleteWarehouseType] Error:', error)
        throw error
    }
}
