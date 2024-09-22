import { defineStore } from "pinia";
import axios from "axios";

import type { MailMessage, MailContents } from "~/types/writeMailStore";

export const useWriteMailStore = defineStore("writeMail", () => {
  const route = useRoute();
  // State

  const mailMessage = ref<MailMessage>({
    contents: {
      from: "jjoo08152@gmail.com",
      to: "",
      subject: "기본 제목",
      text: "기본 내용",
      html: "<b>p html</b>",
      periodType: "no",
      reservedDate: new Date(),
      reservedTimestamp: "0",
      selectedTags: [],
      expiredTimestamp: "",
      sendTime: "",
      days: [],
    },
  });
  const computedTimestamp = computed(() =>
    String(Math.floor(mailMessage.value.contents.reservedDate.getTime() / 1000))
  );

  watch(
    () => mailMessage.value.contents.reservedDate,
    (newDate) => {
      mailMessage.value.contents.reservedTimestamp = String(
        Math.floor(newDate.getTime() / 1000)
      );
    }
  );

  // reservedTimestamp를 업데이트하는 함수
  function updateReservedTimestamp() {
    mailMessage.value.contents.reservedTimestamp = computedTimestamp.value;
  }

  // Actions
  // Mutations => State를 변경할 목적으로 작성된 코드

  async function submitForm(mailFormRef: any) {
    if (!mailFormRef) return;

    try {
      const valid = await mailFormRef.validate();
      if (!valid) {
        ElMessage.error("폼 유효성 검사에 실패했습니다. 입력을 확인해주세요.");
        return;
      }

      const result = await processMailSending();
      handleMailSendingResult(result);
    } catch (error) {
      console.error("Form submission error:", error);
      ElMessage.error("폼 제출 중 오류가 발생했습니다.");
    }
  }

  async function processMailSending() {
    const { periodType } = mailMessage.value.contents;

    switch (periodType) {
      case "no":
        return {
          success: true,
          message: "메일이 성공적으로 발송되었습니다.",
          data: await sendMailTest(),
        };
      case "single":
        const result = await sendMailTest();
        return {
          success: true,
          message: "메일이 성공적으로 예약되었습니다.",
          data: result,
        };
      case "weekly":
        //만료시간 설정//
        mailMessage.value.contents.expiredTimestamp = String(
          Math.floor(
            new Date(mailMessage.value.contents.expiredTimestamp).setHours(
              23,
              59,
              59,
              999
            ) / 1000
          )
        );
        console.log(
          "expiredTimestamp:",
          mailMessage.value.contents.expiredTimestamp
        );

        //sendTime 설정//
        mailMessage.value.contents.sendTime = `${mailMessage.value.contents.reservedDate.getHours()}:${mailMessage.value.contents.reservedDate.getMinutes()}`;
        console.log("sendTime:", mailMessage.value.contents.sendTime);

        //요일 값 boolean 변경//
        mailMessage.value.contents["days"] = [0, 1, 2, 3, 4, 5, 6].map((day) =>
          mailMessage.value.contents.days.includes(day)
        );
        console.log(mailMessage.value.contents.days);

        // mailMessage.value.contents["expiredTimestamp"] = Math.floor(
        //   mailMessage.value.contents.expiredTimestamp.getTime() / 1000
        // );
        return {
          success: true,
          message: "메일이 성공적으로 발송되었습니다.",
          data: await sendMailTest(),
        };

      case "monthly":
        //만료시간 설정//
        mailMessage.value.contents.expiredTimestamp = String(
          Math.floor(
            new Date(mailMessage.value.contents.expiredTimestamp).setHours(
              23,
              59,
              59,
              999
            ) / 1000
          )
        );
        console.log(
          "expiredTimestamp:",
          mailMessage.value.contents.expiredTimestamp
        );

        //sendTime 설정//
        mailMessage.value.contents.sendTime = `${mailMessage.value.contents.reservedDate.getHours()}:${mailMessage.value.contents.reservedDate.getMinutes()}`;
        console.log("sendTime:", mailMessage.value.contents.sendTime);

        // mailMessage.value.contents["expiredTimestamp"] = Math.floor(
        //   mailMessage.value.contents.expiredTimestamp.getTime() / 1000
        // );
        return {
          success: true,
          message: "메일이 성공적으로 발송되었습니다.",
          data: await sendMailTest(),
        };

      // 여기에 추가적인 case들을 넣을 수 있습니다.
      default:
        return { success: false, message: "지원하지 않는 전송 유형입니다." };
    }
  }

  const sendMailTest = async () => {
    const { $axios } = useNuxtApp();

    const results = [];
    let apiEndpoint = `/send/once`;
    switch (mailMessage.value.contents.periodType) {
      case "no":
        apiEndpoint = `/send/once`;
        break;
      case "single":
        apiEndpoint = `/send/booking`;
        break;
      case "weekly":
        apiEndpoint = `/send/booking/regularity/day`;
        break;
      case "monthly":
        apiEndpoint = `/send/booking/regularity/month`;
        break;
    }

    if (route.query.type === "toMe") {
      mailMessage.value.contents.selectedTags = [];
      mailMessage.value.contents.to = "";
      // mailMessage.value.contents.selectedTags.push("shyk31971@gmail.com");
      mailMessage.value.contents.selectedTags = ["shyk31971@gmail.com"];
    }

    for (const toEmail of mailMessage.value.contents.selectedTags) {
      console.log(`Sending email to: ${toEmail}`);
      mailMessage.value.contents.to = toEmail;

      try {
        // const postman = {
        //   contents: {
        //     from: "jjoo08152@gmail.com",
        //     to: "jjoo08152@gmail.com",
        //     subject: "Hello ✔",
        //     text: "Hello Jisang?",
        //     html: "<b>반갑</b>",

        //     expired_timestamp: "1735632060",
        //     sendTime: "3:47",
        //     //       MON.  TUES, ....
        //     days: [true, true, true, true, true, true, true],
        //   },
        // };
        const response = await $axios.post(apiEndpoint, mailMessage.value, {
          timeout: 50000,
        });
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

  function handleMailSendingResult(result: any) {
    if (result.success) {
      if (Array.isArray(result.data)) {
        const successCount = result.data.filter((r) => r.success).length;
        const failCount = result.data.length - successCount;
        if (failCount === 0) {
          ElMessage.success(
            `${successCount}개의 메일이 성공적으로 전송되었습니다.`
          );
        } else {
          ElMessage.warning(
            `${successCount}개의 메일 전송 성공, ${failCount}개의 메일 전송 실패.`
          );
        }
      } else {
        ElMessage.success(
          result.message || "메일이 성공적으로 처리되었습니다."
        );
      }
    } else {
      ElMessage.error(result.message || "메일 처리 중 오류가 발생했습니다.");
    }
    resetMailmessage(mailMessage.value);
  }

  function resetMailmessage(mailMessage) {
    mailMessage = {
      contents: {
        from: "jjoo08152@gmail.com",
        to: "jjoo08152@gmail.com",
        subject: "p Sub ✔",
        text: "p text ?",
        html: "<b>p html</b>",
        periodType: "no",
        reservedDate: new Date(),
        reservedTimestamp: "0",
        selectedTags: [],
        expiredTimestamp: "",
        sendTime: "",
        days: [],
      },
    };
  }

  return {
    mailMessage,
    computedTimestamp,
    updateReservedTimestamp,
    submitForm,
    processMailSending,
    sendMailTest,
    handleMailSendingResult,
  };
});
