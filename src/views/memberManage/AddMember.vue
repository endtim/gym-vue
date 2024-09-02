<script setup>
import { ref } from 'vue'

const isEdit = ref("true")

const memberInfo = ref({})

const dialogVisible = ref(false)

const memberAccount = ref()

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
    ],
    memberGender: [
        { required: true, message: '请输入性别', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== '男' && value !== '女') {
                    callback(new Error('性别只能是“男”或“女”'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ],
    points: [
        { required: true, message: '请输入积分', trigger: 'blur' },
        {
            pattern: /^([1-9][0-9]{0,2})$/,
            message: '最高一次购买999积分',
            trigger: 'blur'
        }
    ]
}

import { addMemberService } from '@/api/admin';
import { ElMessage, ElMessageBox } from 'element-plus';

const clearData = () => {
    memberInfo.value = ''
}

const addMember = () => {
    ElMessageBox.confirm(
        '确认添加会员吗？',
        'Tips',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //用户点击了确认
            let result = await addMemberService(memberInfo.value)
            memberAccount.value = result.data
            ElMessage({
                type: 'success',
                message: '添加成功',
            })
            clearData()
            dialogVisible.value = true
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消添加',
            })
        })
}


</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span><strong>添加会员</strong></span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="memberInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="会员账号">
                        <el-input disabled placeholder="会员账号由系统自动生成"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input disabled placeholder="初始密码为123456"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="memberName">
                        <el-input v-model="memberInfo.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="memberGender">
                        <el-input v-model="memberInfo.memberGender"></el-input>
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
                        <el-input v-model="memberInfo.cardTime" disabled placeholder="系统自动导入时间"></el-input>
                    </el-form-item>
                    <el-form-item label="购买积分" prop="points">
                        <el-input v-model="memberInfo.points"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addMember">添加会员</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-dialog v-model="dialogVisible" title="添加成功" width="40%">
            <el-row>
                <el-col :span="12">
                    <span>会员账号为</span><el-input :value="memberAccount" readonly></el-input>
                </el-col>
            </el-row>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">确定</el-button>
                </span>
            </template>
        </el-dialog>

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