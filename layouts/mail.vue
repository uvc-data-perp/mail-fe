<template>
  <div class="flex h-screen overflow-hidden">
    <SidebarLayout class="w-64 flex-shrink-0" />

    <div class="flex-grow overflow-hidden flex flex-col">
      <header class="h-16 bg-white border-b flex items-center px-8">
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

const pageTitle = ref("받은 메일함");
</script>

<style scoped>
/* 추가적인 스타일이 필요한 경우 여기에 작성 */
</style>
