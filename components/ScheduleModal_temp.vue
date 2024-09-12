<template>
  <el-dialog v-model="scheduleDialogVisible" title="예약">
    <el-form :model="reservationForm" label-position="top">
      <el-form-item label="예약일">
        <el-date-picker
          v-model="reservationForm.date"
          type="date"
          placeholder="날짜 선택"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="예약시간">
        <el-time-picker
          v-model="reservationForm.time"
          placeholder="시간 선택"
          format="HH:mm"
          value-format="HH:mm"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="scheduleDialogVisible = false">취소</el-button>
        <el-button type="primary" @click="handleSave">예약</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
const handleSave = () => {
  const updatedData = {
    ...form.value,
    date: form.value.date || new Date().toISOString().split("T")[0], // 날짜가 없으면 현재 날짜 사용
  };
  emit("save", updatedData);
  handleClose();
};
</script>

<style lang="scss" scoped></style>
