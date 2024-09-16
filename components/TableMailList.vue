<template>
  <el-table
    ref="multipleTableRef"
    :data="props.mails"
    style="width: 100%"
    row-key="id"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column property="author" label="수신인" width="120" />
    <el-table-column property="title" label="제목" />
    <el-table-column label="Date" width="120">
      <template #default="scope">{{ scope.row.publishedAt }}</template>
    </el-table-column>
  </el-table>

  <!-- <div style="margin-top: 20px">
    <el-button @click="toggleSelection([tableData[1], tableData[2]])">
      Toggle selection status of second and third rows
    </el-button>
    <el-button @click="toggleSelection()">Clear selection</el-button>
  </div> -->
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElTable } from "element-plus";

const props = defineProps({
  mails: Array,
});

interface User {
  id: number;
  to: string;
  title: string;
  date: string;
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<User[]>([]);
const toggleSelection = (rows?: User[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      multipleTableRef.value!.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value!.clearSelection();
  }
};
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};

const tableData: User[] = [
  {
    id: 1,
    to: "Tom",
    title: "No. 189, Grove St, Los Angeles",
    date: "2016-05-03",
  },
  {
    id: 2,
    to: "Tom",
    title: "No. 189, Grove St, Los Angeles",
    date: "2016-05-03",
  },
  {
    id: 3,
    to: "Tom",
    title: "No. 189, Grove St, Los Angeles",
    date: "2016-05-03",
  },
  {
    id: 4,
    to: "Tom",
    title: "No. 189, Grove St, Los Angeles",
    date: "2016-05-03",
  },
  {
    id: 5,
    to: "Tom",
    title: "No. 189, Grove St, Los Angeles",
    date: "2016-05-03",
  },
  {
    id: 6,
    to: "Tom",
    title: "No. 189, Grove St, Los Angeles",
    date: "2016-05-03",
  },
  {
    id: 7,
    to: "Tom",
    title: "No. 189, Grove St, Los Angeles",
    date: "2016-05-03",
  },
  {
    id: 8,
    to: "Tom",
    title: "No. 189, Grove St, Los Angeles",
    date: "2016-05-03",
  },
  {
    id: 9,
    to: "Tom",
    title: "No. 189, Grove St, Los Angeles",
    date: "2016-05-03",
  },
  {
    id: 10,
    to: "Tom",
    title: "No. 189, Grove St, Los Angeles",
    date: "2016-05-03",
  },
];
</script>
