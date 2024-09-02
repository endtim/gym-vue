import request from '@/utils/request.js'

export const adminLoginService = (adminLoginData) => {

    const params = new URLSearchParams()
    for (let key in adminLoginData) {
        params.append(key, adminLoginData[key])
    }

    return request.post('/admin/login', params)

}

export const getMemberInfoService = (params) => {

    return request.get('/admin', { params: params })
}

export const getMemberDetailService = (id) => {
    return request.get('/admin/detail?account=' + id)
}

export const getMemberShipService = (id) => {
    return request.get('/admin/memberShip?account=' + id)
}

export const updateMemberInfoService = (memberInfo) => {
    return request.put('/admin/update', memberInfo)
}


export const deleteMemberService = (id) => {
    return request.delete('/admin?account=' + id)
}

export const addMemberService = (memberInfoData) => {
    return request.post('/admin/addMember', memberInfoData)
}

export const searchMemberInfo = (account) => {
    return request.get('/admin/list?id=' + account)
}