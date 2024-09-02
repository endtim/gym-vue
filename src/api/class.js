import request from '@/utils/request.js'

export const memberClassInfo = (params) => {
    return request.get('/class', { params: params })
}

export const memberClassOrderInfo = (params) => {
    return request.get('/classOrder/myList', { params: params })
}

export const memberSignUp = (id) => {
    return request.post('/classOrder?id=' + id);
}

export const memberWithdrawService = (id) => {
    return request.delete('/classOrder?id=' + id);
}

export const getClassOrderService = (params) => {
    return request.get('/classOrder', { params: params })
}

export const getClassInfoService = (params) => {
    return request.get('/class', { params: params })
}

export const getClassDetailService = (id) => {
    return request.get('/class/detail?id=' + id)
}

export const updateClassInfoService = (classInfo) => {
    return request.put('/class/update', classInfo)
}

export const deleteClassService = (id) => {
    return request.delete('/class>id=' + id)
}

export const addClassService = (classInfo) => {
    return request.post('/class', classInfo)
}

