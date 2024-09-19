<template>
  <div
    class="email-list-header el-row el-row--flex is-justify-space-between mx-8 my-4"
  >
    <div>
      <el-button type="primary" @click="navigateToWrite"> 메일 쓰기 </el-button>
      <el-button type="primary" @click="navigateToWriteToMe">
        내게 쓰기
      </el-button>
      <el-button type="primary" @click="handleSnippet"> 단축어 </el-button>
      <SnippetModal
        v-if="snippetDialogVisible"
        v-model:visible="snippetDialogVisible"
      />
    </div>
    <div class="mt-4">
      <el-input
        v-model="searchData"
        style="max-width: 600px"
        placeholder="Please input"
        class="input-with-select"
      >
        <template #prepend>
          <div class="flex justify-center">
            <el-button
              type="primary"
              @click="visibleSearch = !visibleSearch"
              class="top-0 left-0 z-10 flex justify-center items-center text-center"
            >
              <div
                v-if="visibleSearch"
                class="i-ic:round-open-in-new w-1em h-1em"
              ></div>
              <div
                v-if="!visibleSearch"
                class="i-ic:round-close w-1em h-1em"
              ></div>
            </el-button>
          </div>
        </template>
        <template #append>
          <el-button type="primary"> 검색 </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
const snippetDialogVisible = ref(false);

const visibleSearch = ref(false);

const searchData = ref("");

const route = useRoute();

interface snippet {
  id: number;
  before: string;
  after: string;
}

const navigateToWrite = () => {
  navigateTo({ path: "/mail/write" });
};

const navigateToWriteToMe = () => {
  navigateTo({
    // name: "mail-Write",
    path: "/mail/write",
    query: {
      type: "toMe",
    },
  });
};

const handleSnippet = () => {
  snippetDialogVisible.value = !snippetDialogVisible.value;
};
// console.log(router.getRoutes());
</script>

<style scoped></style>
