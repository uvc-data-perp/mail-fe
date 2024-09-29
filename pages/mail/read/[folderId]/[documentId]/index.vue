<template>
  <div v-if="loading">로딩중</div>
  <div v-else-if="error">에러 발생: {{ error }}</div>
  <div v-else-if="!mailStore.currentMail">메일 데이터를 찾을 수 없습니다.</div>
  <div v-else class="bg-white rounded-lg shadow-md p-6 w-full">
    <div class="mb-4 border-b-4 w-full">
      <!-- 제목 -->
      <div class="title">
        <h2 class="text-2xl font-bold mb-6">
          {{ mailStore.currentMail.subject }}
        </h2>
      </div>
      <!-- 보낸 사람 -->
      <div class="flex w-full items-center mb-2">
        <el-tag type="info" class="mr-2 flex-shrink-0">보낸사람</el-tag>
        <span flex-grow border-b>
          {{ mailStore.currentMail.from }}
        </span>
      </div>
      <!-- 받는 사람 -->
      <div class="flex w-full items-center mb-2">
        <el-tag type="success" class="mr-2">받는사람</el-tag>
        <span flex-grow border-b>{{ mailStore.currentMail.to }}</span>
      </div>
      <!-- 예약날짜 or 보낸 날짜 표시 -->
      <div
        v-if="
          route.params.folderId == '2' ||
          route.params.folderId == '3' ||
          route.params.folderId == '4'
        "
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
              String(mailStore.currentMail.id),
              String(route.query.groupId)
            )
          "
          :type="
            mailStore.currentMail.status === `Cancelled` ? 'danger' : 'success'
          "
          >{{
            mailStore.currentMail.status === `Cancelled` ? "취소됨" : "취소하기"
          }}
        </el-button>
        <ScheduleModal
          v-if="scheduleDialogVisible"
          v-model:visible="scheduleDialogVisible"
          @save="saveSchedule"
        />
        <p
          class="text-sm text-gray-600"
          :class="
            mailStore.currentMail.status === 'Cancelled' ? 'line-through' : ''
          "
        >
          {{
            route.query.expiredDate ? ` 만료일:${route.query.expiredDate}` : ""
          }}

          {{ route.query.sendingDays ? `주기: ${computedSendingDays}` : "" }}

          {{
            route.query.sendingTime
              ? `전송시각: ${route.query.sendingTime}`
              : ""
          }}

          {{
            route.query.reservedDate
              ? `보낼 날짜: ${route.query.reservedDate}`
              : ""
          }}
        </p>
      </div>
      <div class="flex-1 items-center mb-2">
        <div
          v-if="route.params.folderId === '1' || route.params.folderId === '5'"
        >
          <el-tag type="info" class="mr-2 flex-shrink-0">보낸 날짜</el-tag>
          <span class="text-sm text-gray-600">
            {{ route.query?.sentDate }}
          </span>
        </div>
      </div>
    </div>
    <!-- 본문내용 -->
    <div class="content flex overflow-x-auto w-full border-b-4">
      <div v-html="mailStore.currentMail.html"></div>
    </div>
    <!-- 이전/이후 목록 조회 -->
    <div class="footer">
      <TableMailList
        v-model="selectedRows"
        :mails="
          route.params.folderId == '1' ||
          route.params.folderId == '4' ||
          route.params.folderId == '5'
            ? mailStore.paginatedFilteredMailList
            : mailStore.paginatedFilteredReservedMailList
        "
        :currentMailId="currentMailId"
        mode="adjacent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "~/stores/readMailStore";
import { storeToRefs } from "pinia";

const mailStore = useStore();
const { currentMail } = storeToRefs(mailStore);

const route = useRoute();
const folderId = route.params.folderId;

const scheduleDialogVisible = ref(false);
const scheduleForm = ref({
  startDate: "",
  startTime: "",
  expiryDate: "",
  periodType: "no",
  days: [],
});

const loading = ref(false);
const error = ref(null);

const selectedRows = ref([]);

const fetchMailData = async (documentId: string) => {
  loading.value = true;
  error.value = null;
  try {
    await mailStore.fetchMailDetail(documentId);
    if (!mailStore.currentMail) {
      throw new Error("메일 데이터를 찾을 수 없습니다.");
    }
  } catch (e) {
    error.value = e.message || "메일을 불러오는 데 실패했습니다.";
    console.error("Failed to fetch mail details:", e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (route.params.documentId) {
    await fetchMailData(route.params.documentId as string);
  }
});

const saveSchedule = (updatedData: any) => {
  scheduleForm.value = updatedData;
  ElMessage.success("예약 변경은 구현예정입니다.");
  scheduleDialogVisible.value = false;
};

const computedSendingDays = computed(() => {
  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
  if (
    route.query.sendingDays[0] === "true" ||
    route.query.sendingDays[0] === "false"
  ) {
    const a = route.query.sendingDays
      .map((day: string, index) => (day === "true" ? dayNames[index] : null))
      .filter((day) => day !== null)
      .join(",");
    return `${a}요일`;
  } else {
    return `${route.query.sendingDays}일`;
  }
});

const isScheduleDeleted = ref(false);

const currentMailId = ref(route.params.documentId as string);

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
  () => route.params.documentId,
  async (newDocumentId, oldDocumentId) => {
    if (newDocumentId && newDocumentId !== oldDocumentId) {
      await fetchMailData(newDocumentId as string);
    }
  },
  { immediate: true }
);
</script>
