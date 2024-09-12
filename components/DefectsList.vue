<template>
  <div class="w-full flex justify-between gap-10 mb-10">
    <div>
      <el-button
        @click="setDefect(defect)"
        v-for="defect in defectsList"
        type="primary"
        :icon="ArrowLeft"
        value="equip.index"
        >{{ defect.defectName }}</el-button
      >
    </div>
    <div>
      <button btn>
        <div class="i-ic:round-plus w-1em h-1em"></div>
      </button>
    </div>
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
const emit = defineEmits(["defectSelected"]);

const setDefect = (defect) => {
  // 'equipSelected' 이벤트를 발생시키고 equip 객체를 전달
  emit("defectSelected", defect);
};

const defectsList = [
  {
    index: 0,
    defectName: "전체",
    icon: ArrowLeft,
  },

  {
    index: 1,
    defectName: "미성형",
    icon: ArrowLeft,
  },
  {
    index: 2,
    defectName: "싱크마크",
    icon: ArrowLeft,
  },
  {
    index: 3,
    defectName: "웰드라인",
    icon: ArrowLeft,
  },
  {
    index: -1,
    defectName: "이미지 검증",
    icon: ArrowLeft,
  },
];
</script>

<style></style>
