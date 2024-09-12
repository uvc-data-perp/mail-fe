<template>
  <el-scrollbar max-height="400px">
    <el-button
      v-for="columnInfo in props.data"
      :key="columnInfo.index"
      class="scrollbar-demo-item"
    >
      {{ columnInfo.varName }}
    </el-button>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: false,
  },
});

// const currentDefect= ref('null');
// const currnet
</script>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
