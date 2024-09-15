<template>
  <div flex justify-center>
    <el-pagination
      v-model:current-page="currentPageValue"
      :page-size="2"
      :pager-count="11"
      layout="prev, pager, next"
      :total="1000"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["update:currentPage"]);

const currentPageValue = computed({
  get: () => props.currentPage,
  set: (value) => emit("update:currentPage", value),
});

// const onPageChange = (page) => {
//   console.log("Page changed to:", page);
// };
// <-- @current-change="onPageChange" -->
</script>
