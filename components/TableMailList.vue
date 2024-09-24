<template>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
    row-key="id"
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
            },
          }"
          class="text-blue-600 hover:underline"
        >
          <p class="font-bold text-lg">{{ scope.row.subject }}</p>
          {{
            scope.row.text.length > 50
              ? scope.row.text.slice(0, 47) + "..."
              : scope.row.text
          }}
        </NuxtLink>
      </template>
    </el-table-column>
    <el-table-column
      :label="route.params.folderId == '1' ? '발송일' : '만료 예정일'"
      width="120"
    >
      <template #default="scope">{{
        // formatDate(scope.row.reservedDate)
        route.params.folderId == "1"
          ? scope.row.reservedDate
          : scope.row.expiredDate
      }}</template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { ElTable, ElTag } from "element-plus";
import type { Mail } from "~/types/api";

const props = defineProps({
  mails: {
    type: Array,
    required: true,
  },
  currentMailId: {
    type: Number,
    default: null,
  },
  mode: {
    type: String,
    default: "full",
    validator: (value: string) => ["full", "adjacent"].includes(value),
  },
});
const route = useRoute();

const multipleTableRef = ref<InstanceType<typeof ElTable>>();

const tableData = computed(() => {
  if (props.mode === "full") {
    return props.mails;
  } else {
    const currentIndex = props.mails.findIndex(
      (mail: Mail) => mail.id === props.currentMailId
    );
    const prevMail =
      currentIndex > 0
        ? { ...props.mails[currentIndex - 1], type: "prev" as const }
        : null;
    const nextMail =
      currentIndex < props.mails.length - 1
        ? { ...props.mails[currentIndex + 1], type: "next" as const }
        : null;
    return [prevMail, nextMail].filter(Boolean) as Mail[];
  }
});

const handleSelectionChange = (selectedRows: Mail[]) => {
  if (props.mode === "full") {
    console.log("Selected rows:", selectedRows);
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
</script>
