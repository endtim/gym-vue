<script setup>
import { ref } from 'vue'
import { deleteEquipmentService, getEquipmentDetailService, getEquipmentInfoService, updateEquipmentInfoService } from '@/api/equipment';

const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getEquipmentInfo()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getEquipmentInfo()
}




const equipmentModel = ref([])

const status = ref('')


const getEquipmentInfo = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        status: status.value ? status.value : null
    }
    let result = await getEquipmentInfoService(params);
    //渲染列表数据
    equipmentModel.value = result.data.items
    //渲染总条数
    total.value = result.data.total
}

getEquipmentInfo()



import { ElMessage, ElMessageBox } from 'element-plus';


const equipmentInfo = ref([])
const equipmentEditInfo = ref([])

const dialogVisible = ref(false)
const isEdit = ref(true)


const getEquipmentDetail = async (row) => {
    dialogVisible.value = true
    let result = await getEquipmentDetailService(row.equipmentId)
    equipmentInfo.value = result.data
    equipmentEditInfo.value = result.data
}

const rules = {
    equipmentStatus: [
        { required: true, message: '请输入状态', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                if (value !== '正常' && value !== '损坏' && value !== '维修中') {
                    callback(new Error('只能是"正常"、"损坏"或"维修中"'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ]
}

const updateEquipmentInfo = () => {
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
            let result = await updateEquipmentInfoService(equipmentInfo.value)
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            getEquipmentInfo()
            isEdit.value = true
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消修改',
            })
            equipmentInfo.value = equipmentEditInfo.value
            getEquipmentInfo()
            isEdit.value = true
        })
}


const deleteEquipment = (row) => {
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
                let result = await deleteEquipmentService(row.equipmentId)
                if (result.code === 0) {
                    ElMessage.success('删除成功')
                    getEquipmentInfo()
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


const reset = () => {
    status.value = ''
    getEquipmentInfo()
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span><strong>器材信息</strong></span>
            </div>
        </template>
        <el-form inline>
            <el-form-item label="器材状态：" style="width:240px">
                <el-select placeholder="请选择" v-model="status">
                    <el-option label="正常" value="正常"></el-option>
                    <el-option label="损坏" value="损坏"></el-option>
                    <el-option label="维修中" value="维修中"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getEquipmentInfo">搜索</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <br />
        <el-table :data="equipmentModel" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="器材ID" prop="equipmentId"></el-table-column>
            <el-table-column label="器材名称" prop="equipmentName"></el-table-column>
            <el-table-column label="器材位置" prop="equipmentLocation"></el-table-column>
            <el-table-column label="器材状态" prop="equipmentStatus"></el-table-column>
            <el-table-column label="器材说明" prop="equipmentMessage"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button plain type="primary" @click="getEquipmentDetail(row)">详情</el-button>
                    <el-button plain type="danger" @click="deleteEquipment(row)">删除</el-button>
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
                <el-form :model="equipmentInfo" label-width="100px">
                    <el-form-item label="器材ID">
                        <el-input v-model="equipmentInfo.equipmentId" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="器材名称">
                        <el-input v-model="equipmentInfo.equipmentName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="器材位置">
                        <el-input v-model="equipmentInfo.equipmentLocation" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="器材状态">
                        <el-input v-model="equipmentInfo.equipmentStatus" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="器材信息">
                        <el-input v-model="equipmentInfo.equipmentMessage" readonly></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-row v-else>
            <el-col :span="12">
                <el-form :model="equipmentInfo" label-width="100px" :rules="rules">
                    <el-form-item label="器材ID">
                        <el-input v-model="equipmentInfo.equipmentId" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="器材名称">
                        <el-input v-model="equipmentInfo.equipmentName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="器材位置">
                        <el-input v-model="equipmentInfo.equipmentLocation"></el-input>
                    </el-form-item>
                    <el-form-item label="器材状态" prop="equipmentStatus">
                        <el-input v-model="equipmentInfo.equipmentStatus"></el-input>
                    </el-form-item>
                    <el-form-item label="器材信息">
                        <el-input v-model="equipmentInfo.equipmentMessage"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateEquipmentInfo">修改信息</el-button>
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