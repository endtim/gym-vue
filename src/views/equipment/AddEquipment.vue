<script setup>
import { ref } from 'vue'

const equipmentInfo = ref({})

import { addEquipmentService } from '@/api/equipment';
import { ElMessage, ElMessageBox } from 'element-plus';

const clearData = () => {
    equipmentInfo.value = ''
}

const rules = {
    equipmentName: [
        { required: true, message: '请输入器材名称', trigger: 'blur' },
        {
            pattern: /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/,
            message: '只能输入2~10字',
            trigger: 'blur'
        }
    ],
    equipmentLocation: [
        { required: true, message: '请输入放置地址', trigger: 'blur' },
    ],
    equipmentStatus: [
        { required: true, message: '请输入器材状态', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== '正常' && value !== '维修中' && value !== '损坏') {
                    callback(new Error('状态只能是“正常”、“损坏”或“维修中”'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ],
}

const addEquipment = () => {
    ElMessageBox.confirm(
        '确认添加器材吗？',
        'Tips',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //用户点击了确认
            let result = await addEquipmentService(equipmentInfo.value)
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
                <span><strong>添加器材</strong></span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="equipmentInfo" label-width="100px" size="large" :rules="rules">
                    <el-form-item label="器材ID">
                        <el-input disabled placeholder="由系统自动生成"></el-input>
                    </el-form-item>
                    <el-form-item label="器材名称" prop="equipmentName">
                        <el-input v-model="equipmentInfo.equipmentName"></el-input>
                    </el-form-item>
                    <el-form-item label="器材位置" prop="equipmentLocation">
                        <el-input v-model="equipmentInfo.equipmentLocation"></el-input>
                    </el-form-item>
                    <el-form-item label="器材状态" prop="equipmentStatus">
                        <el-input v-model="equipmentInfo.equipmentStatus"></el-input>
                    </el-form-item>
                    <el-form-item label="器材信息">
                        <el-input v-model="equipmentInfo.equipmentMessage"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addEquipment">添加器材</el-button>
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