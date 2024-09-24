<script setup>
import { ref, shallowRef, onMounted } from "vue";
import { defineNuxtComponent } from "#imports";

defineNuxtComponent({
  ssr: false,
});

const editor = shallowRef(null);
const isClientMounted = ref(false);

onMounted(() => {
  isClientMounted.value = true;
});

onMounted(async () => {
  if (!import.meta.env.SSR) {
    const [{ default: Quill }, { default: QuillBetterTable }] =
      await Promise.all([import("quill"), import("quill-better-table")]);

    Quill.register({ "modules/better-table": QuillBetterTable }, true);

    editor.value = new Quill("#editor", {
      theme: "snow",
      modules: {
        table: false,
        "better-table": {
          operationMenu: {
            items: {
              unmergeCells: {
                text: "Another unmerge cells name",
              },
            },
            color: {
              colors: ["green", "red", "yellow", "blue", "white"],
              text: "Background Colors:",
            },
          },
        },
      },
    });
  }
});

const insertTable = () => {
  if (editor.value?.getModule("better-table")) {
    editor.value.getModule("better-table").insertTable(3, 3);
  }
};

const getTable = () => {
  if (editor.value?.getModule("better-table")) {
    console.log(editor.value.getModule("better-table").getTable());
  }
};

const getContents = () => {
  if (editor.value) {
    const deltaView = document.querySelector("#delta-view");
    if (deltaView) {
      deltaView.innerHTML = JSON.stringify(editor.value.getContents());
    }
  }
};
</script>

<template>
  <div v-if="isClientMounted">
    <div>
      <h3>
        Insert table and click on the table to wake up the table column tools.
        <br />Right-click on table to show operations menu.<br />
      </h3>
      <div class="btn-group">
        <button @click="insertTable">Insert table</button>
        <button @click="getTable">Get table</button>
        <button @click="getContents">Get contents</button>
      </div>
    </div>
    <div id="editor"></div>
    <h3>Delta formats</h3>
    <p id="delta-view"></p>
  </div>
</template>
