<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const isAdmin = ref(false)

const loginData = ref({
    memberAccount: '',
    password: '',
})

const adminLoginData = ref({
    adminAccount: '',
    password: '',
})


const validateAccount = (memberRules, value, callback) => {
    const regex = /^[0-9]+$/;
    if (!value) {
        callback(new Error('请输入账号'));
    } else if (!regex.test(value)) {
        callback(new Error('请输入纯数字会员账号'));
    } else {
        callback();
    }
};


const validateAdminAccount = (adminRules, value, callback) => {
    const regex = /^[0-9]+$/;
    if (!value) {
        callback(new Error('请输入账号'));
    } else if (!regex.test(value)) {
        callback(new Error('请输入纯数字管理员账号'));
    } else {
        callback();
    }
};


const memberRules = {
    memberAccount: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { validator: validateAccount, trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度为6~16位非空字符', trigger: 'blur' }
    ]

}

const adminRules = {
    adminAccount: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { validator: validateAdminAccount, trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度为6~16位非空字符', trigger: 'blur' }
    ]

}

//导入token状态
import { useTokenStore } from '@/stores/token.js'

//调用useTokenStore得到状态
const tokenStore = useTokenStore();


import { memberLoginService } from '@/api/member.js'
import { adminLoginService } from '@/api/admin.js';


const login = async () => {
    let result = await memberLoginService(loginData.value)
    tokenStore.setToken(result.data)
    ElMessage.success('登录成功')
    router.push('/')
}

const adminLogin = async () => {
    let result = await adminLoginService(adminLoginData.value)
    tokenStore.setToken(result.data)
    ElMessage.success('登录成功')
    router.push('/admin')
}


const clearLoginData = () => {
    loginData.value = {
        memberAccount: '',
        password: '',
    }
}

const clearAdminLoginData = () => {
    adminLoginData.value = {
        adminAccount: '',
        password: '',
    }
}

</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 会员登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="!isAdmin" :model='loginData' :rules="memberRules">
                <el-form-item>
                    <h1>会员登录</h1>
                </el-form-item>
                <el-form-item prop="memberAccount">
                    <el-input :prefix-icon="User" placeholder="请输入账号" v-model="loginData.memberAccount"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"
                        show-password></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">
                        登录
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isAdmin = true, clearLoginData()">
                        ← 管理员登陆
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="adminLoginData" :rules="adminRules">
                <el-form-item>
                    <h1>管理员登录</h1>
                </el-form-item>
                <el-form-item prop="adminAccount">
                    <el-input :prefix-icon="User" placeholder="请输入账号" v-model="adminLoginData.adminAccount"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                        v-model="adminLoginData.password" show-password></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="adminLogin">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isAdmin = false, clearAdminLoginData()">
                        会员登陆 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/background.jpeg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>