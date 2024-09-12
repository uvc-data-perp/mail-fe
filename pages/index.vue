<template>
  <div class="page">
    <main>
      <h2 class="">본문 제목</h2>
      <p class="description">
        여기에 본문 내용이 들어갑니다. 이 부분은 웹 페이지의 주요 콘텐츠를
        포함합니다.
      </p>
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
  width: calc(100% - 96px);
  padding: 48px;
  gap: 24px;
}
</style>
