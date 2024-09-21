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

  function camelToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
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
        const response = await $axios.post(apiEndpoint, mailMessage.value);
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

  return {
    mailMessage,
    computedTimestamp,
    updateReservedTimestamp,
    sendMailTest,
  };
});
