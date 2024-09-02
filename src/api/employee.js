import request from '@/utils/request.js'

export const getEmployeeInfoService = (params) => {
    return request.get('/employee', { params: params })
}

export const getEmployeeDetailService = (id) => {
    return request.get('/employee/detail?account=' + id)
}

export const updateEmployeeInfoService = (employeeInfo) => {
    return request.put('/employee', employeeInfo)
}

export const deleteEmployeeService = (id) => {
    return request.delete('/employee?id=' + id)
}

export const addEmployeeService = (employeeInfo) => {
    return request.post('/employee', employeeInfo)
}