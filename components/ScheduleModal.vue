<template>
  <el-dialog
    v-model="dialogVisible"
    title="예약 설정"
    width="60%"
    @close="handleClose"
  >
    <el-form
      :model="writeMailStore.mailMessage.contents"
      :rules="rules"
      ref="formRef"
      class="schedule-form flex flex-col gap-4"
    >
      <el-form-item label="예약주기" class="form-item" label-width="100px">
        <el-select
          v-model="writeMailStore.mailMessage.contents.periodType"
          placeholder="주기 선택"
          class="select-picker period-select w-56"
          @change="
            writeMailStore.mailMessage.contents = {
              ...writeMailStore.mailMessage.contents,
              days: [],
            }
          "
        >
          <el-option label="없음" value="no" />
          <el-option label="1번" value="single" />
          <el-option label="요일마다" value="weekly" />
          <el-option label="매월마다" value="monthly" />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="writeMailStore.mailMessage.contents.periodType !== 'no'"
        :label="
          writeMailStore.mailMessage.contents.periodType === 'single'
            ? '발송시각'
            : '시작일'
        "
        class="form-item"
        prop="reservedDate"
        label-width="100px"
      >
        <el-date-picker
          v-model="writeMailStore.mailMessage.contents.reservedDate"
          type="datetime"
          placeholder="Pick a Date"
          format="YYYY/MM/DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item
        v-if="
          writeMailStore.mailMessage.contents.periodType !== 'no' &&
          writeMailStore.mailMessage.contents.periodType !== 'single'
        "
        label="만료일"
        class="form-item"
        prop="expiredTimestamp"
        label-width="100px"
      >
        <el-date-picker
          v-model="writeMailStore.mailMessage.contents.expiredTimestamp"
          type="date"
          placeholder="만료 날짜 선택"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          class="date-picker"
          @change="updateReservedTimestamp"
        />
      </el-form-item>

      <template
        v-if="
          writeMailStore.mailMessage.contents.periodType !== 'no' &&
          writeMailStore.mailMessage.contents.periodType !== 'single'
        "
      >
        <el-form-item
          :label="
            writeMailStore.mailMessage.contents.periodType === 'weekly'
              ? '주 간격'
              : writeMailStore.mailMessage.contents.periodType === 'monthly'
              ? '월 간격'
              : null
          "
          class="form-item"
          label-width="100px"
        >
        </el-form-item>
        <el-form-item
          v-if="
            writeMailStore.mailMessage.contents.periodType !== 'no' &&
            writeMailStore.mailMessage.contents.periodType !== 'single'
          "
          :label="
            writeMailStore.mailMessage.contents.periodType === 'weekly'
              ? '요일 선택'
              : '날짜 선택'
          "
          prop="days"
          class="form-item text-right"
          label-width="100px"
          label-position="right"
        >
          <el-checkbox-group
            v-model="writeMailStore.mailMessage.contents.days"
            class="checkbox-group"
          >
            <template
              v-if="writeMailStore.mailMessage.contents.periodType === 'weekly'"
            >
              <el-checkbox :value="0">월</el-checkbox>
              <el-checkbox :value="1">화</el-checkbox>
              <el-checkbox :value="2">수</el-checkbox>
              <el-checkbox :value="3">목</el-checkbox>
              <el-checkbox :value="4">금</el-checkbox>
              <el-checkbox :value="5">토</el-checkbox>
              <el-checkbox :value="6">일</el-checkbox>
            </template>
            <template
              v-else-if="
                writeMailStore.mailMessage.contents.periodType === 'monthly'
              "
            >
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
    {{
      new Date(writeMailStore.mailMessage.contents.expiredTimestamp).setHours(
        23,
        59,
        59,
        999
      )
    }}

    {{
      `${writeMailStore.mailMessage.contents.reservedDate.getHours()}:${writeMailStore.mailMessage.contents.reservedDate.getMinutes()}`
    }}
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useWriteMailStore } from "~/stores/writeMailStore";

const writeMailStore = useWriteMailStore();
const { updateReservedTimestamp, sendMailTest } = writeMailStore;
const { mailMessage, computedTimestamp } = storeToRefs(writeMailStore);
// const writeMailContents = ref(mailMessage.value.contents);

const props = defineProps({
  visible: Boolean,
  editData: Object,
});

const emit = defineEmits(["update:visible", "save"]);

const dialogVisible = ref(props.visible);

watch(
  () => props.visible,
  (newValue) => {
    dialogVisible.value = newValue;
  }
);

const handleClose = () => {
  emit("update:visible", false);
};

const rules = computed(() => {
  const baseRules = {
    // 다른 필드에 대한 규칙들...
  };

  if (writeMailStore.mailMessage.contents.periodType !== "no") {
    baseRules.reservedTimestamp = [
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
    baseRules.expiredTimestamp = [
      {
        required: true,
        message: "만료 시각을 선택해주세요",
        trigger: "change",
      },
      {
        validator: (rule, value, callback) => {
          if (
            new Date(value) <=
            new Date(writeMailStore.mailMessage.contents.reserved_timestamp)
          ) {
            callback(new Error("만료 시각은 시작 시각보다 늦어야 합니다."));
          } else {
            callback();
          }
        },
        trigger: "change",
      },
    ];
  }
  if (
    writeMailStore.mailMessage.contents.periodType == "weekly" ||
    writeMailStore.mailMessage.contents.periodType == "monthly"
  ) {
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
    // emit("save", form.value);
    handleClose();
  } catch (error) {
    console.error("Validation failed", error);
  }
};

const validationSetting = () => {
  if (writeMailStore.mailMessage.contents.periodType !== "no") {
    if (
      !writeMailStore.mailMessage.contents.reservedTimestamp ||
      !writeMailStore.mailMessage.contents.startTime ||
      !writeMailStore.mailMessage.contents.expiredTimestamp ||
      writeMailStore.mailMessage.contents.days.length === 0
    ) {
      ElMessage.error("값이 다 채워지지 않았습니다.");
      return;
    }
  }
};
const disabledDate = (time) => {
  return (
    time.getTime() <
    new Date(writeMailStore.mailMessage.contents.reservedDate).getTime()
  );
};
</script>
<style scoped>
.period-select {
  width: 220px;
  /* 예약주기 선택기의 너비를 고정 */
}
</style>
