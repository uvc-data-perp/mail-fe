<template>
  <el-dialog
    v-model="dialogVisible"
    title="단축어 수정"
    width="60%"
    @close="handleClose"
  >
    <el-input v-model="newSnippet.from" placeholder="from" />
    <el-input v-model="newSnippet.to" placeholder="to" />
    <ElInput
      v-model="newSnippet.keyBoard"
      @keydown="onKeyDown"
      placeholder="단축키 입력 (예: Ctrl+I)"
    />
    <el-button @click="addSnippet">추가</el-button>
    <el-table
      ref="multipleTableRef"
      :data="snippetStore.snippets"
      style="width: 100%"
      row-key="_id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="from" label="변경 전" width="120" />
      <el-table-column property="to" label="변경 후" />
      <el-table-column property="keyBoard" label="단축키" />
      <el-table-column fixed="right" width="120">
        <template #default="scope">
          <el-button
            size="small"
            @click="() => snippetStore.deleteSnippet(scope.row._id)"
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
import type { Snippet } from "~/types/snippetStore";

const props = defineProps({
  visible: Boolean,
  editData: Array,
});

const snippetStore = useSnippetStore();
//바로 스닙펫 불러오기 확인
await useAsyncData("fetchSnippetList", async () => {
  await snippetStore.fetchSnippetList();
  console.log(snippetStore.snippets);
  console.log(snippetStore.snippets);
  console.log(snippetStore.snippets);
  console.log(snippetStore.snippets);
  console.log(snippetStore.snippets);
  console.log(snippetStore.snippets);
});

const newSnippet = ref<Snippet>({ from: "", to: "", keyBoard: "" });
const validationSnippet = (snippet: Snippet) => {
  if (snippet.from === "") {
    return "변경 전 문자를 입력해주세요";
  }
  if (snippet.to === "") {
    return "변경 후 문자를 입력해주세요";
  }
  if (snippetStore.snippets.some((s) => s.from === snippet.from)) {
    return "변경 전 문자가 이미 존재합니다.";
  }
  if (snippetStore.snippets.some((s) => s.keyBoard === snippet.keyBoard)) {
    return "사용 중인 단축키가 이미 존재합니다.";
  }

  return null;
};

const addSnippet = () => {
  const validationResult = validationSnippet(newSnippet.value);
  if (validationResult !== null) {
    ElMessage.error(validationResult);
    return; // 여기서 함수를 종료합니다. 등록을 진행하지 않습니다.
  }

  // 검증을 통과한 경우에만 이 부분이 실행됩니다
  snippetStore.addSnippet(newSnippet.value);
  ElMessage.success("스니펫이 추가되었습니다");
  newSnippet.value = { from: "", to: "", keyBoard: "" };
};

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<Snippet[]>([]);
const toggleSelection = (rows?: Snippet[]) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value!.clearSelection();
  }
};
const handleSelectionChange = (val: Snippet[]) => {
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

////
const onKeyDown = (evt: Event) => {
  // 타입 가드: evt가 KeyboardEvent인지 확인
  if (!(evt instanceof KeyboardEvent)) return;

  evt.preventDefault();

  const modifiers = [];
  if (evt.ctrlKey) modifiers.push("Ctrl");
  if (evt.altKey) modifiers.push("Alt");
  if (evt.shiftKey) modifiers.push("Shift");
  if (evt.metaKey) modifiers.push("Meta");

  let key = evt.key;
  if (key === " ") key = "Space";
  if (key.length === 1) key = key.toUpperCase();

  newSnippet.value.keyBoard = [...modifiers, key].join("+");
};
</script>
