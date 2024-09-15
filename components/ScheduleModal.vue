<template>
  <el-dialog
    v-model="dialogVisible"
    title="예약 설정"
    width="60%"
    @close="handleClose"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      class="schedule-form flex flex-col gap-4"
    >
      <el-form-item
        label="시작일"
        class="form-item"
        prop="startDate"
        label-width="100px"
      >
        <el-date-picker
          v-model="form.startDate"
          type="date"
          placeholder="시작 날짜 선택"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          class="date-picker"
        />
      </el-form-item>
      <el-form-item
        label="시작 시간"
        class="form-item"
        prop="startTime"
        label-width="100px"
      >
        <el-time-picker
          v-model="form.startTime"
          placeholder="시작 시간 선택"
          format="HH:mm"
          value-format="HH:mm"
          class="time-picker"
        />
      </el-form-item>
      <el-form-item
        label="만료일"
        class="form-item"
        prop="expiryDate"
        label-width="100px"
      >
        <el-date-picker
          v-model="form.expiryDate"
          type="date"
          placeholder="만료 날짜 선택"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          class="date-picker"
        />
      </el-form-item>
      <el-form-item label="예약주기" class="form-item" label-width="100px">
        <el-select
          v-model="form.periodType"
          placeholder="주기 선택"
          class="select-picker period-select w-56"
        >
          <el-option label="없음" value="no" />
          <el-option label="1번" value="single" />
          <el-option label="요일마다" value="weekly" />
          <el-option label="매월마다" value="monthly" />
        </el-select>
      </el-form-item>

      <template v-if="form.periodType !== 'no' && form.periodType !== 'single'">
        <el-form-item
          :label="
            form.periodType === 'weekly'
              ? '주 간격'
              : form.periodType === 'monthly'
              ? '월 간격'
              : null
          "
          class="form-item"
          label-width="100px"
        >
          <el-input-number
            v-model.number="form.interval"
            controls-position="right"
            :min="1"
            :max="form.periodType === 'weekly' ? 5 : 12"
            class="input-number"
          />
        </el-form-item>
        <el-form-item
          v-if="form.periodType !== 'no' && form.periodType !== 'single'"
          :label="form.periodType === 'weekly' ? '요일 선택' : '날짜 선택'"
          prop="days"
          class="form-item text-right"
          label-width="100px"
          label-position="right"
        >
          <el-checkbox-group v-model="form.days" class="checkbox-group">
            <template v-if="form.periodType === 'weekly'">
              <el-checkbox :value="0">월</el-checkbox>
              <el-checkbox :value="1">화</el-checkbox>
              <el-checkbox :value="2">수</el-checkbox>
              <el-checkbox :value="3">목</el-checkbox>
              <el-checkbox :value="4">금</el-checkbox>
              <el-checkbox :value="5">토</el-checkbox>
              <el-checkbox :value="6">일</el-checkbox>
            </template>
            <template v-else-if="form.periodType === 'monthly'">
              <div class="grid grid-cols-7 gap-1">
                <el-checkbox
                  v-for="day in 31"
                  :key="day"
                  :value="day"
                  class="flex flex-col"
                  >{{ day }}일</el-checkbox
                >
                <el-checkbox class="opacity-0">...</el-checkbox>
              </div>
            </template>
          </el-checkbox-group>
        </el-form-item>
      </template>
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
import { ref, watch } from "vue";

const props = defineProps({
  visible: Boolean,
  editData: Object,
});

const emit = defineEmits(["update:visible", "save"]);

const dialogVisible = ref(props.visible);
const form = ref({
  startDate: "",
  startTime: "",
  expiryDate: "",
  periodType: "no",
  interval: 1,
  days: [],
  ...props.editData,
});

watch(
  () => props.visible,
  (newValue) => {
    dialogVisible.value = newValue;
  }
);

watch(
  () => form.value.periodType,
  (newValue) => {
    form.value.days = [];
    if (newValue === "no") {
      form.value.interval = 1;
    }
  }
);

const handleClose = () => {
  emit("update:visible", false);
};

const rules = computed(() => {
  const baseRules = {
    // 다른 필드에 대한 규칙들...
  };

  if (form.value.periodType !== "no") {
    baseRules.startDate = [
      {
        required: true,
        message: "시작 날짜를 선택해주세요",
        trigger: "change",
      },
    ];
    baseRules.startTime = [
      {
        required: true,
        message: "시작 시각을 선택해주세요",
        trigger: "change",
      },
    ];
    baseRules.expiryDate = [
      {
        required: true,
        message: "만료 시각을 선택해주세요",
        trigger: "change",
      },
      {
        validator: (rule, value, callback) => {
          if (new Date(value) <= new Date(form.value.startDate)) {
            callback(new Error("만료 시각은 시작 시각보다 늦어야 합니다."));
          } else {
            callback();
          }
        },
        trigger: "change",
      },
    ];
  }
  if (form.value.periodType == "weekly" || form.value.periodType == "monthly") {
    baseRules.days = [
      {
        required: true,
        message: "특정 요일/날짜를 선택해주세요",
        trigger: "change",
      },
    ];
  }

  return baseRules;
});

const formRef = ref();

const handleSave = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    emit("save", form.value);
    handleClose();
  } catch (error) {
    console.error("Validation failed", error);
  }
};

// const handleSave = () => {
//   validationSetting();
//   emit("save", form.value);
//   handleClose();
// };

const validationSetting = () => {
  if (form.value.periodType !== "no") {
    if (
      !form.value.startDate ||
      !form.value.startTime ||
      !form.value.expiryDate ||
      !form.value.interval ||
      form.value.days.length === 0
    ) {
      ElMessage.error("값이 다 채워지지 않았습니다.");
      return;
    }
  }
};
const disabledDate = (time) => {
  return time.getTime() < new Date(form.value.startDate).getTime();
};
</script>
<style scoped>
.period-select {
  width: 220px;
  /* 예약주기 선택기의 너비를 고정 */
}
</style>
