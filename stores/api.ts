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
  const pagerCount = ref(11);

  // 필터 조건 (예: 검색어)
  const filterCondition = ref("");

  // 필터링된 메일 리스트

  // 필터 조건 변경 함수
  function setFilterCondition(condition: string) {
    filterCondition.value = condition;
  }

  // mail State
  const currentMail = ref<Mail>({
    id: "66ebd34f7dd992837e473407",
    from: "jjoo08152@gmail.com",
    to: "jjoo0815@gmail.com",
    subject: "Hello ✔",
    text: "Hello Jisang?",
    html: "<b>안녕하세요 김신영2입니다 반갑습니다!!</b>",
    status: "Waiting",
    sentTimestamp: "9726709750",
    v: 0,
    reservedTime: "9726709750",
  });
  const mailList = ref(<Mail[]>[
    {
      id: "66ebd34f7dd992837e473407",
      from: "jjoo08152@gmail.com",
      to: "jjoo0815@gmail.com",
      subject: "Hello ✔",
      text: "Hello Jisang?",
      html: "<b>안녕하세요 김신영2입니다 반갑습니다!!</b>",
      status: "Waiting",
      sentTimestamp: "9726709750",
      v: 0,
      reservedTime: "9726709750",
    },
  ]);
  const filteredMailList = computed(() => {
    return mailList.value.filter(
      (mail) =>
        mail.subject
          .toLowerCase()
          .includes(filterCondition.value.toLowerCase()) ||
        mail.text.toLowerCase().includes(filterCondition.value.toLowerCase())
    );
  });

  const paginatedFilteredMailList = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return filteredMailList.value.slice(startIndex, endIndex);
  });

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
      response.data.result.forEach((mail: Mail) => {
        mail["reservedDate"] = new Date(mail.reservedTime.split("_")[0] * 1000);
      });

      mailList.value = response.data.result;
      setmailList(response.data.result);
      setTotalResults(response.data.result.length);
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

  const fetchMailDetail = async (mailId: string) => {
    const { $axios } = useNuxtApp();
    try {
      const response = await $axios.get(`/email/${mailId}`);
      currentMail.value = response.data.result;
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

  const setPage = (page: number) => {
    currentPage.value = page;
    // fetchArticles();
  };

  const setmailList = (a: Mail[]) => {
    mailList.value = a;
  };

  const setTotalResults = (total: number) => {
    totalResults.value = total;
  };

  return {
    currentMail,
    mailList,
    searchValue,
    articleList,
    currentPage,
    totalResults,
    pagerCount,
    pageSize,
    filteredMailList,
    filterCondition,
    paginatedFilteredMailList,
    setFilterCondition,
    changeSearchValue,
    setPage,
    fetchWillSendList,
    setmailList,
    setTotalResults,
    fetchMailDetail,
  };
});
