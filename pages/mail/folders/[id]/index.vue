<template>
  <div class="px-8 py-4 border-b border-t bg-gray-200 flex">
    <MailTopButtons />
  </div>

  <div class="flex mail-list px-8 w-[100%]">
    <TableMailList :mails="store.articleList" />
  </div>

  <!-- <PaginationMailList v-model:currentPage="currentPage" /> -->
  <PaginationMailList
    :currentPage="store.currentPage"
    :totalResults="store.totalResults"
    @update:currentPage="store.setPage"
  />
</template>

<script lang="tsx" setup>
import { usePageTitle } from "~/composables/usePageTitle";
import { useStore } from "~/stores/api";

const { setPageTitle } = usePageTitle();
const route = useRoute();

const store = useStore();
await useAsyncData("getNews", () => store.fetchArticles());

// 초기 설정
onMounted(() => {
  updatePageTitle();
});

// 라우트 변경 감지
watch(() => route.path, updatePageTitle);
function updatePageTitle() {
  // 라우트에 따라 페이지 제목 설정
  switch (route.path) {
    case "/mail/folders/1":
      setPageTitle("보낸 메일함");
      break;
    case "/mail/folders/2":
      setPageTitle("예약 메일함");
      break;
    case "/mail/folders/3":
      setPageTitle("내게 쓴 메일함");
      break;
    case "/mail/folders/4":
      setPageTitle("임시저장 메일함");
      break;
    case "/mail/folders/5":
      setPageTitle("휴지통");
      break;

    // 다른 경로에 대한 케이스 추가
    default:
      setPageTitle("메일 시스템");
  }
}

const detailedText = `Velit sed aspernatur tempora. Natus consequatur officiis dicta vel assumenda.
Itaque est temporibus minus quis. Ipsum commodiab porro vel voluptas illum.
Qui quam nulla et dolore autem itaque est.
Id consequatur ipsum ea fuga et odit eligendi impedit.
Maiores officiis occaecati et magnam et sapiente est velit sunt.
Non et tempore temporibus. Excepturi et quos. Minus distinctio aut.
Voluptatem ea excepturi omnis vel. Non aperiam sit sed laboriosam eaque omnis deleniti.
Est molestiae omnis non et nulla repudiandae fuga sit.`;

const columns = [
  { type: "selection", width: 55, key: "selection" },
  { key: "column-0", dataKey: "icons", title: "icons", width: "200" },
  { key: "column-1", dataKey: "to", title: "recipient", width: "200" },
  { key: "column-2", dataKey: "title", title: "title", minWidth: "800" },
  { key: "column-3", dataKey: "dateSent", title: "dateSent", width: "400" },
];

const sentMailList = [
  {
    to: "김민준",
    title: "제목",
    dateSent: "2022. 01. 01 19:19",
    content: "본문내용....",
  },
];

const data = ref(
  sentMailList.map((item, index) => ({
    ...item,
    id: `row-${index}`,
    parentId: null,
    children: [
      {
        id: `row-${index}-detail-content`,
        detail: item.content,
      },
    ],
  }))
);

const Row = ({ cells, rowData }) => {
  if (rowData.detail) return <div class="p-6">{rowData.detail}</div>;
  return cells;
};

Row.inheritAttrs = false;

//페이지네이션 관련//
</script>

<style lang="scss" scoped></style>
