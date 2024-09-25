<template>
  <div class="flex h-screen overflow-hidden">
    <SidebarLayout class="w-64 flex-shrink-0" />

    <div class="flex-grow overflow-hidden flex flex-col">
      <header class="h-16 border-b flex items-center px-8 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="m15 4l2 2l-6 6l6 6l-2 2l-8-8z"
          />
        </svg>
        <h1 class="text-xl font-semibold">{{ pageTitle }}</h1>
      </header>
      <MailHeader />

      <main class="flex-grow overflow-auto p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarLayout from "~/components/SidebarLayout.vue";

import { usePageTitle } from "~/composables/usePageTitle";

const route = useRoute();

const { pageTitle, setPageTitle } = usePageTitle();

function updatePageTitle() {
  if (route.path === "/mail/write") {
    if (route.query.type === "toMe") {
      setPageTitle("내게 쓰기");
    } else {
      setPageTitle("메일 쓰기");
    }
  } else if (route.path.startsWith("/mail/")) {
    switch (route.params.folderId) {
      case "1":
        setPageTitle("보낸 메일함");
        break;
      case "2":
        setPageTitle("예약 메일함");
        break;
      case "3":
        setPageTitle("요일 별 예약");
        break;
      case "4":
        setPageTitle("일회성 예약");
        break;
      case "5":
        setPageTitle("휴지통");
        break;
      default:
        setPageTitle("메일 시스템");
    }
  }
}

watch(
  [() => route.path, () => route.query, () => route.params],
  () => {
    updatePageTitle();
  },
  { immediate: true }
);
</script>

<style scoped>
/* 추가적인 스타일이 필요한 경우 여기에 작성 */
</style>
