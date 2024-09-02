<script setup>
import { ref } from 'vue'


const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

const classModel = ref([{
    className: '',
    classBegin: '',
    coachId: '',
    coachName: '',
    memberAccount: '',
    memberName: '',
}])

import { memberClassOrderInfo, memberWithdrawService } from '@/api/class';

const getClassOrder = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
    }
    let result = await memberClassOrderInfo(params);
    //渲染列表数据
    classModel.value = result.data.items
    //渲染总条数
    total.value = result.data.total
}

getClassOrder()

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getClassOrder()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getClassOrder()
}

import { ElMessage, ElMessageBox } from 'element-plus';

const withdraw = (row) => {
    ElMessageBox.confirm(
        '确认退选该课程？',
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
                let result = await memberWithdrawService(row.classOrderId)
                if (result.code === 0) {
                    ElMessage.success('退课成功')
                    getClassOrder()
                } else {
                    ElMessage.error(result.message ? result.message : '退课失败')
                }
            } catch (error) {
                ElMessage.error('退课失败')
            }
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消退课',
            })
        })
}



</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span><strong>我的课程</strong></span>
            </div>
        </template>
        <el-table :data="classModel" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="课程名称" prop="className"></el-table-column>
            <el-table-column label="教练姓名" prop="coachName"></el-table-column>
            <el-table-column label="会员账号" prop="memberAccount"></el-table-column>
            <el-table-column label="会员姓名" prop="memberName"></el-table-column>
            <el-table-column label="开课时间" prop="classBegin"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button plain type="danger" @click="withdraw(row)">退课</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="暂时没有选课记录" />
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