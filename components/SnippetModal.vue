<template>
  <el-dialog
    v-model="dialogVisible"
    title="축약어 수정"
    width="60%"
    @close="handleClose"
  >
    <el-input v-model="newSnippet.before" placeholder="before" />
    <el-input v-model="newSnippet.after" placeholder="after" />
    <el-button @click="addSnippet">추가</el-button>
    <el-table
      ref="multipleTableRef"
      :data="snippetStore.snippets"
      style="width: 100%"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="before" label="변경 전" width="120" />
      <el-table-column property="after" label="변경 후" />
      <el-table-column fixed="right" width="120">
        <template #default="scope">
          <el-button
            size="small"
            @click="(id) => snippetStore.deleteSnippet(scope.row.id)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <br />
    <br />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElTable } from "element-plus";
import { useSnippetStore } from "~/stores/snippetStore"; // 스토어 파일 경로에 맞게 수정해주세요

const props = defineProps({
  visible: Boolean,
  editData: Array,
});

const snippetStore = useSnippetStore();

const newSnippet = ref({ before: "", after: "" });

const addSnippet = () => {
  snippetStore.addSnippet(newSnippet.value);
  newSnippet.value = { before: "", after: "" };
};

interface snippet {
  id: number;
  before: string;
  after: string;
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<snippet[]>([]);
const toggleSelection = (rows?: snippet[]) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value!.clearSelection();
  }
};
const handleSelectionChange = (val: snippet[]) => {
  multipleSelection.value = val;
};

const emit = defineEmits(["update:visible", "save"]);

const dialogVisible = ref(props.visible);
const form = ref({ ...props.editData });

watch(
  () => props.visible,
  (newValue) => {
    dialogVisible.value = newValue;
  }
);

const handleClose = () => {
  emit("update:visible", false);
};
</script>
