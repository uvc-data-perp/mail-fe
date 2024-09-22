// plugins/tiptap.client.js
import { Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("TiptapEditor", {
    props: {
      modelValue: {
        type: String,
        default: "",
      },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
      const editor = new Editor({
        extensions: [StarterKit, TextStyle, Color],
        content: props.modelValue,
        onUpdate: () => {
          emit("update:modelValue", editor.getHTML());
        },
      });

      return { editor };
    },
    template: '<editor-content :editor="editor" />',
  });
});
