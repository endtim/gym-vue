<script setup>
import { ref } from 'vue'


const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

const classModel = ref([{
    classId: 0,
    className: '',
    classBegin: '',
    classTime: '',
    coachId: '',
    coachName: '',
    classPoints: '',
    classMaxMember: '',
    classMember: ''
}])

import { memberClassInfo, memberSignUp } from '@/api/class';

const getClasses = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
    }
    let result = await memberClassInfo(params);
    //渲染列表数据
    classModel.value = result.data.items
    //渲染总条数
    total.value = result.data.total
}

getClasses()

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getClasses()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getClasses()
}

import { ElMessage, ElMessageBox } from 'element-plus';

const signUp = (row) => {
    ElMessageBox.confirm(
        '确认选择该课程？',
        'Warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            //用户点击了确认
            try {
                let result = await memberSignUp(row.classId)
                if (result.code === 0) {
                    ElMessage.success('选课成功')
                    getClasses()
                } else {
                    ElMessage.error(result.message ? result.message : '选课失败')
                }
            } catch (error) {
                ElMessage.error('选课失败')
            }
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消选课',
            })
        })
}



</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span><strong>选择课程</strong></span>
            </div>
        </template>
        <el-table :data="classModel" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="课程名称" prop="className"></el-table-column>
            <el-table-column label="开课时间" prop="classBegin"></el-table-column>
            <el-table-column label="课程时长" prop="classTime"></el-table-column>
            <el-table-column label="教练姓名" prop="coachName"></el-table-column>
            <el-table-column label="课程积分" prop="classPoints"></el-table-column>
            <el-table-column label="最大人数" prop="classMaxMember"></el-table-column>
            <el-table-column label="当前人数" prop="classMember"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button plain type="primary" @click="signUp(row)">选课</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条-->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
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
}
</style>