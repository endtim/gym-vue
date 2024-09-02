<script setup>
import {
    Management,
    UserFilled,
    User,
    Coin,
    EditPen,
    SwitchButton,
    CaretBottom,
    Remove,
    Connection,
    Aim,
    DocumentAdd,
    Document,
    CirclePlus,
    Stamp,
    SetUp,
    Briefcase,
    Postcard
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useTokenStore } from '@/stores/token';
const tokenStore = useTokenStore();


import { useRouter } from 'vue-router';
const router = useRouter();
import { ElMessage, ElMessageBox } from 'element-plus';

const handleCommand = (command) => {
    //判断命令
    if (command === 'logout') {

        ElMessageBox.confirm(
            '确认退出登录',
            'Warning',
            {
                confirmButtonText: '退出登录',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                //清除本地token和userInfo
                tokenStore.removeToken();

                //2.跳转到登录页面
                router.push('/login')

                ElMessage({
                    type: 'success',
                    message: '退出登录成功',
                })
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消退出',
                })
            })
    } else {
        router.push('/admin/' + command + '/manage')
    }
}

</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo">健身房管理系统</div>
            <el-menu router background-color="#f0f0f0" unique-opened="true" accordion="true"
                default-active="/admin/member/search">
                <el-menu-item index="/admin/member/search" style="margin-bottom: 30px;">
                    <el-icon>
                        <Aim />
                    </el-icon>
                    <span>快速查询</span>
                </el-menu-item>
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <Management />
                        </el-icon>
                        <span>课程管理</span>
                    </template>
                    <el-menu-item index="/admin/class/manage">
                        <el-icon>
                            <Connection />
                        </el-icon>
                        <span>课程查询</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/class/add">
                        <el-icon>
                            <DocumentAdd />
                        </el-icon>
                        <span>添加课程</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/class/classOrder">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <span>选课信息</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon>
                            <Stamp />
                        </el-icon>
                        <span>员工管理</span>
                    </template>
                    <el-menu-item index="/admin/employee/manage">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>员工信息</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/employee/add">
                        <el-icon>
                            <CirclePlus />
                        </el-icon>
                        <span>添加员工</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>
                        <el-icon>
                            <Briefcase />
                        </el-icon>
                        <span>器材管理</span>
                    </template>
                    <el-menu-item index="/admin/equipment/manage">
                        <el-icon>
                            <SetUp />
                        </el-icon>
                        <span>器材信息</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/equipment/add">
                        <el-icon>
                            <Coin />
                        </el-icon>
                        <span>添加器材</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="4">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>会员管理</span>
                    </template>
                    <el-menu-item index="/admin/member/manage">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>会员信息</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/member/add">
                        <el-icon>
                            <Postcard />
                        </el-icon>
                        <span>添加会员</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>你好：<span><strong>管理员</strong></span></div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="member" :icon="UserFilled">会员管理</el-dropdown-item>
                            <el-dropdown-item command="employee" :icon="Stamp">员工管理</el-dropdown-item>
                            <el-dropdown-item command="equipment" :icon="Briefcase">器材管理</el-dropdown-item>
                            <el-dropdown-item command="class" :icon="Management">课程管理</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>©2023 Created by Wu</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #f0f0f0;

        &__logo {
            height: 60px;
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            background-color: rgb(17, 16, 16);
        }

        & .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: rgb(17, 16, 16);
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>