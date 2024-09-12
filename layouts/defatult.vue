<template>
  <div class="app-layout overflow-hidden">
    <SidebarLayout />
    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// import SidebarLayout from "~/components/SidebarLayout.vue";
</script>

<style scoped>
.app-layout {
  display: flex;
}
.main-content {
  flex-grow: 1;
}
</style>
