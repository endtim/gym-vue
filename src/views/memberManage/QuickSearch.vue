<script setup>
import { ref } from 'vue'

import { deleteMemberService, getMemberDetailService, getMemberShipService, updateMemberInfoService } from '@/api/admin';

const memberModel = ref([])


import { searchMemberInfo } from '@/api/admin';

const getMemberInfo = async (account) => {
    // 检查 account 是否为空
    if (!account) {
        ElMessage.error('账号不能为空');
        return;
    }

    const number = parseInt(account, 10);

    // 检查是否成功转换为数字
    if (isNaN(number)) {
        ElMessage.error('请输入有效的账号');
        return;
    }
    let result = await searchMemberInfo(number);
    if (result && result.data) {
        memberModel.value = result.data;
        ElMessage.success('查询成功');
    } else {
        ElMessage.error('未找到会员信息');
    }
}


import { ElMessage, ElMessageBox } from 'element-plus';


const memberInfo = ref([])
const memberEditInfo = ref([])

const dialogVisible = ref(false)
const isEdit = ref(true)

const membership = ref()

const Account = ref({})

const memberShip = async (row) => {
    let result = await getMemberShipService(row.memberAccount)
    if (result.data === '会员截至null到期') {
        membership.value = '暂未办理会员'
    }
    else {
        membership.value = result.data
    }

}

const getMemberDetail = async (row) => {
    dialogVisible.value = true
    let result = await getMemberDetailService(row.memberAccount)
    memberShip(row)
    memberInfo.value = result.data
    memberEditInfo.value = result.data
}

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
    ]
}


const updateMemberInfo = () => {
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
            let result = await updateMemberInfoService(memberInfo.value)
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            isEdit.value = true
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消修改',
            })
            memberInfo.value = memberEditInfo.info
            isEdit.value = true
        })
}



const deleteMember = (row) => {
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
                let result = await deleteMemberService(row.memberAccount)
                if (result.code === 0) {
                    ElMessage.success('删除成功')
                    getMemberInfo()
                } else {
                    ElMessage.error(result.message ? result.message : '删除失败')
                }
            } catch (error) {
                ElMessage.error('选课失败')
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
                <span><strong>会员信息</strong></span>
            </div>
        </template>
        <el-form inline :model="Account">
            <el-form-item label="会员账号：">
                <el-input v-model="Account.value"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getMemberInfo(Account.value)">搜索</el-button>
                <el-button type="primary" @click="Account.value = ''">重置</el-button>
            </el-form-item>
        </el-form>
        <br />
        <el-table :data="memberModel" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="会员账号" prop="memberAccount"></el-table-column>
            <el-table-column label="姓名" prop="memberName"></el-table-column>
            <el-table-column label="性别" prop="memberGender"></el-table-column>
            <el-table-column label="年龄" prop="memberAge"></el-table-column>
            <el-table-column label="身高(cm)" prop="memberHeight"></el-table-column>
            <el-table-column label="体重(kg)" prop="memberWeight"></el-table-column>
            <el-table-column label="剩余积分" prop="points"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button plain type="primary" @click="getMemberDetail(row)">详情</el-button>
                    <el-button plain type="danger" @click="deleteMember(row)">删除</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="详细信息" width="40%">
        <el-row v-if="isEdit">
            <el-col :span="12">
                <el-form :model="memberInfo" :rules="rules" label-width="100px">
                    <el-form-item label="会员账号">
                        <el-input v-model="memberInfo.memberAccount" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="memberInfo.memberName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-input v-model="memberInfo.memberGender" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="年龄">
                        <el-input v-model="memberInfo.memberAge" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式">
                        <el-input v-model="memberInfo.memberPhone" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="身高(cm)">
                        <el-input v-model="memberInfo.memberHeight" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="体重(kg)">
                        <el-input v-model="memberInfo.memberWeight" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="办卡时间">
                        <el-input v-model="memberInfo.cardTime" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="剩余积分">
                        <el-input v-model="memberInfo.points" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="会员时间">
                        <el-input :value="membership" readonly></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-row v-else>
            <el-col :span="12">
                <el-form :model="memberInfo" :rules="rules" label-width="100px">
                    <el-form-item label="会员账号">
                        <el-input v-model="memberInfo.memberAccount" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="memberName">
                        <el-input v-model="memberInfo.memberName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-input v-model="memberInfo.memberGender" disabled></el-input>
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
                        <el-input v-model="memberInfo.cardTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="剩余积分">
                        <el-input v-model="memberInfo.points"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateMemberInfo">修改信息</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="isEdit = false">编辑</el-button>
                <el-button @click="dialogVisible = false , isEdit = true">取消</el-button>
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