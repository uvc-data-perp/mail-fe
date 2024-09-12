<template>
  <div class="w-full flex justify-center gap-10">
    <el-button
      @click="setEquip(equip)"
      v-for="equip in equipList"
      type="primary"
      :icon="ArrowLeft"
      value="equip.index"
      >{{ equip.equipName }}</el-button
    >
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Delete,
  Edit,
  Share,
} from "@element-plus/icons-vue";

// emit 함수 정의
const emit = defineEmits(["equipSelected"]);

const setEquip = (equip) => {
  // 'equipSelected' 이벤트를 발생시키고 equip 객체를 전달
  emit("equipSelected", equip);
};

const equipList = [
  {
    index: 1,
    equipName: "사출성형기",
    icon: ArrowLeft,
  },
  {
    index: 2,
    equipName: "프레스기",
    icon: ArrowLeft,
  },
  {
    index: 3,
    equipName: "전동기",
    icon: ArrowLeft,
  },
];
</script>

<style></style>
