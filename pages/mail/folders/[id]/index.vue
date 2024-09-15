<template>
  <div class="px-8 py-4 border-b border-t bg-gray-200 flex">
    <MailTopButtons />
  </div>

  <div class="flex mail-list px-8 w-[100%]">
    <!-- 이메일 목록 아이템들 -->

    <!-- <el-table-v2
      :columns="columns"
      :data="data"
      :estimated-row-height="50"
      :expand-column-key="columns[2].key"
      :width="Number(`calc(100vw - 300px)`)"
      :height="400"
    >
      <template #row="props">
        <Row v-bind="props" />
      </template>
    </el-table-v2> -->
    <TableMailList />
  </div>

  <PaginationMailList v-model:currentPage="currentPage" />
</template>

<script lang="tsx" setup>
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
const currentPage = ref(1);
</script>

<style lang="scss" scoped></style>
