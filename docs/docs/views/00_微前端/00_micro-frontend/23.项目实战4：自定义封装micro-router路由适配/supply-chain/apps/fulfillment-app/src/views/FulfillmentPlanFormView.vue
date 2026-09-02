<script setup lang="ts">
import { Badge, Button, Card, Input, Label } from '@supply-chain/ui-vue'
import { CheckCircle2, ClipboardList, Info, RotateCcw, Save } from 'lucide-vue-next'
import { computed, reactive, ref } from 'vue'

defineOptions({ name: 'FulfillmentPlanFormView' })

interface FulfillmentPlanForm {
  orderNo: string
  customerName: string
  businessUnit: string
  priority: string
  warehouse: string
  backupWarehouse: string
  inventoryOwner: string
  pickingStrategy: string
  carrier: string
  transportMode: string
  vehicleRequirement: string
  expectedShipDate: string
  expectedArrivalDate: string
  receiverName: string
  receiverPhone: string
  deliveryAddress: string
  deliveryWindow: string
  unloadingRequirement: string
  temperatureControl: boolean
  fragileGoods: boolean
  insuranceRequired: boolean
  riskLevel: string
  exceptionOwner: string
  emergencyPhone: string
  riskDescription: string
  contingencyPlan: string
  remark: string
}

const initialForm = (): FulfillmentPlanForm => ({
  orderNo: '',
  customerName: '',
  businessUnit: '',
  priority: 'normal',
  warehouse: '',
  backupWarehouse: '',
  inventoryOwner: '',
  pickingStrategy: 'fifo',
  carrier: '',
  transportMode: 'road',
  vehicleRequirement: '',
  expectedShipDate: '',
  expectedArrivalDate: '',
  receiverName: '',
  receiverPhone: '',
  deliveryAddress: '',
  deliveryWindow: '',
  unloadingRequirement: '',
  temperatureControl: false,
  fragileGoods: false,
  insuranceRequired: false,
  riskLevel: 'low',
  exceptionOwner: '',
  emergencyPhone: '',
  riskDescription: '',
  contingencyPlan: '',
  remark: '',
})

const form = reactive(initialForm())
const savedAt = ref('')

const requiredFields = computed(() => [
  form.orderNo,
  form.customerName,
  form.warehouse,
  form.carrier,
  form.expectedShipDate,
  form.expectedArrivalDate,
  form.receiverName,
  form.receiverPhone,
  form.deliveryAddress,
  form.exceptionOwner,
])
const completedCount = computed(() => requiredFields.value.filter(Boolean).length)
const completion = computed(() =>
  Math.round((completedCount.value / requiredFields.value.length) * 100),
)

