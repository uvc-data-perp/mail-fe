<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      Dropdown List<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="field in props.columnListInfo"
          :command="field"
          >{{ field }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";

const props = defineProps({
  columnListInfo: {
    type: Array,
    required: false,
  },
});

const emit = defineEmits(["update:selectedColumn"]);

const handleCommand = (command: string | number | object) => {
  // ElMessage(`click on item ${command}`);
  emit("update:selectedColumn", command);
};
</script>
<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
