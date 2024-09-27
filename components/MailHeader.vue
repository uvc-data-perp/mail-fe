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
