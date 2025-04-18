<template>
  <div class="right-item" v-if="props.currentTodo && props.currentTodo.id">
    <div style="text-align: right">
      <el-button circle @click="props.clearRightItem">
        <el-icon :size="20">
          <Close />
        </el-icon>
      </el-button>
    </div>
    <h2>标题：{{ props.currentTodo.title }}</h2>
    <h3>内容：</h3>
    <div>{{ props.currentTodo.content }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentTodo: Object,
  clearRightItem: Function
});
</script>
