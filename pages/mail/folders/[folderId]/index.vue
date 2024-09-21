<template>
  <div class="px-8 py-4 border-b border-t bg-gray-200 flex">
    <MailTopButtons />
  </div>

  <!-- <div class="flex mail-list px-8 w-[100%]">
    <TableMailList :mails="store.articleList" mode="full" />
  </div> -->
  <div class="flex mail-list px-8 w-[100%]">
    <TableMailList2 :mails="store.mailList" mode="full" />
  </div>

  <!-- <PaginationMailList v-model:currentPage="currentPage" /> -->
  <PaginationMailList
    :currentPage="store.currentPage"
    :totalResults="store.totalResults"
    @update:currentPage="store.setPage"
  />
  {{ store.mailList }}
</template>

<script lang="tsx" setup>
import { usePageTitle } from "~/composables/usePageTitle";
import { useStore } from "~/stores/api";

const { setPageTitle } = usePageTitle();
const route = useRoute();

const store = useStore();
await useAsyncData("getWillSendList", async () => {
  await store.fetchWillSendList();
  return store.articleList;
});

await useAsyncData("getNews", async () => {
  await store.fetchArticles();
  return store.articleList;
});

// 초기 설정

const Row = ({ cells, rowData }) => {
  if (rowData.detail) return <div class="p-6">{rowData.detail}</div>;
  return cells;
};

Row.inheritAttrs = false;

//페이지네이션 관련//
</script>

<style lang="scss" scoped></style>
