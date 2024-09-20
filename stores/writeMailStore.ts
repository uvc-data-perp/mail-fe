import { defineStore } from "pinia";
import axios from "axios";
import type { MailMessage, MailContents } from "~/types/writeMailStore";

export const useWriteMailStore = defineStore("writeMail", () => {
  // State

  const mailMessage = ref<MailMessage>({
    contents: {
      from: "pinia@gmail.com",
      to: "pinia@gmail.com",
      subject: "p Sub ✔",
      text: "p text ?",
      html: "<b>p html</b>",
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
  // selectedTags: string[]
  const sendMailTest = async () => {
    const results = [];
    let apiEndpoint = `/send/once`;
    switch (mailMessage.value.contents.periodType) {
      case "no":
        apiEndpoint = `/send/once`;
        break;
      case "single":
        apiEndpoint = `/send/booking`;
        break;
    }

    for (const toEmail of mailMessage.value.contents.selectedTags) {
      console.log(`Sending email to: ${toEmail}`);
      mailMessage.value.contents.to = toEmail;

      try {
        const response = await axiosInstance.post(
          apiEndpoint,
          mailMessage.value
        );
        console.log(`Email sent successfully to ${toEmail}:`, response.data);
        results.push({
          email: toEmail,
          success: true,
          response: response.data,
        });
      } catch (error) {
        console.error(`Error sending email to ${toEmail}:`, error);
        results.push({ email: toEmail, success: false, error });
      }
    }

    return results;
  };

  const reserveEmailTest = async () => {
    const results = [];

    for (const toEmail of mailMessage.value.contents.selectedTags) {
      console.log(`Sending email to: ${toEmail}`);
      mailMessage.value.contents.to = toEmail;

      try {
        const response = await axiosInstance.post(
          "/send/booking",
          mailMessage.value
        );
        console.log(`Email sent successfully to ${toEmail}:`, response.data);
        results.push({
          email: toEmail,
          success: true,
          response: response.data,
        });
      } catch (error) {
        console.error(`Error sending email to ${toEmail}:`, error);
        results.push({ email: toEmail, success: false, error });
      }
    }

    return results;
  };

  // const reserveEmailTest = async () => {
  //   // const mailContent = {
  //   //   contents: {
  //   //     from: "jjoo08152@gmail.com",
  //   //     to: "jjoo0815@gmail.com",
  //   //     subject: "Hello ✔",
  //   //     text: "Hello Jisang?",
  //   //     html: "<b>안녕하세요 김신영2입니다 반갑습니다!!</b>",

  //   //     reserved_timestamp: "9726709750",
  //   //   },
  //   // };

  //   try {
  //     console.log(mailMessage.value);
  //     const response = await axiosInstance.post(
  //       "/send/booking",
  //       mailMessage.value
  //     );
  //     console.log("스토어예약 Email sent successfully:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     if (error.response) {
  //       // 서버가 2xx 범위를 벗어난 상태 코드로 응답한 경우
  //       console.error("Server responded with an error:", error.response.data);
  //       console.error("Status code:", error.response.status);
  //     } else if (error.request) {
  //       // 요청이 전송되었지만 응답을 받지 못한 경우
  //       console.error("No response received:", error.request);
  //     } else {
  //       // 요청 설정 중 오류가 발생한 경우
  //       console.error("Error setting up the request:", error.message);
  //     }
  //     throw error;
  //   }
  // };

  return {
    mailMessage,

    sendMailTest,
    reserveEmailTest,
  };
});
