import { defineStore } from "pinia";
import axios from "axios";
import type { MailMessage, MailContents } from "~/types/writeMailStore";

export const useWriteMailStore = defineStore("writeMail", () => {
  // State

  const mailMessage = ref<MailMessage>({
    contents: {
      from: "a@gmail.com",
      to: "a@gmail.com",
      subject: "Hello ✔",
      text: "Hello ?",
      html: "<b>ㅋㅋㅋㅋㅋㅋㅋㅋ</b>",
    },
  });
  // Actions
  // Mutations => State를 변경할 목적으로 작성된 코드

  const axiosInstance = axios.create({
    baseURL: "http://158.247.200.126:3001",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const sendMailTest = async () => {
    // const mailContent = {
    //   contents: {
    //     from: "a@gmail.com",
    //     to: "a@gmail.com",
    //     subject: "Hello ✔",
    //     text: "Hello ?",
    //     html: "<b>ㅋㅋㅋㅋㅋㅋㅋㅋ</b>",
    //   },
    // };

    try {
      console.log(mailMessage.value);
      console.log(mailMessage.value);
      console.log(mailMessage.value);
      console.log(mailMessage.value);
      console.log(mailMessage.value);
      console.log(mailMessage.value);

      const response = await axiosInstance.post(
        "/send/once",
        mailMessage.value
      );
      console.log("스토어 Email sent successfully:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버가 2xx 범위를 벗어난 상태 코드로 응답한 경우
        console.error("Server responded with an error:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        // 요청이 전송되었지만 응답을 받지 못한 경우
        console.error("No response received:", error.request);
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error("Error setting up the request:", error.message);
      }
      throw error;
    }
  };

  const reserveEmailTest = async () => {
    // const mailContent = {
    //   contents: {
    //     from: "jjoo08152@gmail.com",
    //     to: "jjoo0815@gmail.com",
    //     subject: "Hello ✔",
    //     text: "Hello Jisang?",
    //     html: "<b>안녕하세요 김신영2입니다 반갑습니다!!</b>",

    //     reserved_timestamp: "9726709750",
    //   },
    // };

    try {
      const response = await axiosInstance.post("/send/booking", mailMessage);
      console.log("스토어예약 Email sent successfully:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버가 2xx 범위를 벗어난 상태 코드로 응답한 경우
        console.error("Server responded with an error:", error.response.data);
        console.error("Status code:", error.response.status);
      } else if (error.request) {
        // 요청이 전송되었지만 응답을 받지 못한 경우
        console.error("No response received:", error.request);
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error("Error setting up the request:", error.message);
      }
      throw error;
    }
  };

  return {
    mailMessage,

    sendMailTest,
    reserveEmailTest,
  };
});
