<script setup>
import { ref } from 'vue'


const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getClassInfo()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getClassInfo()
}



import { deleteClassService, getClassDetailService, getClassInfoService, updateClassInfoService } from '@/api/class';

const classModel = ref([])



const getClassInfo = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
    }
    let result = await getClassInfoService(params);
    //渲染列表数据
    classModel.value = result.data.items
    //渲染总条数
    total.value = result.data.total
}

getClassInfo()



import { ElMessage, ElMessageBox } from 'element-plus';


const classInfo = ref([])
const classEditInfo = ref([])

const dialogVisible = ref(false)
const isEdit = ref(true)

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

const getClassDetail = async (row) => {
    dialogVisible.value = true
    let result = await getClassDetailService(row.classId)
    classInfo.value = result.data
    classEditInfo.value = result.data
}

const updateClassInfo = () => {
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
            let result = await updateClassInfoService(classInfo.value)
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            getClassInfo()
            isEdit.value = true
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消修改',
            })
            classInfo.value = classEditInfo.value
            getClassInfo()
            isEdit.value = true
        })
}

const deleteClass = (row) => {
    ElMessageBox.confirm(
        '确认删除？',
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
                let result = await deleteClassService(row.classId)
                if (result.code === 0) {
                    ElMessage.success('删除成功,对应积分已返还报名学员')
                    getClassInfo()
                } else {
                    ElMessage.error(result.message ? result.message : '删除失败')
                }
            } catch (error) {
                ElMessage.error('删除失败')
            }
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span><strong>课程信息</strong></span>
            </div>
        </template>
        <el-table :data="classModel" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="课程名称" prop="className"></el-table-column>
            <el-table-column label="开始时间" prop="classBegin"></el-table-column>
            <el-table-column label="教练ID" prop="coachId"></el-table-column>
            <el-table-column label="教练姓名" prop="coachName"></el-table-column>
            <el-table-column label="课程积分" prop="classPoints"></el-table-column>
            <el-table-column label="现有人数" prop="classMember"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button plain type="primary" @click="getClassDetail(row)">详情</el-button>
                    <el-button plain type="danger" @click="deleteClass(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" title="详细信息" width="40%">
        <el-row v-if="isEdit">
            <el-col :span="12">
                <el-form :model="classInfo" label-width="100px">
                    <el-form-item label="课程ID">
                        <el-input v-model="classInfo.classId" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="课程名称">
                        <el-input v-model="classInfo.className" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-input v-model="classInfo.classBegin" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="课程时长">
                        <el-input v-model="classInfo.classTime" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="教练ID">
                        <el-input v-model="classInfo.coachId" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="教练姓名">
                        <el-input v-model="classInfo.coachName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="课程积分">
                        <el-input v-model="classInfo.classPoints" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="最大人数">
                        <el-input v-model="classInfo.classMaxMember" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="现有人数">
                        <el-input v-model="classInfo.classMember" readonly></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-row v-else>
            <el-col :span="12">
                <el-form :model="classInfo" label-width="100px" :rules>
                    <el-form-item label="课程ID">
                        <el-input v-model="classInfo.classId" disabled></el-input>
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
                        <el-input v-model="classInfo.coachName" disabled placeholder="系统自动更新"></el-input>
                    </el-form-item>
                    <el-form-item label="课程积分" prop="classPoints">
                        <el-input v-model="classInfo.classPoints"></el-input>
                    </el-form-item>
                    <el-form-item label="最大人数" prop="classMaxMember">
                        <el-input v-model="classInfo.classMaxMember"></el-input>
                    </el-form-item>
                    <el-form-item label="现有人数">
                        <el-input v-model="classInfo.classMember" disabled></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateClassInfo">修改信息</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="isEdit = false">编辑</el-button>
                <el-button @click="dialogVisible = false, isEdit = true">取消</el-button>
            </span>
        </template>
    </el-dialog>

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