function saveDraft() {
  savedAt.value = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function resetForm() {
  Object.assign(form, initialForm())
  savedAt.value = ''
}
</script>

<template>
  <main class="p-5 lg:p-8">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <span
            class="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          >
            <ClipboardList :size="20" />
          </span>
          <div>
            <p class="text-sm text-muted-foreground">履约执行 / 新建方案</p>
            <h1 class="text-2xl font-bold">履约方案填报</h1>
          </div>
        </div>
        <p class="mt-3 max-w-3xl text-sm text-muted-foreground">
          统一填写订单、仓配、运输、交付要求和风险预案，形成可执行的履约协同方案。
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" @click="resetForm"
          ><RotateCcw class="mr-2" :size="16" />重置</Button
        >
        <Button @click="saveDraft"><Save class="mr-2" :size="16" />保存草稿</Button>
      </div>
    </header>

    <Card class="mt-6 overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="font-semibold">填报进度</h2>
            <Badge :variant="completion === 100 ? 'success' : 'info'">{{ completion }}%</Badge>
          </div>
          <p class="mt-1 text-sm text-muted-foreground">
            已完成 {{ completedCount }} / {{ requiredFields.length }} 个必填字段
          </p>
        </div>
        <p v-if="savedAt" class="flex items-center gap-2 text-sm text-emerald-600">
          <CheckCircle2 :size="16" />草稿已保存 · {{ savedAt }}
        </p>
        <p v-else class="flex items-center gap-2 text-sm text-muted-foreground">
          <Info :size="16" />带 * 的项目为必填项
        </p>
      </div>
      <div class="h-1.5 bg-muted">
        <div class="h-full bg-primary transition-all" :style="{ width: `${completion}%` }" />
      </div>
    </Card>

    <form class="mt-6 space-y-6" @submit.prevent="saveDraft">
      <Card class="p-6">
        <div class="mb-6">
          <h2 class="font-semibold">一、订单与客户信息</h2>
          <p class="mt-1 text-sm text-muted-foreground">确认本次履约任务对应的订单和业务优先级。</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div class="space-y-2">
            <Label for="orderNo">销售订单号 *</Label
            ><Input id="orderNo" v-model="form.orderNo" placeholder="例如 SO202608120101" />
          </div>
          <div class="space-y-2">
            <Label for="customerName">客户名称 *</Label
            ><Input id="customerName" v-model="form.customerName" placeholder="请输入客户名称" />
          </div>
          <div class="space-y-2">
            <Label for="businessUnit">所属事业群</Label
            ><Input id="businessUnit" v-model="form.businessUnit" placeholder="例如 华东事业群" />
          </div>
          <div class="space-y-2">
            <Label for="priority">履约优先级</Label>
            <select id="priority" v-model="form.priority" class="form-control">
              <option value="normal">普通</option>
              <option value="urgent">紧急</option>
              <option value="critical">战略客户</option>
            </select>
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <div class="mb-6">
          <h2 class="font-semibold">二、仓储与备货方案</h2>
          <p class="mt-1 text-sm text-muted-foreground">确定出库仓、库存负责人和拣货策略。</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="warehouse">主出库仓 *</Label
            ><Input id="warehouse" v-model="form.warehouse" placeholder="例如 上海青浦中心仓" />
          </div>
          <div class="space-y-2">
            <Label for="backupWarehouse">备用仓库</Label
            ><Input
              id="backupWarehouse"
              v-model="form.backupWarehouse"
              placeholder="库存不足时启用"
            />
          </div>
          <div class="space-y-2">
            <Label for="inventoryOwner">库存负责人</Label
            ><Input id="inventoryOwner" v-model="form.inventoryOwner" placeholder="姓名 / 工号" />
          </div>
          <div class="space-y-2">
            <Label for="pickingStrategy">拣货策略</Label>
            <select id="pickingStrategy" v-model="form.pickingStrategy" class="form-control">
              <option value="fifo">先进先出</option>
              <option value="batch">整批优先</option>
              <option value="zone">分区拣货</option>
            </select>
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <div class="mb-6">
          <h2 class="font-semibold">三、运输计划</h2>
          <p class="mt-1 text-sm text-muted-foreground">填写承运资源、运输方式和计划时间。</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div class="space-y-2">
            <Label for="carrier">承运商 *</Label
            ><Input id="carrier" v-model="form.carrier" placeholder="例如 顺丰供应链" />
          </div>
          <div class="space-y-2">
            <Label for="transportMode">运输方式</Label>
            <select id="transportMode" v-model="form.transportMode" class="form-control">
              <option value="road">公路运输</option>
              <option value="rail">铁路运输</option>
              <option value="air">航空运输</option>
              <option value="combined">多式联运</option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="vehicleRequirement">车型与载重要求</Label
            ><Input
              id="vehicleRequirement"
              v-model="form.vehicleRequirement"
              placeholder="例如 9.6 米厢式货车"
            />
          </div>
          <div class="space-y-2">
            <Label for="expectedShipDate">计划发运时间 *</Label
            ><Input id="expectedShipDate" v-model="form.expectedShipDate" type="datetime-local" />
          </div>
          <div class="space-y-2">
            <Label for="expectedArrivalDate">计划到达时间 *</Label
            ><Input
              id="expectedArrivalDate"
              v-model="form.expectedArrivalDate"
              type="datetime-local"
            />
          </div>
          <div class="flex flex-wrap items-end gap-4 pb-2 text-sm">
            <label class="check-option"
              ><input v-model="form.temperatureControl" type="checkbox" />温控运输</label
            >
            <label class="check-option"
              ><input v-model="form.fragileGoods" type="checkbox" />易碎品</label
            >
            <label class="check-option"
              ><input v-model="form.insuranceRequired" type="checkbox" />购买货运险</label
            >
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <div class="mb-6">
          <h2 class="font-semibold">四、客户交付要求</h2>
          <p class="mt-1 text-sm text-muted-foreground">确认收货联系人、交付窗口和现场要求。</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="receiverName">收货联系人 *</Label
            ><Input id="receiverName" v-model="form.receiverName" placeholder="请输入姓名" />
          </div>
          <div class="space-y-2">
            <Label for="receiverPhone">联系电话 *</Label
            ><Input id="receiverPhone" v-model="form.receiverPhone" placeholder="手机或固定电话" />
          </div>
          <div class="space-y-2 md:col-span-2">
            <Label for="deliveryAddress">交付地址 *</Label
            ><Input
              id="deliveryAddress"
              v-model="form.deliveryAddress"
              placeholder="省 / 市 / 区 / 街道 / 门牌号"
            />
          </div>
          <div class="space-y-2">
            <Label for="deliveryWindow">允许交付时段</Label
            ><Input
              id="deliveryWindow"
              v-model="form.deliveryWindow"
              placeholder="例如 工作日 09:00—16:00"
            />
          </div>
          <div class="space-y-2">
            <Label for="unloadingRequirement">卸货要求</Label
            ><Input
              id="unloadingRequirement"
              v-model="form.unloadingRequirement"
              placeholder="月台、叉车或入场预约要求"
            />
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <div class="mb-6">
          <h2 class="font-semibold">五、风险与应急预案</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            提前指定异常负责人，并记录关键风险与处置方法。
          </p>
        </div>
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div class="space-y-2">
            <Label for="riskLevel">风险等级</Label>
            <select id="riskLevel" v-model="form.riskLevel" class="form-control">
              <option value="low">低风险</option>
              <option value="medium">中风险</option>
              <option value="high">高风险</option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="exceptionOwner">异常负责人 *</Label
            ><Input id="exceptionOwner" v-model="form.exceptionOwner" placeholder="姓名 / 工号" />
          </div>
          <div class="space-y-2">
            <Label for="emergencyPhone">紧急联系电话</Label
            ><Input
              id="emergencyPhone"
              v-model="form.emergencyPhone"
              placeholder="请输入紧急联系电话"
            />
          </div>
          <div class="space-y-2 md:col-span-2 xl:col-span-3">
            <Label for="riskDescription">风险说明</Label
            ><textarea
              id="riskDescription"
              v-model="form.riskDescription"
              rows="4"
              class="form-control min-h-24"
              placeholder="天气、运力、库存、交付窗口等潜在风险"
            />
          </div>
          <div class="space-y-2 md:col-span-2 xl:col-span-3">
            <Label for="contingencyPlan">应急预案</Label
            ><textarea
              id="contingencyPlan"
              v-model="form.contingencyPlan"
              rows="5"
              class="form-control min-h-28"
              placeholder="风险触发条件、处理步骤、升级路径和通知对象"
            />
          </div>
          <div class="space-y-2 md:col-span-2 xl:col-span-3">
            <Label for="remark">补充说明</Label
            ><textarea
              id="remark"
              v-model="form.remark"
              rows="3"
              class="form-control min-h-20"
              placeholder="其他需要交接的事项"
            />
          </div>
        </div>
      </Card>

      <div class="flex justify-end gap-3 pb-4">
        <Button type="button" variant="outline" @click="resetForm">清空表单</Button>
        <Button type="submit"><Save class="mr-2" :size="16" />保存草稿</Button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.form-control {
  width: 100%;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  background: hsl(var(--background));
  padding: 0.625rem 0.75rem;
  color: hsl(var(--foreground));
  font-size: 0.875rem;
  outline: none;
}

.form-control:focus {
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.12);
}

.check-option {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
}

.check-option input {
  width: 1rem;
  height: 1rem;
  accent-color: hsl(var(--primary));
}
</style>
