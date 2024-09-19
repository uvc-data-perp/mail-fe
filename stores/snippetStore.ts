import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Snippet } from "~/types/snippetStore";
import axios from "axios";

export const useSnippetStore = defineStore("snippetStore", () => {
  const api = axios.create({
    baseURL: "http://158.247.200.126:3001",
    timeout: 10000000,
    withCredentials: false, // 쿠키 포함
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  // state
  const snippets = ref<Snippet[]>([
    {
      _id: "111e",
      from: "$기본값",
      to: "hello",
      keyBoard: "Ctrl+I",
    },
  ]);

  // getters
  const snippetCount = computed(() => snippets.value.length);

  // actions

  const fetchSnippetList = async () => {
    try {
      const response = await api.get("/snippets", {
        headers: {
          // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
        },
      });
      snippets.value = response.data.result;

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

  const addSnippet = async (newSnippet: Snippet) => {
    try {
      const response = await api.post("/snippets", newSnippet);

      snippets.value.push({
        ...newSnippet,
        from: "$" + newSnippet.from,
        _id: Date.now(), // 간단한 고유 ID 생성 (실제 앱에서는 더 강력한 방법 사용 권장)
      });

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

  const deleteSnippet = async (_id: string) => {
    console.log(_id);
    console.log(_id);
    console.log(_id);
    console.log(_id);

    try {
      const response = await api.delete(`/snippets/${_id}`);
      snippets.value = snippets.value.filter((s) => s._id !== _id);
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

  function updateSnippet(_id: number, updatedSnippet: Snippet) {
    const index = snippets.value.findIndex((s) => s._id === _id);
    if (index !== -1) {
      snippets.value[index] = { ...updatedSnippet, _id };
    }
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
    fetchSnippetList,
  };
});
