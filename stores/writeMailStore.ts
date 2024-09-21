import { defineStore } from "pinia";
import axios from "axios";

import type { MailMessage, MailContents } from "~/types/writeMailStore";

export const useWriteMailStore = defineStore("writeMail", () => {
  // State

  const mailMessage = ref<MailMessage>({
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
    }

    for (const toEmail of mailMessage.value.contents.selectedTags) {
      console.log(`Sending email to: ${toEmail}`);
      mailMessage.value.contents.to = toEmail;

      try {
        const response = await $axios.post(apiEndpoint, mailMessage.value, {
          timeout: 100000,
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
