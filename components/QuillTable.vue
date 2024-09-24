<template>
  <div>
    <client-only>
      <div ref="editorContainer"></div>
    </client-only>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Quill from "quill";
import QuillBetterTable from "quill-better-table";

import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";

const editorContainer = ref(null);
const quill = ref(null);

onMounted(() => {
  if (typeof window !== "undefined") {
    Quill.register("modules/better-table", QuillBetterTable);

    quill.value = new Quill(editorContainer.value, {
      theme: "snow",
      modules: {
        table: false, // disable table module
        "better-table": {
          operationMenu: {
            items: {
              unmergeCells: {
                text: "셀 병합 해제",
              },
            },
            color: {
              colors: ["#fff", "red", "rgb(0, 0, 0)"], // colors in operationMenu
              text: "배경색", // subtitle
            },
          },
        },
        keyboard: {
          bindings: QuillBetterTable.keyboardBindings,
        },
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
          ["table"],
        ],
      },
    });
  }
});
</script>

<style>
.quill-better-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.quill-better-table td {
  border: 1px solid #000;
  padding: 2px 5px;
}
</style>
