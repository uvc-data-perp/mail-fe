<template>
  <div flex justify-center>
    <el-pagination
      v-model:current-page="currentPageValue"
      :page-size="pageSize"
      :pager-count="pagerCount"
      layout="prev, pager, next"
      :total="totalResults"
    />

    {{ currentPageValue }},
    {{ props.totalResults }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalResults: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  pagerCount: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["update:currentPage"]);

const currentPageValue = computed({
  get: () => props.currentPage,
  set: (value) => emit("update:currentPage", value),
});
</script>
