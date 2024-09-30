<template>
  <div class="flex h-screen overflow-hidden">
    <SidebarLayout class="w-64 flex-shrink-0" />

    <div class="flex-grow overflow-hidden flex flex-col">
      <header class="h-16 border-b flex items-center px-8 cursor-pointer">
        <NuxtLink :to="routeInfo.path">
          <el-button :icon="ArrowLeft" role="link"> </el-button>
        </NuxtLink>
        <h1 :icon="ArrowLeft" class="text-2xl font-semibold">
          {{ pageTitle }}
        </h1>
        <a href="/" class="mb-3 mt-2"></a>
      </header>
      <MailHeader />

      <main class="flex-grow overflow-auto p-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "@element-plus/icons-vue";
import SidebarLayout from "~/components/SidebarLayout.vue";

import { usePageTitle } from "~/composables/usePageTitle";

const route = useRoute();

const routeInfo = computed(() => {
  if (route.params.folderId) {
    return {
      path: "/mail/folders/" + route.params.folderId,
    };
  }
  return {
    path: route.path,
  };
});

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
        setPageTitle(" 월간 요약");
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
