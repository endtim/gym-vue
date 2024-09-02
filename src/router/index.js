import { createRouter, createWebHistory } from 'vue-router'

import loginVue from '@/views/Login.vue'
import Layout from '@/views/memberLayout.vue';
import adminLayout from '@/views/adminLayout.vue';
import MemberInfo from '@/views/member/MemberInfo.vue';
import MemberPwd from '@/views/member/MemberPwd.vue';
import MemberClass from '@/views/member/MemberClass.vue';
import MemberClassOrder from '@/views/member/MemberClassOrder.vue';
import MemberShip from '@/views/member/MemberShip.vue';
import MemberManage from '@/views/memberManage/MemberManage.vue';
import AddMember from '@/views/memberManage/AddMember.vue';
import EmployeeManage from '@/views/employee/EmployeeManage.vue';
import AddEmployee from '@/views/employee/AddEmployee.vue';
import EquipmentManage from '@/views/equipment/EquipmentManage.vue';
import AddEquipment from '@/views/equipment/AddEquipment.vue';
import ClassManage from '@/views/class/ClassManage.vue';
import AddClass from '@/views/class/AddClass.vue';
import ClassOrder from '@/views/class/ClassOrder.vue';
import QuickSearch from '@/views/memberManage/QuickSearch.vue';


const routes = [
    { path: '/login', component: loginVue },
    {
        path: '/', component: Layout, redirect: '/member/info',
        children: [
            { path: '/member/class', component: MemberClass },
            { path: '/member/withdraw', component: MemberClassOrder },
            { path: '/member/info', component: MemberInfo },
            { path: '/member/membership', component: MemberShip },
            { path: '/member/updatePassword', component: MemberPwd },
        ]
    },
    {
        path: '/admin', component: adminLayout, redirect: '/admin/member/search',
        children: [
            { path: '/admin/member/manage', component: MemberManage },
            { path: '/admin/member/add', component: AddMember },
            { path: '/admin/member/search', component: QuickSearch },
            { path: '/admin/employee/manage', component: EmployeeManage },
            { path: '/admin/employee/add', component: AddEmployee },
            { path: '/admin/equipment/manage', component: EquipmentManage },
            { path: '/admin/equipment/add', component: AddEquipment },
            { path: '/admin/class/manage', component: ClassManage },
            { path: '/admin/class/add', component: AddClass },
            { path: '/admin/class/classOrder', component: ClassOrder },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router
