import { defineStore } from "pinia";
import axios from "axios";
import type { Article, Mail } from "~/types/api";

export const useStore = defineStore("store", () => {
  // State
  const searchValue = ref<string>("korea");
  const articleList = ref<Article[]>([]);
  const currentPage = ref(1);
  const pageSize = ref(6);
  const totalResults = ref(0);

  // mail State
  const mailList = ref(<Mail>[
    {
      _id: "66ebd34f7dd992837e473407",
      from: "jjoo08152@gmail.com",
      to: "jjoo0815@gmail.com",
      subject: "Hello ✔",
      text: "Hello Jisang?",
      html: "<b>안녕하세요 김신영2입니다 반갑습니다!!</b>",
      status: "Waiting",
      sent_timestamp: "9726709750",
      __v: 0,
      reserved_time: "9726709750",
    },
  ]);

  // Actions
  // Mutations => State를 변경할 목적으로 작성된 코드
  const changeSearchValue = (payload: string) => {
    searchValue.value = payload;
  };

  const fetchWillSendList = async () => {
    const { $axios } = useNuxtApp();

    try {
      const response = await $axios.get("/will-send", {
        headers: {
          // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
        },
      });

      mailList.value = response.data.result;

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

  const fetchArticles = async () => {
    const API_KEY = "06f671fa9166414cb0a08dab3e00a616";
    const API_URL = `https://newsapi.org/v2/everything?q=${searchValue.value}&from=2024-09-10&sortBy=popularity&page=${currentPage.value}&pageSize=${pageSize.value}&apiKey=${API_KEY}`;

    try {
      const data = await await axios.get(API_URL).then((res) => {
        return res.data;
      });
      articleList.value = data.articles.map((article, idx) => ({
        id: idx + 1,
        ...article,
      }));
      totalResults.value = data.totalResults;
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const setPage = (page) => {
    currentPage.value = page;
    fetchArticles();
  };

  return {
    mailList,
    searchValue,
    articleList,
    currentPage,
    totalResults,
    changeSearchValue,
    fetchArticles,
    setPage,
    fetchWillSendList,
  };
});
