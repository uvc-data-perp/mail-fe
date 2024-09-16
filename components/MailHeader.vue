<template>
  <div
    class="email-list-header el-row el-row--flex is-justify-space-between mx-8 my-4"
  >
    <div>
      <el-button type="primary" @click="navigateToWrite"> 메일 쓰기 </el-button>
      <el-button type="primary" @click="navigateToWriteToMe">
        내게 쓰기
      </el-button>
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
              @click="visible = !visible"
              class="top-0 left-0 z-10 flex justify-center items-center text-center"
            >
              <div
                v-if="visible"
                class="i-ic:round-open-in-new w-1em h-1em"
              ></div>
              <div
                v-if="!visible"
                class="i-ic:round-open-in-new w-1em h-1em"
              ></div>
            </el-button>
          </div>

          <!-- <transition name="slide-fade">
            <div
              v-show="visible"
              class="absolute top-10 right-10 bg-white shadow-md p-4 rounded-b-md z-10"
            >
              <el-form label-position="top">
                <el-form-item v-if="writeType !== 'toMe'" label="받는 사람">
                  <el-input v-model="receiver" placeholder="이메일 주소" />
                </el-form-item>
                <el-form-item label="제목">
                  <el-input v-model="subject" placeholder="제목" />
                </el-form-item>
              </el-form>
            </div>
          </transition> -->
        </template>
        <template #append>
          <el-button type="primary"> 검색 </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
const visible = ref(true);
const editForm = ref({});
const editIndex = ref(-1);
const receiver = ref("");
const subject = ref("");
const searchData = ref("");
const tableData = ref([]);

const route = useRoute();
const writeType = computed(() => route.query.type);

const navigateToWrite = () => {
  navigateTo({ name: "mail-Write" });
};

const navigateToWriteToMe = () => {
  navigateTo({
    // name: "mail-Write",
    path: "/mail/Write",
    query: {
      type: "toMe",
    },
  });
};

const router = useRouter();
// console.log(router.getRoutes());

const saveEdit = (updatedData) => {
  if (editIndex.value === -1) {
    // 새 항목 생성
    tableData.value.push({ ...updatedData });
  } else if (editIndex.value > -1) {
    // 기존 항목 수정
    tableData.value[editIndex.value] = { ...updatedData };
  }
  editDialogVisible.value = false;
};
</script>

<style scoped></style>
