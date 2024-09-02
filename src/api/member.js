import request from '@/utils/request.js'


export const memberLoginService = (loginData) => {

    const params = new URLSearchParams()
    for (let key in loginData) {
        params.append(key, loginData[key])
    }

    return request.post('/member/login', params)

}

export const memberInfoService = () => {

    return request.get('/member/memberInfo')
}

export const updateMemberInfoService = (memberInfo) => {

    return request.put('/member/update', memberInfo)
}

export const memberUpdatePwdService = (passWordData) => {
    return request.patch('/member/updatePwd', passWordData)
}

export const memberShipService = () => {
    return request.get('/member/membership')
}

export const buyMemberShipService = (membershipType) => {
    return request.post('/member/membership?membershipType=' + membershipType)
}