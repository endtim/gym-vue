<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router';
const router = useRouter();

const message = ref()

const membershipType = ref()

import { memberShipService, buyMemberShipService } from '@/api/member';

const memberShip = async () => {
    let result = await memberShipService()
    message.value = result.data
}

memberShip()



const buyMemberShip = async (membershipType) => {
    ElMessageBox.confirm(
        '确认购买会员吗？',
        'Warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            try {
                let result = await buyMemberShipService(membershipType)
                if (result.code === 0) {
                    ElMessage.success(result.msg ? result.msg : '购买成功')
                } else {
                    ElMessage.error(result.msg ? result.msg : '购买失败')
                }
            } catch (error) {
                ElMessage.error('购买失败')
            }
        })
        .catch(() => {
            //用户点击了取消
            ElMessage({
                type: 'info',
                message: '取消购买',
            })
        })
}

const buyMonthly = () => {
    membershipType.value = '月卡'
    buyMemberShip(membershipType.value)
    memberShip()
}

const buySeason = () => {
    membershipType.value = '季卡'
    buyMemberShip(membershipType.value)
    memberShip()
}

const buyYearly = () => {
    membershipType.value = '年卡'
    buyMemberShip(membershipType.value)
    memberShip()
}

</script>

<template>
    <el-card class="page-container" style="height: 100%;">
        <template #header>
            <div class="header">
                <span><strong>会员购买</strong></span>
            </div>
        </template>
        <div style="margin-bottom: 30px;">
            <span><strong>您的{{ message }}</strong></span>
        </div>
        <el-row>
            <el-col>
                <div style="display: flex;height: 480px;">
                    <el-card style="width: 360px ;height: 300px;" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <span><strong>月卡</strong></span>
                            </div>
                        </template>
                        <div>8积分</div>
                        <template #footer>
                            <div style="align-items: center;justify-content: space-between; width: 360px;">
                                <el-button type="primary" @click="buyMonthly">购买</el-button>
                            </div>
                        </template>
                    </el-card>
                    <el-card style="width: 360px;height: 300px;margin-left: 120px;margin-right: 120px;" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <span><strong>季卡</strong></span>
                            </div>
                        </template>
                        <div>20积分</div>
                        <template #footer>
                            <div style="align-items: center;justify-content: space-between; width: 360px;">
                                <el-button type="primary" @click="buySeason">购买</el-button>
                            </div>
                        </template>
                    </el-card>
                    <el-card style="width: 360px;height: 300px;" shadow="hover">
                        <template #header>
                            <div class="card-header">
                                <span><strong>年卡</strong></span>
                            </div>
                        </template>
                        <div>78积分</div>
                        <template #footer>
                            <div style="align-items: center;justify-content: space-between; width: 360px;">
                                <el-button type="primary" @click="buyYearly">购买</el-button>
                            </div>
                        </template>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>