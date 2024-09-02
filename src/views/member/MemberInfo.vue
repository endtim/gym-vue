<script setup>
import { ref } from 'vue'

const isEdit = ref("true")

import useMemberInfoStore from '@/stores/memberInfo';

const memberInfoStore = useMemberInfoStore();
const memberInfo = ref({ ...memberInfoStore.info })



const rules = {
    memberName: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        {
            pattern: /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/,
            message: '只能输入2~10字作为名字',
            trigger: 'blur'
        }
    ],
    memberAge: [
        { required: true, message: '请输入年龄', trigger: 'blur' },
        {
            pattern: /^((1[0-5])|[1-9])?\d$/,
            message: '只能输入最高159岁',
            trigger: 'blur'
        }
    ],
    memberPhone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入11位手机号',
            trigger: 'blur'
        }
    ],
    memberWeight: [
        { required: true, message: '请输入体重', trigger: 'blur' },
        {
            pattern: /[1-9][0-9]$/,
            message: '请取整输入体重',
            trigger: 'blur'
        }
    ],
    memberHeight: [
        { required: true, message: '请输入身高', trigger: 'blur' },
        {
            pattern: /[1-9][0-9]$/,
            message: '请取整输入身高',
            trigger: 'blur'
        }
    ]
}

import { updateMemberInfoService } from '@/api/member';

const change = () => {
    isEdit.value = false
}

import { ElMessage, ElMessageBox } from 'element-plus';


const updateMemberInfo = () => {
    ElMessageBox.confirm(
        '你确认修改信息吗？',
        'FBI Warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //用户点击了确认
            let result = await updateMemberInfoService(memberInfo.value)
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            memberInfoStore.setInfo(memberInfo.value)
            isEdit.value = true
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消修改',
            })
            memberInfo.value = memberInfoStore.info
            isEdit.value = true
        })
}


</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span><strong>基本资料</strong></span>
            </div>
        </template>
        <el-row v-if="isEdit">
            <el-col :span="12">
                <el-form :model="memberInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="会员账号">
                        <el-input v-model="memberInfo.memberAccount" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="nickname">
                        <el-input v-model="memberInfo.memberName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="email">
                        <el-input v-model="memberInfo.memberGender" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="email">
                        <el-input v-model="memberInfo.memberAge" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="email">
                        <el-input v-model="memberInfo.memberPhone" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="身高(cm)" prop="email">
                        <el-input v-model="memberInfo.memberHeight" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="体重(kg)" prop="email">
                        <el-input v-model="memberInfo.memberWeight" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="办卡时间" prop="email">
                        <el-input v-model="memberInfo.cardTime" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="剩余积分" prop="email">
                        <el-input v-model="memberInfo.points" readonly></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="change">编辑信息</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-row v-else>
            <el-col :span="12">
                <el-form :model="memberInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="会员账号">
                        <el-input v-model="memberInfo.memberAccount" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="memberName">
                        <el-input v-model="memberInfo.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-input v-model="memberInfo.memberGender" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="memberAge">
                        <el-input v-model="memberInfo.memberAge"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="memberPhone">
                        <el-input v-model="memberInfo.memberPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="身高(cm)" prop="memberHeight">
                        <el-input v-model="memberInfo.memberHeight"></el-input>
                    </el-form-item>
                    <el-form-item label="体重(kg)" prop="memberWeight">
                        <el-input v-model="memberInfo.memberWeight"></el-input>
                    </el-form-item>
                    <el-form-item label="办卡时间">
                        <el-input v-model="memberInfo.cardTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="剩余积分">
                        <el-input v-model="memberInfo.points" disabled></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateMemberInfo">修改信息</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .el-row {
        margin-left: 60px;
    }

    input:disabled {
        background-color: #5b1616;
        color: #a0a0a0;
    }

}
</style>