<template>
  <Calendar :mailData="mailStore.mailList"></Calendar>
</template>

<script lang="ts" setup>
import { data } from "autoprefixer";
import { useStore } from "~/stores/readMailStore";

const route = useRoute();

const mailStore = useStore();
await useAsyncData("fetchReservedMailList", async () => {
  await mailStore.fetchReservedMailList("calendar" as string);
  return null;
});
</script>

<style lang="scss" scoped></style>
