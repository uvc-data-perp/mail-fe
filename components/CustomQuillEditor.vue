<!-- CustomQuillEditor.vue -->
<template>
  <QuillEditor
    ref="quillEditor"
    v-model:content="modelValue"
    :options="editorOptions"
    content-type="html"
    theme="snow"
    @update:content="handleUpdate"
    class="wp-100 h-[1000px] border-b-8"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import ImageUploader from "quill-image-uploader";
import { quillTable } from "quill-table";
import quillTableUI from "quill-table-ui";

import QuillBetterTable from "quill-better-table";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const quillEditor = ref(null); // QuillEditor 참조

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const editorOptions = ref({
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
      ["link", "image", "video"],
      [{ table: "TD" }],
    ],
  },
  theme: "snow",
  table: true, // 테이블 모듈 활성화
  tableUI: true, // tableUI 모듈 활성화
  imageUploader: {
    upload: (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("image", file);

        fetch("/your-upload-endpoint", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            resolve(result.url);
          })
          .catch((error) => {
            reject("Upload failed");
            console.error("Error:", error);
          });
      });
    },
  },
});

const handleUpdate = (newContent) => {
  emit("update:modelValue", newContent);
};

// 테이블 삽입 함수
const insertTable = () => {
  if (quillEditor.value) {
    const tableModule = quillEditor.value.quill.getModule("table"); // Quill 인스턴스 접근
    if (tableModule) {
      tableModule.insertTable(3, 3); // 3x3 테이블 삽입
    } else {
      console.error("Table module not found");
    }
  }
};

// 마운트 후 자동으로 테이블 삽입
onMounted(() => {
  if (QuillEditor.Quill) {
    QuillEditor.Quill.register("modules/imageUploader", ImageUploader);
    QuillEditor.Quill.register("modules/table", quillTable);
    QuillEditor.Quill.register("modules/tableUI", quillTableUI);
    QuillEditor.Quill.register("modules/better-table", QuillBetterTable);

    // QuillEditor가 마운트되면 테이블 삽입
    insertTable(); // 에디터 로드 후 테이블 자동 삽입
  }
});
</script>

<style scoped>
.quill-editor-container {
  min-height: 600px; /* 원하는 최소 높이를 지정하세요 */
}

.quill-editor-container .ql-container {
  min-height: 150px; /* 에디터 내부 영역의 최소 높이 */
}

.quill-editor-container .ql-editor {
  min-height: 150px; /* 실제 텍스트 입력 영역의 최소 높이 */
}
</style>
