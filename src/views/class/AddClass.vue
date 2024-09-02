<script setup>
import { ref } from 'vue'

const classInfo = ref({})


const rules = {
    className: [
        { required: true, message: '请输入课程名', trigger: 'blur' },
        {
            pattern: /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/,
            message: '只能输入2~10字',
            trigger: 'blur'
        }
    ],
    classTime: [
        { required: true, message: '请输入课程时长', trigger: 'blur' },
        {
            pattern: /[1-9][0-9]$/,
            message: '请取整输入',
            trigger: 'blur'
        }
    ],
    coachId: [
        { required: true, message: '请输入教练ID', trigger: 'blur' },
    ],

    classPoints: [
        { required: true, message: '请输入课程所需积分', trigger: 'blur' },
        {
            pattern: /[1-9][0-9]$/,
            message: '请取整输入',
            trigger: 'blur'
        }
    ],
    classMaxMember: [
        { required: true, message: '请输入课程最大人数', trigger: 'blur' },
        {
            pattern: /[1-9][0-9]$/,
            message: '请取整输入',
            trigger: 'blur'
        }
    ],

}

import { ElMessage, ElMessageBox } from 'element-plus';
import { addClassService } from '@/api/class';

const clearData = () => {
    classInfo.value = ''
}

const addClass = () => {
    ElMessageBox.confirm(
        '确认添加课程吗？',
        'Tips',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //用户点击了确认
            let result = await addClassService(classInfo.value)
            ElMessage({
                type: 'success',
                message: '添加成功',
            })
            clearData()
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
                <span><strong>添加课程</strong></span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="classInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="课程编号">
                        <el-input disabled placeholder="将由系统自动生成"></el-input>
                    </el-form-item>
                    <el-form-item label="课程名称" prop="className">
                        <el-input v-model="classInfo.className"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-date-picker v-model="classInfo.classBegin" type="datetime" format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss" placeholder="Select date and time" />
                    </el-form-item>
                    <el-form-item label="课程时长" prop="classTime">
                        <el-input v-model="classInfo.classTime"></el-input>
                    </el-form-item>
                    <el-form-item label="教练ID" prop="coachId">
                        <el-input v-model="classInfo.coachId"></el-input>
                    </el-form-item>
                    <el-form-item label="教练姓名">
                        <el-input placeholder="系统自动导入" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="课程积分" prop="classPoints">
                        <el-input v-model="classInfo.classPoints"></el-input>
                    </el-form-item>
                    <el-form-item label="最大人数" prop="classMaxMember">
                        <el-input v-model="classInfo.classMaxMember"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addClass">添加课程</el-button>
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