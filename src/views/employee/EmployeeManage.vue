<script setup>
import { ref } from 'vue'


const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getEmployeeInfo()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getEmployeeInfo()
}


import { deleteMemberService, getMemberDetailService, getMemberInfoService, getMemberShipService, updateMemberInfoService } from '@/api/admin';
import { getEmployeeInfoService, getEmployeeDetailService, updateEmployeeInfoService, deleteEmployeeService } from '@/api/employee';
const employeeModel = ref([])



const getEmployeeInfo = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
    }
    let result = await getEmployeeInfoService(params);
    //渲染列表数据
    employeeModel.value = result.data.items
    //渲染总条数
    total.value = result.data.total
}

getEmployeeInfo()



import { ElMessage, ElMessageBox } from 'element-plus';


const employeeInfo = ref([])
const employeeEditInfo = ref([])

const dialogVisible = ref(false)
const isEdit = ref(true)


const getEmployeeDetail = async (row) => {
    dialogVisible.value = true
    let result = await getEmployeeDetailService(row.employeeAccount)
    employeeInfo.value = result.data
    employeeEditInfo.value = result.data
}

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
    ]
}

const updateEmployeeInfo = () => {
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
            let result = await updateEmployeeInfoService(employeeInfo.value)
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            getEmployeeInfo()
            isEdit.value = true
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消修改',
            })
            employeeInfo.value = employeeEditInfo.value
            getEmployeeInfo()
            isEdit.value = true
        })
}

const deleteEmployee = (row) => {
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
                let result = await deleteEmployeeService(row.employeeAccount)
                if (result.code === 0) {
                    ElMessage.success('删除成功')
                    getEmployeeInfo()
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
                <span><strong>员工信息</strong></span>
            </div>
        </template>
        <el-table :data="employeeModel" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="员工编号" prop="employeeAccount"></el-table-column>
            <el-table-column label="姓名" prop="employeeName"></el-table-column>
            <el-table-column label="性别" prop="employeeGender"></el-table-column>
            <el-table-column label="年龄" prop="employeeAge"></el-table-column>
            <el-table-column label="职务" prop="staff"></el-table-column>
            <el-table-column label="入职时间" prop="entryTime"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button plain type="primary" @click="getEmployeeDetail(row)">详情</el-button>
                    <el-button plain type="danger" @click="deleteEmployee(row)">删除</el-button>
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
                <el-form :model="employeeInfo" label-width="100px">
                    <el-form-item label="员工编号">
                        <el-input v-model="employeeInfo.employeeAccount" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="employeeInfo.employeeName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-input v-model="employeeInfo.employeeGender" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="年龄">
                        <el-input v-model="employeeInfo.employeeAge" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="入职时间">
                        <el-input v-model="employeeInfo.entryTime" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="职务">
                        <el-input v-model="employeeInfo.staff" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="员工情况">
                        <el-input v-model="employeeInfo.employeeMessage" readonly></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-row v-else>
            <el-col :span="12">
                <el-form :model="employeeInfo" label-width="100px" :rules="rules">
                    <el-form-item label="员工编号">
                        <el-input v-model="employeeInfo.employeeAccount" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="employeeName">
                        <el-input v-model="employeeInfo.employeeName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-input v-model="employeeInfo.employeeGender" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="employeeAge">
                        <el-input v-model="employeeInfo.employeeAge"></el-input>
                    </el-form-item>
                    <el-form-item label="入职时间">
                        <el-input v-model="employeeInfo.entryTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="职务">
                        <el-input v-model="employeeInfo.staff"></el-input>
                    </el-form-item>
                    <el-form-item label="员工情况">
                        <el-input v-model="employeeInfo.employeeMessage"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateEmployeeInfo">修改信息</el-button>
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