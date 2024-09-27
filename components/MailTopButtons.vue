<template>
  <div class="">
    <el-button-group>
      <!-- <el-button type="primary" :icon="ArrowLeft">Previous Page</el-button>
      <el-button type="primary">
        Next Page<el-icon class="el-icon--right"><ArrowRight /></el-icon>
      </el-button> -->

      <el-button
        v-for="(buttonInfo, index) in buttonsInfo"
        :key="index"
        :type="buttonInfo.type"
        @click="buttonInfo.clickEvent"
      >
        {{ buttonInfo.buttonName }}
      </el-button>
    </el-button-group>
  </div>
</template>

<script setup>
import {
  ArrowLeft,
  ArrowRight,
  Delete,
  Edit,
  Share,
} from "@element-plus/icons-vue";

const emit = defineEmits(["deleteRows"]);

const buttonsInfo = ref([
  {
    type: "primary",
    buttonName: "삭제",
    clickEvent: () => {
      const del = true;
      emit("deleteRows", del);
      console.log("메일삭제");
      ElMessage.success("삭제요청");
    },
  },
]);
</script>
