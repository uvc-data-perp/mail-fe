<template>
  <MailTopButtons />
  <div class="mail-list">
    <!-- 이메일 목록 아이템들 -->
    <div
      v-for="i in 10"
      :key="i"
      class="email-item el-row el-row--flex is-align-items-center p-2 hover:bg-gray-100"
    >
      <el-checkbox class="mr-2" />
      <div class="el-col el-col-16">
        <div class="font-semibold">이메일 제목 {{ i }}</div>
        <div class="text-sm text-gray-600">이메일 내용 미리보기...</div>
      </div>
      <div class="el-col el-col-auto text-sm text-gray-500">날짜</div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
