import { defineStore } from "pinia";
import axios from "axios";
import type { Article, Mail, ReservedMail } from "~/types/api";

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
    sentDate: new Date(0),
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
      sentDate: new Date(0),
      v: 0,
      reservedTime: "9726709750",
    },
  ]);

  const reservedMailList = ref(<ReservedMail[]>[
    {
      id: "66f22a7f77d141e1f4d5cf78",
      groupId: "66f22a7f77d141e1f4d5cf78",
      emailContents: ["66f22a7f77d141e1f4d5cf50"],
      expiredDate: new Date(0),
      expired_timestamp: "1735657199",
      sendingDays: [],
      status: "Waiting",
      reservedDate: new Date(0),
      reservedTime: "1735657199",
      from: "jjoo08152@gmail.com",
      sentTimestamp: "9726709750",
      sentDate: new Date(0),
      subject: "기본제목",
      text: "기본내용",
      to: "jjoo08152@gmail.com",
      v: 0,
    },
  ]);

  const filteredReservedMailList = computed(() => {
    return reservedMailList.value.filter(
      (mail) =>
        mail.subject
          .toLowerCase()
          .includes(filterCondition.value.toLowerCase()) ||
        mail.text.toLowerCase().includes(filterCondition.value.toLowerCase())
    );
  });
  const filteredMailList = computed(() => {
    return mailList.value.filter(
      (mail) =>
        mail.subject
          .toLowerCase()
          .includes(filterCondition.value.toLowerCase()) ||
        mail.text.toLowerCase().includes(filterCondition.value.toLowerCase())
    );
  });

  const paginatedFilteredReservedMailList = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return filteredReservedMailList.value.slice(startIndex, endIndex);
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

  // const fetchWillSendList = async () => {
  //   const { $axios } = useNuxtApp();

  //   try {
  //     const response = await $axios.get("/email/sent", {
  //       headers: {
  //         // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
  //       },
  //     });
  //     response.data.result.forEach((mail: Mail) => {
  //       mail["reservedDate"] = new Date(
  //         Number(mail.sentTimestamp.split("_")[0]) * 1000
  //       );
  //     });
  //     response.data.result.sort((a, b) => {
  //       return b.reservedDate.getTime() - a.reservedDate.getTime();
  //     });

  //     // mailList.value = response.data.result;
  //     setMailList(response.data.result);
  //     setTotalResults(response.data.result.length);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching will-send list:", error);
  //     if (error.response) {
  //       console.error(
  //         "Server responded with:",
  //         error.response.status,
  //         error.response.data
  //       );
  //     } else if (error.request) {
  //       console.error("No response received:", error.request);
  //     } else {
  //       console.error("Error setting up request:", error.message);
  //     }
  //     throw error;
  //   }
  // };

  const fetchSentList = async () => {
    const { $axios } = useNuxtApp();

    try {
      const response = await $axios.get("/email/sent", {
        headers: {
          // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
        },
      });
      // 새로운 배열을 생성하여 각 메일 객체를 복사하고 sentDate를 추가합니다.
      const updatedMails = response.data.result.map((mail: Mail) => {
        const sentDate = new Date(Number(mail.sentTimestamp) * 1000);
        return { ...mail, sentDate };
      });
      updatedMails.sort((a, b) => {
        return b.sentDate.getTime() - a.sentDate.getTime();
      });

      // mailList.value = response.data.result;
      setMailList(updatedMails);

      setTotalResults(updatedMails.length);
      return updatedMails;
    } catch (error) {
      console.error("Error fetching sent list:", error);
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

  const transformEmailData = (data) => {
    return data.map((item) => {
      // Spread the emailContent properties to the top level
      // and include the reserved_timestamp
      return {
        ...item.emailContent,
        reservedDate: new Date(Number(item.reservedTimestamp) * 1000),
      };
    });
  };

  const fetchWillSingleList = async () => {
    const { $axios } = useNuxtApp();
    let result;

    try {
      const response = await $axios.get("/will-send/single", {
        headers: {
          // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
        },
      });
      result = transformEmailData(response.data.result);
      result.sort((a, b) => {
        return b.reservedDate.getTime() - a.reservedDate.getTime();
      });

      // mailList.value = response.data.result;
      console.log("일회성 결과:", result);
      console.log("일회성 결과길이:", result.length);
      setMailList(result);
      setTotalResults(result.length);
      return result;
    } catch (error) {
      console.error("Error fetching will-sing list:", error);
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

      response.data.result = {
        ...response.data.result,
        reservedDate: response.data.result.reservedTimestamp
          ? new Date(Number(response.data.result.reservedTimestamp) * 1000)
          : null,
        sentDate: response.data.result.sentTimestamp
          ? new Date(Number(response.data.result.sentTimestamp))
          : null,
      };
      currentMail.value = response.data.result;

      return response.data;
    } catch (error) {
      console.error("Error fetching will-detail:", error);
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

  const setMailList = (a: Mail[]) => {
    mailList.value = a;
  };

  const setTotalResults = (total: number) => {
    totalResults.value = total;
  };

  //// 예약 관련/////////

  const fetchReservedMailList = async (folderId: string) => {
    let apiEndpoint = "/email/sent";
    switch (folderId) {
      case "1":
        apiEndpoint = "/email/sent";
        fetchSentList();
        break;
      case "2":
        break;
      // apiEndpoint = "/regularity/month";
      case "3":
        break;

      // apiEndpoint = "/regularity/day";
      case "4":
        apiEndpoint = "/will-send/single";
        fetchWillSingleList();
        break;
      case "5":
        apiEndpoint = "/get-all-trashed-email";
        break;
      default:
        apiEndpoint = "/email/sent";
    }
  };

  const monthTemp = async () => {
    const { $axios } = useNuxtApp();

    try {
      const monthlyResponse = await $axios.get(apiEndpoint, {
        headers: {
          // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
        },
      });

      const updatedResults = await Promise.all(
        monthlyResponse.data.result.map(async (result) => {
          result.expiredDate = new Date(Number(result.expiredTimestamp) * 1000);

          result.groupId = result.id;

          const emailResponse = await $axios.get(
            `/email/${result.emailContents[result.emailContents.length - 1]}`,
            {
              headers: {
                // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
              },
            }
          );

          // 여기서 emailResponse.data를 result에 추가합니다.
          // 예를 들어:
          result = { ...result, ...emailResponse.data.result };

          return result;
        })
      );
      setReservedMailList(updatedResults);
      setTotalResults(updatedResults.length);
      // setTotalResults(1000);

      return updatedResults;
    } catch (error) {
      console.error("Error fetching data", error);
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

  const setReservedMailList = (value: ReservedMail[]) => {
    reservedMailList.value = value;
  };

  const deleteReservation = async (
    folderId: string,
    mailId: string,
    groupId: string
  ) => {
    const { $axios } = useNuxtApp();

    let reservationType;
    let response;

    try {
      switch (folderId) {
        case "2":
          reservationType = "month";
          response = await $axios.delete(
            `/regularity/${reservationType}/${groupId}`
          );
          break;
        case "3":
          reservationType = "day";
          response = await $axios.delete(
            `/regularity/${reservationType}/${groupId}`
          );
          break;
        case "4":
          reservationType = "single";
          response = await $axios.delete(`/send/booking/cancel/${mailId}`);
          break;
        default:
          throw new Error(`Invalid folderId: ${folderId}`);
      }

      await fetchMailDetail(mailId);

      return response.data;
    } catch (error) {
      console.error("Error delete reservation mails:", error);
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

  ////수정,삭제 관련///////
  // const deleteMail = async (mailId: string) => {

  //   const { $axios } = useNuxtApp();

  //   try {
  //     const response = await $axios.delete(`/email/${mailId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching will-send list:", error);}
  //     if (error.response) {
  //       console.error()}
  //     else if (error.request) {
  //       console.error("No response received:", error.request);}
  //     else {
  //       console.error("Error setting up request:", error.message);}
  //     throw error;
  // }

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
    setMailList,
    setTotalResults,
    fetchMailDetail,

    //수정관련///
    reservedMailList,
    paginatedFilteredReservedMailList,
    setReservedMailList,
    fetchReservedMailList,
    deleteReservation,
  };
});
