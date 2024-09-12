<template>
  <el-button-group>
    <el-button type="primary" :icon="ArrowLeft">Previous Page</el-button>
    <el-button type="primary">
      Next Page<el-icon class="el-icon--right"><ArrowRight /></el-icon>
    </el-button>

    <el-button v-for="buttonInfo in buttonsInfo">
      {{ buttonInfo.buttonName }}
    </el-button>
  </el-button-group>
</template>

<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Delete,
  Edit,
  Share,
} from "@element-plus/icons-vue";

const buttonsInfo = ref([
  {
    type: "primary",
    buttonName: "읽음",
    clickEvent: () => {},
  },
  {
    type: "primary",
    buttonName: "읽음",
    clickEvent: () => {},
  },
  {
    type: "primary",
    buttonName: "삭제",
    clickEvent: () => {},
  },
  {
    type: "primary",
    buttonName: "답장",
    clickEvent: () => {},
  },
]);
</script>
