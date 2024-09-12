<template>
  <aside class="w-64 h-full bg-white border-r flex flex-col">
    <div class="p-4">
      <h1 class="text-2xl font-bold text-green-500">메일</h1>
    </div>
    <div class="flex space-x-2 p-4">
      <button class="bg-green-500 text-white px-4 py-2 rounded flex-grow">
        메일 쓰기
      </button>
      <button class="border px-4 py-2 rounded flex-grow">내게 쓰기</button>
    </div>
    <div class="flex space-x-4 px-4 py-2">
      <span class="text-sm">999+</span>
      <span class="text-sm">⭐</span>
      <span class="text-sm">📎</span>
      <span class="text-sm">TO</span>
    </div>
    <nav class="flex-grow overflow-y-auto">
      <ul class="space-y-1">
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
        >
          <span class="mr-2">📥</span> 전체메일
        </li>
        <li
          class="px-4 py-2 bg-blue-100 text-blue-600 cursor-pointer flex items-center"
        >
          <span class="mr-2">📥</span> 받은메일함 999+
        </li>
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
        >
          <span class="mr-2">📤</span> 보낸메일함
        </li>
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
        >
          <span class="mr-2">📝</span> 임시보관함
        </li>
        <li
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
        >
          <span class="mr-2">📁</span> 내게쓴메일함 15
        </li>
        <!-- 기타 메일함 항목들... -->
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// 필요한 경우 여기에 로직 추가
</script>
