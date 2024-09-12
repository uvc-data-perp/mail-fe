<template>
  <el-upload
    @click="checkIsUploaded"
    class="upload-demo"
    drag
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    multiple
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";

// emit 함수 정의
const emit = defineEmits(["emitIsUploaded"]);

const checkIsUploaded = () => {
  // 'equipSelected' 이벤트를 발생시키고 equip 객체를 전달
  emit("emitIsUploaded", true);
};
</script>
