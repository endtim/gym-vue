<script setup>
import { ref } from 'vue'

const employeeInfo = ref({})

const dialogVisible = ref(false)


const rules = {
    employeeName: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        {
            pattern: /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/,
            message: '只能输入2~10字作为名字',
            trigger: 'blur'
        }
    ],
    employeeAge: [
        { required: true, message: '请输入年龄', trigger: 'blur' },
        {
            pattern: /^((1[0-5])|[1-9])?\d$/,
            message: '只能输入最高159岁',
            trigger: 'blur'
        }
    ],
    employeeGender: [
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
    staff: [
        { required: true, message: '请输入职务', trigger: 'blur' },
    ],
}

import { addEmployeeService } from '@/api/employee';
import { ElMessage, ElMessageBox } from 'element-plus';

const clearData = () => {
    employeeInfo.value = ''
}

const addEmployee = () => {
    ElMessageBox.confirm(
        '确认添加员工吗？',
        'Tips',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //用户点击了确认
            let result = await addEmployeeService(employeeInfo.value)
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
                <span><strong>添加员工</strong></span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="employeeInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="员工编号">
                        <el-input disabled placeholder="将由系统自动生成"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="employeeName">
                        <el-input v-model="employeeInfo.employeeName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="employeeGender">
                        <el-input v-model="employeeInfo.employeeGender"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="employeeAge">
                        <el-input v-model="employeeInfo.employeeAge"></el-input>
                    </el-form-item>
                    <el-form-item label="职务" prop="staff">
                        <el-input v-model="employeeInfo.staff"></el-input>
                    </el-form-item>
                    <el-form-item label="员工情况">
                        <el-input v-model="employeeInfo.employeeMessage"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addEmployee">添加员工</el-button>
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