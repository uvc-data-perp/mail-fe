<template>
  <div v-if="process.client">
    <div v-if="editor">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        bold
      </button>
      <!-- 다른 버튼들 -->
    </div>
    <TiptapEditorContent v-if="editor" :editor="editor" />
  </div>
</template>

<script setup>
import { useEditor, Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const editor = useEditor({
  extensions: [StarterKit],
});

onBeforeUnmount(() => {
  unref(editor).destroy();
});
</script>
