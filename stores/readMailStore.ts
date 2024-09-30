import { defineStore } from "pinia";
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
  const filterConditions = ref({
    to: "",
    subject: "",
    html: "",
    text: "",
    status: "",
    sentDateCondition: "",
  });

  // 필터링된 메일 리스트

  // 필터 조건 변경 함수
  function setFilterConditions(conditions: any) {
    filterConditions.value = conditions;
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
      html: "<b>기본내용</b>",
      v: 0,
    },
  ]);

  const filteredReservedMailList = computed(() => {
    return reservedMailList.value.filter(
      (mail) =>
        mail.to
          .toLowerCase()
          .includes(filterConditions.value.to.toLowerCase()) &&
        mail.subject
          .toLowerCase()
          .includes(filterConditions.value.subject.toLowerCase()) &&
        mail.html
          .toLowerCase()
          .includes(filterConditions.value.html.toLowerCase())
    );
  });
  const filteredMailList = computed(() => {
    return mailList.value.filter(
      (mail) =>
        mail.to
          .toLowerCase()
          .includes(filterConditions.value.to.toLowerCase()) &&
        mail.subject
          .toLowerCase()
          .includes(filterConditions.value.subject.toLowerCase()) &&
        mail.html
          .toLowerCase()
          .includes(filterConditions.value.html.toLowerCase())
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

  const setPage = (page: number) => {
    currentPage.value = page;
    // fetchArticles();
  };

  const setMailList = (a: Mail[]) => {
    mailList.value = a;
  };
  const setReservedMailList = (value: ReservedMail[]) => {
    reservedMailList.value = value;
  };

  const setTotalResults = (total: number) => {
    totalResults.value = total;
  };
  const changeSearchValue = (payload: string) => {
    searchValue.value = payload;
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
    } catch (error: any) {
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
  }; // Added closing curly brace and semicolon here

  function deleteRows(Rows: Mail[]) {
    const { $axios } = useNuxtApp();

    Rows.forEach((element: Mail) => {
      $axios
        .post(`/email/throw-away/${element.id}`, {})
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }

  const fetchSentList = async (apiEndpoint: string) => {
    console.log("fetchSentList 진입");

    const { $axios } = useNuxtApp();

    try {
      const response = await $axios.get(apiEndpoint, {
        headers: {
          // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
        },
      });
      // 새로운 배열을 생성하여 각 메일 객체를 복사하고 sentDate를 추가합니다.
      const updatedMails = response.data.result.map((mail: Mail) => {
        //* 받은 mail.sentTimestamp값이 ms단위라서 s->ms(*1000)없이 변환 *///
        const sentDate = new Date(Number(mail.sentTimestamp));
        return { ...mail, sentDate };
      });
      updatedMails.sort((a: any, b: any) => {
        return b.sentDate.getTime() - a.sentDate.getTime();
      });

      // mailList.value = response.data.result;
      setMailList(updatedMails);

      setTotalResults(updatedMails.length);
      return updatedMails;
    } catch (error: any) {
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

  const fetchCalendarList = async (apiEndpoint: string) => {
    console.log("fetchSentList 진입");

    const { $axios } = useNuxtApp();

    fetchSentList(`/email/sent`);

    try {
      const response = await $axios.get(`/will-send/`, {
        headers: {
          // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
        },
      });
      // 새로운 배열을 생성하여 각 메일 객체를 복사하고 sentDate를 추가합니다.
      const updatedMails = response.data.result.map((mail: Mail) => {
        //* 받은 mail.sentTimestamp값이 ms단위라서 s->ms(*1000)없이 변환 *///
        const reservedDate = new Date(
          Number(mail.reservedTime.split("_")[0]) * 1000
        );

        return { ...mail, reservedDate };
      });
      updatedMails.sort((a: any, b: any) => {
        return b.reservedDate.getTime() - a.reservedDate.getTime();
      });

      // mailList.value = response.data.result;

      mailList.value = [...mailList.value, ...updatedMails];

      setTotalResults(totalResults.value + updatedMails.length);
      return updatedMails;
    } catch (error: any) {
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

  const transformEmailData = (data: any) => {
    return data.map((item: any) => {
      // emailContent 속성의 값인 객체에 있는 속성,값을 구조분해로 가져오고 timestamp에서 예약Date값을 추가
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
      result.sort((a: any, b: any) => {
        return b.reservedDate.getTime() - a.reservedDate.getTime();
      });

      // mailList.value = response.data.result;
      console.log("일회성 결과:", result);
      console.log("일회성 결과길이:", result.length);
      setMailList(result);
      setTotalResults(result.length);
      return result;
    } catch (error: any) {
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
    } catch (error: any) {
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

  //   //// 예약 관련/////////

  const fetchReservedMailList = async (folderId: string) => {
    let apiEndpoint = "/email/sent";
    switch (folderId) {
      case "1":
        apiEndpoint = "/email/sent";
        fetchSentList(apiEndpoint);
        break;
      case "2":
        apiEndpoint = "/regularity/month";
        fetchScheduledMails(apiEndpoint);
        break;
      case "3":
        apiEndpoint = "/regularity/day";
        fetchScheduledMails(apiEndpoint);
        break;
      case "4":
        apiEndpoint = "/will-send/single";
        fetchWillSingleList();
        break;
      case "5":
        apiEndpoint = "/email/get-all-trashed-email";
        fetchSentList(apiEndpoint);
        break;
      case "calendar":
        fetchCalendarList(apiEndpoint);
        break;
      default:
        apiEndpoint = "/email/sent";
    }
    console.log("🚀 ~ fetchReservedMailList ~ apiEndpoint:", apiEndpoint);
  };

  const fetchScheduledMails = async (apiEndpoint: string) => {
    const { $axios } = useNuxtApp();

    try {
      const monthlyResponse = await $axios.get(apiEndpoint, {
        headers: {
          // 필요한 경우 여기에 추가 헤더를 설정할 수 있습니다.
        },
      });

      const updatedResults = await Promise.all(
        monthlyResponse.data.result.map(async (result: any) => {
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

      return updatedResults;
    } catch (error: any) {
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

  const getStatusName = (status: string) => {
    switch (status) {
      case "Waiting":
        return "예약 중";
      case "Sent":
        return "보냄";
      case "Cancelled":
        return "취소됨";
      case "Trashed":
        return "삭제됨";
      default:
        return "";
    }
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
    filterConditions,
    paginatedFilteredMailList,
    setFilterConditions,
    changeSearchValue,
    setPage,
    setMailList,
    setTotalResults,
    fetchMailDetail,
    getStatusName,

    //수정관련///
    reservedMailList,
    paginatedFilteredReservedMailList,
    setReservedMailList,
    fetchReservedMailList,
    deleteReservation,
    deleteRows,
  };
});
