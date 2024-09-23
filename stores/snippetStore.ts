import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Snippet } from "~/types/snippetStore";
import axios from "axios";

export const useSnippetStore = defineStore("snippetStore", () => {
  // state
  const snippets = ref<Snippet[]>([
    {
      id: "111e",
      from: "$기본값",
      to: "hello",
      keyBoard: "Ctrl+I",
    },
  ]);

  const newSnippet = ref<Snippet>({ id: "", from: "", to: "", keyBoard: "" });

  const currentPage = ref(1);
  const totalResults = ref(1);
  const pagerCount = ref(11);
  const pageSize = ref(6);
  const paginatedSnippets = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return snippets.value.slice(startIndex, endIndex);
  });

  // getters
  const snippetCount = computed(() => snippets.value.length);

  // actions

  const fetchSnippetList = async () => {
    const { $axios } = useNuxtApp();
    try {
      const response = await $axios.get("/snippets", {
        headers: {
          // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
        },
      });
      totalResults.value = response.data.result.length;
      snippets.value = response.data.result.reverse();

      return response.data;
    } catch (error: any) {
      console.error("Error fetching will-send list:", error);
      if (error.response) {
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      throw error;
    }
  };

  const validationSnippet = (snippet: Snippet) => {
    if (snippet.from === "") {
      return "변경 전 문자를 입력해주세요";
    }
    if (snippet.to === "") {
      return "변경 후 문자를 입력해주세요";
    }
    if (snippets.value.some((s) => s.from === snippet.from)) {
      return "변경 전 문자가 이미 존재합니다.";
    }
    if (snippets.value.some((s) => s.keyBoard === snippet.keyBoard)) {
      return "사용 중인 단축키가 이미 존재합니다.";
    }

    return null;
  };

  const addSnippet = async (newSnippet: Snippet) => {
    const { $axios } = useNuxtApp();
    try {
      const response = await $axios.post("/snippets", newSnippet);

      return response.data;
    } catch (error) {
      console.error("Error fetching will-send list:", error);
      if (error.response) {
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      throw error;
    }
  };

  const deleteSnippet = async (id: string) => {
    const { $axios } = useNuxtApp();
    try {
      const response = await $axios.delete(`/snippets/${id}`);
      snippets.value = snippets.value.filter((s) => s.id !== id);
      return response.data;
    } catch (error) {
      console.error("Error fetching will-send list:", error);
      if (error.response) {
        console.error(
          "Server responded with:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      throw error;
    }
  };

  const updateSnippet = async (scopeInfo) => {
    const target = snippets.value.find((s) => s.id === scopeInfo.id);
    if (target) {
      await deleteSnippet(target.id);
      await addSnippet({ ...target, ...scopeInfo });
      await fetchSnippetList();
    }
  };

  function clearSnippets() {
    snippets.value.forEach((s) => {
      deleteSnippet(s.id);
    });
    fetchSnippetList();
    // const { $axios } = useNuxtApp();
    // snippets.value = [];
  }

  const setPage = (page: number) => {
    currentPage.value = page;
    // fetchArticles();
  };

  return {
    snippets,
    newSnippet,
    snippetCount,
    currentPage,
    totalResults,
    pagerCount,
    pageSize,
    paginatedSnippets,
    addSnippet,
    validationSnippet,
    updateSnippet,
    deleteSnippet,
    clearSnippets,
    fetchSnippetList,
    setPage,
  };
});
