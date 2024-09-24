<template>
  <div class="px-8 py-4 border-b border-t bg-gray-200 flex">
    <MailTopButtons />
    <div class="flex wp-10">
      <el-input v-model="store.filterCondition" placeholder="검색"></el-input>
      <el-input v-model="store.filterCondition" placeholder="검색"></el-input>
    </div>
  </div>

  <div class="flex mail-list px-8 w-[100%]">
    <TableMailList
      :mails="
        route.params.folderId == '1'
          ? store.paginatedFilteredMailList
          : store.paginatedFilteredReservedMailList
      "
      mode="full"
    />
  </div>

  <!-- <PaginationMailList v-model:currentPage="currentPage" /> -->
  <PaginationMailList
    :currentPage="store.currentPage"
    :totalResults="store.totalResults"
    :pagerCount="store.pagerCount"
    :pageSize="store.pageSize"
    @update:currentPage="store.setPage"
  />
  <!-- {{ store.paginatedFilteredMailList }} -->
</template>

<script lang="tsx" setup>
import { usePageTitle } from "~/composables/usePageTitle";
import { useStore } from "~/stores/api";

const { setPageTitle } = usePageTitle();
const route = useRoute();

const store = useStore();

await useAsyncData("fetchReservedMailList", async () => {
  await store.fetchReservedMailList(route.params.folderId as string);
  return null;
});

// switch (route.params.folderId) {
//   case "2":
//     await useAsyncData("fetchReservedMailList", async () => {
//       await store.fetchReservedMailList();
//       return null;
//     });
//     break;
//     case "3":
//     await useAsyncData("fetchReservedMailList", async () => {
//       await store.fetchReservedMailList();
//       return null;
//     });
//     break;
//   default:
//     await useAsyncData("getWillSendList", async () => {
//       await store.fetchWillSendList();
//       return null;
//     });
// }

// 초기 설정

const Row = ({ cells, rowData }) => {
  if (rowData.detail) return <div class="p-6">{rowData.detail}</div>;
  return cells;
};

Row.inheritAttrs = false;

//페이지네이션 관련//
</script>

<style lang="scss" scoped></style>
