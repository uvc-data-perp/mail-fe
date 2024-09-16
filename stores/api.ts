import { defineStore } from "pinia";
import axios from "axios";
import type { Article } from "~/types/api";

export const useStore = defineStore("store", () => {
  // State
  const searchValue = ref<string>("korea");
  const articleList = ref<Article[]>([]);
  const currentPage = ref(1);
  const pageSize = ref(9);
  const totalResults = ref(0);
  // const totalPages = computed(() =>
  //   Math.ceil(totalResults.value / pageSize.value)
  // );

  // Actions
  // Mutations => State를 변경할 목적으로 작성된 코드
  const changeSearchValue = (payload: string) => {
    searchValue.value = payload;
  };
  // News API 호출
  // const getNews = async () => {
  //   const API_KEY = "06f671fa9166414cb0a08dab3e00a616";
  //   // const API_URL = `https://newsapi.org/v2/everything?q=${searchValue.value}&from=2024-09-15&sortBy=popularity&apiKey=${API_KEY}`;
  //   const API_URL = `https://newsapi.org/v2/everything?q=${searchValue.value}&from=2024-09-10&sortBy=popularity&page=${currentPage.value}&pageSize=${pageSize.value}&apiKey=${API_KEY}`;
  //   try {
  //     articleList.value = await axios.get(API_URL).then((res) => {
  //       return res.data.articles;
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchArticles = async () => {
    const API_KEY = "06f671fa9166414cb0a08dab3e00a616";
    const API_URL = `https://newsapi.org/v2/everything?q=${searchValue.value}&from=2024-09-10&sortBy=popularity&page=${currentPage.value}&pageSize=${pageSize.value}&apiKey=${API_KEY}`;

    try {
      const data = await await axios.get(API_URL).then((res) => {
        return res.data;
      });
      articleList.value = data.articles;
      totalResults.value = data.totalResults;

      console.log(totalResults);
      console.log(totalResults);
      console.log(totalResults);
      console.log(totalResults);
      console.log(totalResults);
      console.log(totalResults);
      console.log(totalResults);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const setPage = (page) => {
    currentPage.value = page;
    fetchArticles();
  };

  return {
    searchValue,
    articleList,
    currentPage,
    totalResults,
    changeSearchValue,
    fetchArticles,
    setPage,
  };
});
