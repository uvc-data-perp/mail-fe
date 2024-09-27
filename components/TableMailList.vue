<template>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
    row-key="id"
    header-row-class-name="text-lg font-bold"
    @selection-change="handleSelectionChange"
  >
    <el-table-column v-if="mode === 'full'" type="selection" width="55" />
    <el-table-column
      v-if="mode === 'adjacent'"
      property="type"
      label="구분"
      width="80"
    >
      <template #default="scope">
        <el-tag :type="scope.row.type === 'prev' ? 'info' : 'success'">
          {{ scope.row.type === "prev" ? "이전" : "다음" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column property="status" label="상태" width="120">
      <template #default="scope">
        <el-tag
          :type="
            mailStore.getStatusName(scope.row.status) === `보냄`
              ? 'success'
              : 'danger'
          "
        >
          {{ mailStore.getStatusName(scope.row.status) }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column
      property="to"
      label="수신인"
      width="120"
      v-if="mode === 'full'"
    />
    <el-table-column property="subject" label="제목">
      <template #default="scope">
        <NuxtLink
          :to="{
            name: 'mail-read-folderId-documentId',
            params: {
              folderId: route.params.folderId,
              documentId: scope.row.id,
            },
            query: {
              groupId: scope.row.groupId,
              status: scope.row.status,
              expiredDate: scope.row.expiredDate,
              reservedDate: scope.row.reservedDate,
              sentDate: scope.row.sentDate,
              sendingTime: scope.row.sendingTime,
              sendingDays: scope.row.sendingDays,
            },
          }"
          class="text-blue-600 hover:underline"
        >
          <p class="font-bold text-lg">
            {{ scope.row.subject }}
          </p>
          {{
            scope.row.text.length > 50
              ? scope.row.text.slice(0, 47) + "..."
              : scope.row.text
          }}
        </NuxtLink>
      </template>
    </el-table-column>
    <el-table-column
      :label="
        route.params.folderId == '1' || route.params.folderId == '5'
          ? '발송일'
          : '만료 예정일'
      "
      width="120"
    >
      <template #default="scope">
        {{ computedFolderDate(folderId, scope.row) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { ElTable, ElTag } from "element-plus";
import type { Mail } from "~/types/api";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  mails: {
    type: Array,
    required: true,
  },
  currentMailId: {
    type: Number,
    default: null,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  mode: {
    type: String,
    default: "full",
    validator: (value: string) => ["full", "adjacent"].includes(value),
  },
});
const route = useRoute();
const folderId = computed(() => route.params.folderId);

const mailStore = useStore();

const multipleTableRef = ref<InstanceType<typeof ElTable>>();

const tableData = computed(() => {
  if (props.mode === "full") {
    return props.mails;
  } else {
    const currentIndex = props.mails.findIndex(
      (mail: any) => mail.id === props.currentMailId
    );

    // currentIndex가 유효한 경우에만 이전/다음 메일을 찾습니다.
    if (currentIndex !== -1) {
      const prevMail =
        currentIndex > 0
          ? { ...props.mails[currentIndex - 1], type: "prev" as const }
          : null;
      const nextMail =
        currentIndex < props.mails.length - 1
          ? { ...props.mails[currentIndex + 1], type: "next" as const }
          : null;
      return [prevMail, nextMail].filter(Boolean) as Mail[];
    } else {
      // currentIndex가 -1인 경우, 현재 메일을 찾지 못했으므로 빈 배열을 반환합니다.
      console.warn("Current mail not found in the list");
      return [];
    }
  }
});

const handleSelectionChange = (selectedRows: Mail[]) => {
  if (props.mode === "full") {
    emit("update:modelValue", selectedRows);
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const result = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(timestamp);

  return result;
};

const convertDateFormat = (dateInfo: Date) => {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateInfo));
};

const computedFolderDate = computed(() => (folderId: any, row: Mail) => {
  switch (folderId) {
    case "1":
      return row.sentDate ? convertDateFormat(row.sentDate) : "";
    case "2":
    case "3":
      return row.expiredDate ? convertDateFormat(row.expiredDate) : "";
    case "4":
      return row.reservedDate ? convertDateFormat(row.reservedDate) : "";
    case "5":
      return row.sentDate ? convertDateFormat(row.sentDate) : "";
    default:
      return ""; // 또는 적절한 기본값
  }
});
</script>
