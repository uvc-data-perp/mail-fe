import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Snippet } from "~/types/snippetStore";

export const useSnippetStore = defineStore("snippetStore", () => {
  // state
  const snippets = ref<Snippet[]>([
    {
      id: 1,
      before: "$안녕",
      after: "hello",
      keyBoard: "Ctrl+I",
    },
  ]);

  // getters
  const snippetCount = computed(() => snippets.value.length);

  // actions
  function addSnippet(snippet: Snippet) {
    snippets.value.push({
      ...snippet,
      id: Date.now(), // 간단한 고유 ID 생성 (실제 앱에서는 더 강력한 방법 사용 권장)
    });
  }

  function updateSnippet(id: number, updatedSnippet: Snippet) {
    const index = snippets.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      snippets.value[index] = { ...updatedSnippet, id };
    }
  }

  function deleteSnippet(id: number) {
    snippets.value = snippets.value.filter((s) => s.id !== id);
  }

  function clearSnippets() {
    snippets.value = [];
  }

  return {
    snippets,
    snippetCount,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    clearSnippets,
  };
});
