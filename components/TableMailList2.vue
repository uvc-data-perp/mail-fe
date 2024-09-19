<template>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
    row-key="_id"
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
              documentId: scope.row._id,
            },
            query: {
              ...scope.row,
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
    <el-table-column label="Date" width="120">
      <template #default="scope">{{ scope.row.reserved_time }}</template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { ElTable, ElTag } from "element-plus";

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

interface Mail {
  _id: number;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  reserved_time: string;
  type?: "prev" | "next";
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>();

const tableData = computed(() => {
  if (props.mode === "full") {
    return props.mails;
  } else {
    const currentIndex = props.mails.findIndex(
      (mail: Mail) => mail._id === props.currentMailId
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
</script>
