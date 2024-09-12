<template>
  <el-dialog
    v-model="dialogVisible"
    title="프로젝트 수정"
    width="30%"
    @close="handleClose"
  >
    <el-form :model="form">
      <el-form-item label="제목">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="작성자">
        <el-input v-model="form.author" />
      </el-form-item>
      <el-form-item label="작성일">
        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="날짜 선택"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">취소</el-button>
        <el-button type="primary" @click="handleSave">확인</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
// import { ref, watch } from "vue";

const props = defineProps({
  visible: Boolean,
  editData: Object,
});

const emit = defineEmits(["update:visible", "save"]);

const dialogVisible = ref(props.visible);
const form = ref({ ...props.editData });

watch(
  () => props.visible,
  (newValue) => {
    dialogVisible.value = newValue;
  }
);

watch(
  () => props.editData,
  (newValue) => {
    form.value = { ...newValue };
  }
);

const handleClose = () => {
  emit("update:visible", false);
};

const handleSave = () => {
  const updatedData = {
    ...form.value,
    date: form.value.date || new Date().toISOString().split("T")[0], // 날짜가 없으면 현재 날짜 사용
  };
  emit("save", updatedData);
  handleClose();
};
</script>
