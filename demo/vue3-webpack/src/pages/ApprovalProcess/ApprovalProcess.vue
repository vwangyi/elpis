<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import bpmnXML from './approval_process.bpmn';

const container = useTemplateRef('container');

//  ApprovalProcess 审批流 审批是 流程中的一种
// 定义一个可以被flowable执行的的流程（又叫 工作流执行引擎）比如 flowable camunda activiti

// 流程执行

onMounted(async () => {
  const modeler = new BpmnModeler({
    container: container.value as HTMLDivElement
  });
  await modeler.importXML(bpmnXML);
});
onBeforeUnmount(() => {});
</script>

<template>
  <div class="container" ref="container"></div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
