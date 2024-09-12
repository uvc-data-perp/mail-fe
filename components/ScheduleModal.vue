<template>
  <el-dialog
    v-model="dialogVisible"
    title="예약 설정"
    width="30%"
    @close="handleClose"
  >
    <el-form :model="form">
      <el-form-item label="발송일">
        <div class="flex-grow"></div>

        <el-date-picker
          v-model="form.date"
          type="date"
          placeholder="날짜 선택"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item class="flex">
      <el-form-item label="예약시간">
        <div class="flex-grow"></div>
        <el-time-picker
          v-model="form.time"
          placeholder="시간 선택"
          format="HH:mm"
          value-format="HH:mm"
        />
      </el-form-item>
      <el-form-item label="예약주기">
        <div class="flex-grow"></div>
        <el-form-item>
      <el-input :disabled="form.periodOptions === 'no'" v-model="form.periodNumber" />
      <el-select v-model="form.periodOptions" placeholder="주기 선택">
          <el-option
            v-for="item in periodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
    </el-form-item>

       
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
import { ref } from "vue";

const periodOptions = [
{ value: "no", label: "없음" },
  { value: "daily", label: "일마다" },
  { value: "weekly", label: "주마다" },
  { value: "monthly", label: "월마다" },
  { value: "yearly", label: "년마다" },



];

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
  };
  emit("save", updatedData);
  handleClose();
};
</script>
