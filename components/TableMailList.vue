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
      property="author"
      label="수신인"
      width="120"
      v-if="mode === 'full'"
    />
    <el-table-column property="title" label="제목">
      <template #default="scope">
        <NuxtLink
          :to="'/mail/read/' + route.params.folderId + '/' + scope.row.id"
          class="text-blue-600 hover:underline"
        >
          <p class="font-bold text-lg">{{ scope.row.title }}</p>
          {{
            scope.row.content.length > 50
              ? scope.row.content.slice(0, 47) + "..."
              : scope.row.content
          }}
        </NuxtLink>
      </template>
    </el-table-column>
    <el-table-column label="Date" width="120">
      <template #default="scope">{{ scope.row.publishedAt }}</template>
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
  id: number;
  author: string;
  title: string;
  content: string;
  publishedAt: string;
  type?: "prev" | "next";
}

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
</script>
