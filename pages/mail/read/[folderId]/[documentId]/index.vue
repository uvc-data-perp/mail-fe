<template>
  <div class="bg-white rounded-lg shadow-md p-6 w-full">
    <div class="mb-4 border-b-4 w-full">
      <!-- 제목 -->

      <div class="title">
        <h2 class="text-2xl font-bold mb-6">
          {{ currentMail.subject }}
        </h2>
      </div>
      <!-- 보낸 사람 -->
      <div class="flex w-full items-center mb-2">
        <el-tag type="info" class="mr-2 flex-shrink-0">보낸사람</el-tag>
        <span flex-grow border-b> {{ currentMail.from }} </span>
      </div>
      <!-- 받는 사람 -->
      <div class="flex w-full items-center mb-2">
        <el-tag type="success" class="mr-2">받는사람</el-tag>
        <span flex-grow border-b>{{ currentMail.to }}</span>
      </div>
      <!-- 예약날짜 or 보낸 날짜 표시 -->
      <div
        v-if="route.params.folderId !== '1'"
        class="flex-1 items-center mb-2"
      >
        <el-tag
          type="primary"
          @click="scheduleDialogVisible = !scheduleDialogVisible"
          class="mr-2 flex-shrink-0 cursor-pointer"
          >예약 변경</el-tag
        >

        <el-button
          @click="
            handleDeleteReservation(
              String(route.params.folderId),
              String(route.query.groupId),
              String(currentMail.id)
            )
          "
          :type="currentMail.status === `Cancelled` ? 'danger' : 'success'"
          >{{ currentMail.status === `Cancelled` ? "취소됨" : "취소하기" }}
        </el-button>
        <ScheduleModal
          v-if="scheduleDialogVisible"
          v-model:visible="scheduleDialogVisible"
          @save="saveSchedule"
        />
        <span
          class="text-sm text-gray-600"
          :class="currentMail.status === 'Cancelled' ? 'line-through' : ''"
        >
          {{
            route.query.expiredDate ? ` 만료일:${route.query.expiredDate}` : ""
          }}
          메일상태
          {{ currentMail.status }}
          <!-- {{
            scheduleForm.periodType !== "no"
              ? `주기
                ${
                  scheduleForm?.periodType === "weekly"
                    ? ` ${getDayNames(scheduleForm.days).join(", ")}요일`
                    : ` ${scheduleForm.days?.join(", ")}일`
                }`
              : ""
          }} -->
        </span>
      </div>
      <div v-else class="flex-1 items-center mb-2">
        <el-tag type="info" class="mr-2 flex-shrink-0">보낸날짜</el-tag>
        <span class="text-sm text-gray-600">
          {{ currentMail.sentTimestamp ? currentMail.sentTimestamp : "미전송" }}
        </span>
      </div>
    </div>
    <!-- 본문내용 -->
    <div class="content flex overflow-x-auto w-full border-b-4">
      <div v-html="currentMail.html"></div>
    </div>
    <!-- 이전/이후 목록 조회 -->
    <div class="footer">
      <TableMailList
        :mails="mailStore.articleList"
        :currentMailId="currentMailId"
        mode="adjacent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "~/stores/api";

const mailStore = useStore();
const { currentMail } = storeToRefs(mailStore);

const route = useRoute();

const scheduleDialogVisible = ref(false);
const scheduleForm = ref({
  startDate: "",
  startTime: "",
  expiryDate: "",
  periodType: "no",

  days: [],
  // ...props.editData,
});

await useAsyncData("getWillSendList", async () => {
  await mailStore.fetchMailDetail(route.params.documentId as string);
  return null;
});

const saveSchedule = (updatedData) => {
  scheduleForm.value = updatedData;
  ElMessage.success("변경된 예약설정이 반영되었습니다.");

  scheduleDialogVisible.value = false;
};

const getDayNames = (days) => {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return days.map((day) => dayNames[day]);
};

const isScheduleDeleted = ref(false);

const currentMailId = ref(Number(route.params.documentId)); // 예시 ID, 실제로는 prop이나 상태 관리를 통해 받아올 수 있습니다.

const handleDeleteReservation = (
  folderId: string,
  groupId: string,
  mailId: string
) => {
  mailStore.deleteReservation(folderId, groupId, mailId);
  isScheduleDeleted.value = !isScheduleDeleted.value;
  ElMessage.success("예약을 삭제할 수 있습니다.");
};

watch(
  mailStore.currentMail,
  (newValue) => {
    if (newValue) {
      mailStore.currentMail = { ...currentMail, ...newValue };
    }
  },
  { immediate: true }
);
</script>
