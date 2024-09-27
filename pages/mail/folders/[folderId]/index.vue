<template>
  <div class="mx-4 px-8 py-4 border-b border-t bg-blue-300 flex">
    <MailTopButtons @deleteRows="store.deleteRows(selectedRows)" />

    <div class="">
      <el-input
        v-model="store.filterCondition"
        style="max-width: 600px"
        placeholder="Please input"
        class="input-with-select"
      >
      </el-input>
    </div>
  </div>

  <div class="flex mail-list px-8 w-[100%]">
    <TableMailList
      v-model="selectedRows"
      :mails="
        route.params.folderId == '1' ||
        route.params.folderId == '4' ||
        route.params.folderId == '5'
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
const selectedRows = ref([]);

await useAsyncData("fetchReservedMailList", async () => {
  await store.fetchReservedMailList(route.params.folderId as string);
  return null;
});
</script>

<style lang="scss" scoped></style>
