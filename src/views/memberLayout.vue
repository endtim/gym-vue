<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Coin,
    EditPen,
    SwitchButton,
    CaretBottom,
    Remove,
    Connection
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { ref } from 'vue';

const memberName = ref()

import { memberInfoService } from '@/api/member';
import useMemberInfoStore from '@/stores/memberInfo';
import { useTokenStore } from '@/stores/token';
const tokenStore = useTokenStore();
const memberInfoStore = useMemberInfoStore();

const getMemberName = async () => {
    let result = await memberInfoService();
    memberInfoStore.setInfo(result.data)
}

getMemberName()

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
                memberInfoStore.removeInfo();

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
        router.push('/member/' + command)
    }
}

</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo">健身房管理系统</div>
            <el-menu router background-color="#f0f0f0" unique-opened="true" accordion="true"
                default-active="/member/info">
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <Management />
                        </el-icon>
                        <span>课程管理</span>
                    </template>
                    <el-menu-item index="/member/class">
                        <el-icon>
                            <Connection />
                        </el-icon>
                        <span>选择课程</span>
                    </el-menu-item>
                    <el-menu-item index="/member/withdraw">
                        <el-icon>
                            <Remove />
                        </el-icon>
                        <span>我的选课</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/member/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/member/membership">
                        <el-icon>
                            <Coin />
                        </el-icon>
                        <span>我的会员</span>
                    </el-menu-item>
                    <el-menu-item index="/member/updatePassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>修改密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>你好：<strong>{{ memberInfoStore.info.memberName }}</strong></div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="updatePassword" :icon="EditPen">修改密码</el-dropdown-item>
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

        .el-menu {
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