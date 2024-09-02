<script setup>
import { ref } from 'vue'


const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

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

const ClassOrderModel = ref([])


import { getClassOrderService } from '@/api/class';


const getClassOrder = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
    }
    let result = await getClassOrderService(params);
    //渲染列表数据
    ClassOrderModel.value = result.data.items
    //渲染总条数
    total.value = result.data.total
}

getClassOrder()

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span><strong>选课信息</strong></span>
            </div>
        </template>
        <el-table :data="ClassOrderModel" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="课程ID" prop="classId"></el-table-column>
            <el-table-column label="课程名称" prop="className"></el-table-column>
            <el-table-column label="教练ID" prop="coachId"></el-table-column>
            <el-table-column label="教练姓名" prop="coachName"></el-table-column>
            <el-table-column label="会员账号" prop="memberAccount"></el-table-column>
            <el-table-column label="会员姓名" prop="memberName"></el-table-column>
            <el-table-column label="开始时间" prop="classBegin"></el-table-column>
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