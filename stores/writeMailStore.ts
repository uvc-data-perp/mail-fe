import { defineStore } from "pinia";
import axios from "axios";

import type { MailMessage, MailContents } from "~/types/writeMailStore";

export const useWriteMailStore = defineStore("writeMail", () => {
  const route = useRoute();
  // State

  const mailMessage = ref<MailMessage>({
    contents: {
      from: "defatult@groundkim.com",
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
  console.log("🚀 ~ submitForm ~ mailMessage.value:", mailMessage.value);

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

        console.log("변경전:", mailMessage.value.contents.expiredTimestamp);

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
        console.log("변경후:", mailMessage.value.contents.expiredTimestamp);

        console.log(
          "expiredTimestamp:",
          mailMessage.value.contents.expiredTimestamp
        );

        //sendTime 설정//
        // mailMessage.value.contents.sendTime = `${mailMessage.value.contents.reservedDate.getHours()}:${mailMessage.value.contents.reservedDate.getMinutes()}`;
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
        // mailMessage.value.contents.sendTime = `${mailMessage.value.contents.reservedDate.getHours()}:${mailMessage.value.contents.reservedDate.getMinutes()}`;
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
    console.log("before text:", mailMessage.value.contents.text);
    mailMessage.value.contents.text = removeHTMLStructure(
      mailMessage.value.contents.text
    );
    console.log("aftertext:", mailMessage.value.contents.text);

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
    resetMailMessage();
  }
  function removeHTMLStructure(input: string) {
    // 백틱, 스타일 태그, 스크립트 태그 제거
    input = input.replace(
      /`|<style[^>]*>[\s\S]*?<\/style>|<script[^>]*>[\s\S]*?<\/script>/gi,
      ""
    );

    // HTML 태그 제거
    input = input.replace(/<[^>]+>/g, "");

    // HTML 엔티티 디코딩
    input = input
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");

    // 연속된 공백 및 줄바꿈 정리
    input = input.replace(/\s+/g, " ").trim();

    return input;
  }

  function resetMailMessage() {
    mailMessage.value = {
      contents: {
        from: "shyk31971@groundkim.com",
        to: "jjoo08152@gmail.com",
        subject: "",
        text: "",
        html: "<b></b>",
        periodType: "no",
        reservedDate: new Date(),
        reservedTimestamp: "0",
        selectedTags: [],
        expiredTimestamp: "",
        sendTime: "",
        days: [],
      },
    };
    mailMessage.value.contents.text = " ";
    mailMessage.value.contents.html = " ";
  }

  return {
    mailMessage,
    computedTimestamp,
    updateReservedTimestamp,
    submitForm,
    processMailSending,
    sendMailTest,
    handleMailSendingResult,
    resetMailMessage,
  };
});
