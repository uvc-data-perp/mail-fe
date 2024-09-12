<template>
  <el-form :model="form" label-position="top" class="mail-form">
    <el-form-item>
      <el-button-group>
        <el-button type="primary" @click="sendMail">보내기</el-button>
        <el-button @click="scheduleDialogVisible = true">예약</el-button>
        <ScheduleModal
          v-if="scheduleDialogVisible"
          v-model:visible="scheduleDialogVisible"
          :edit-data="scheduleForm"
          @save="saveSchedule"
        />

        <el-button @click="saveDraft">임시저장</el-button>
        <el-button @click="previewMail">미리보기</el-button>
      </el-button-group>
      <el-dropdown style="margin-left: 10px">
        <el-button
          >템플릿<el-icon class="el-icon--right"><arrow-down /></el-icon
        ></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="useTemplate">템플릿</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-form-item>

    <el-form-item label="받는사람">
      <el-input
        v-model="inputValue"
        placeholder=""
        @keydown.space.prevent="addTag"
        @keydown.delete="handleDelete"
      >
        <template #prefix>
          <el-tag
            class="mr-4"
            v-for="tag in tags"
            :key="tag.email"
            closable
            :disable-transitions="false"
            @close="removeTag(tag)"
          >
            {{ tag.email }}
            <el-button size="small" type="primary" @click="editTag(tag)"
              >수정</el-button
            >
          </el-tag>
        </template>
      </el-input>
    </el-form-item>

    <!-- <el-form-item label="참조">
      <el-input v-model="form.cc" placeholder="참조 이메일" />
    </el-form-item> -->

    <el-form-item label="제목">
      <el-input v-model="form.subject" placeholder="제목">
        <template #append>
          <el-checkbox v-model="form.important" label="중요!" />
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="파일첨부">
      <el-upload
        action="#"
        multiple
        :auto-upload="false"
        :on-change="handleFileChange"
      >
        <template #trigger>
          <el-button type="primary">파일 선택</el-button>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-input
        v-model="form.content"
        type="textarea"
        :rows="10"
        placeholder="내용을 입력하세요"
        @input="handleInput"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm">보내기</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

//수신주소 관련
const submitForm = () => {
  tags.value.forEach((tag) => {
    const a = { ...form, to: tag.email, ...scheduleForm.value };
    console.log(a);
  });
};

const inputValue = ref("");
const tags = ref([]);
const addTag = () => {
  const value = inputValue.value.trim();
  if (value) {
    tags.value.push({ email: value });
    inputValue.value = "";
  }
};

const removeTag = (tag) => {
  tags.value.splice(tags.value.indexOf(tag), 1);
};

const editTag = (tag) => {
  // 태그 수정 로직 구현
  console.log("Edit tag:", tag);
};

const handleDelete = (event) => {
  if (inputValue.value === "" && tags.value.length) {
    removeTag(tags.value[tags.value.length - 1]);
  }
};

const handleInput = (value) => {
  let newValue = value;

  if (newValue.includes("$안녕")) {
    newValue = newValue.replace("$안녕", "hello");
    ElMessage("hello world111111로 수정적용되었습니다.");
  } else if (newValue === "$잘가") {
    newValue = "hello world2";
  }

  if (newValue !== value) {
    form.content = newValue;
  }
};

const form = reactive({
  recipient: "",
  subject: "",
  content: "",
  // attachments: [],
});

const scheduleForm = ref({});

const processRecipientInput = () => {
  const input = form.recipient.trim();
  if (input) {
    // 여기에서 입력된 이메일 주소를 처리하는 로직 구현
    console.log("처리할 이메일:", input);
    // 예: 이메일 유효성 검사, 자동 완성 기능 등

    // 처리 후 입력 필드 초기화
    form.recipient = "";
  }
};

const sendMail = () => {
  ElMessage.success("메일을 보냈습니다.");
};

const scheduleDialogVisible = ref(false);

const saveSchedule = (updatedData) => {
  scheduleForm.value = updatedData;
  ElMessage.success("예약설정이 되었습니다.");

  scheduleDialogVisible.value = false;
};

const scheduleMail = () => {
  ElMessage.info("메일 예약 기능은 아직 구현되지 않았습니다.");
};

const saveDraft = () => {
  ElMessage.success("임시저장 되었습니다.");
};

const previewMail = () => {
  ElMessage.info("미리보기 기능은 아직 구현되지 않았습니다.");
};

const useTemplate = () => {
  ElMessage.info("템플릿 기능은 아직 구현되지 않았습니다.");
};

const togglePersonalMode = () => {
  ElMessage.info("개인별 모드 전환");
};

// const handleFileChange = (file, fileList) => {
//   form.attachments = fileList;
// };
</script>

<style scoped>
.mail-form {
  padding: 20px;
}
</style>
