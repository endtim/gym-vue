import request from '@/utils/request.js'

export const getEquipmentInfoService = (params) => {
    return request.get('/equipment', { params: params })
}

export const getEquipmentDetailService = (id) => {
    return request.get('/equipment/detail?id=' + id)
}

export const updateEquipmentInfoService = (EquipmentInfo) => {
    return request.put('/equipment', EquipmentInfo)
}

export const deleteEquipmentService = (id) => {
    return request.delete('/equipment?id=' + id)
}

export const addEquipmentService = (EquipmentInfo) => {
    return request.post('/equipment', EquipmentInfo)
}