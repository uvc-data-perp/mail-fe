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

    <el-form-item
      v-if="scheduleForm.periodType !== 'no'"
      class="flex gap-4"
      label="예약"
    >
      <div v-if="scheduleForm.startDate" class="mr-4">
        {{
          `최초 전송:  ${scheduleForm.startDate} 
           ${scheduleForm.startTime}
        `
        }}
        <br />
      </div>
      <div v-if="scheduleForm.expiryDate" class="mr-4">
        {{ `만료일:${scheduleForm.expiryDate}` }}
      </div>
      <div v-if="scheduleForm.periodType !== 'no'" class="mr-4">
        주기:
        {{
          scheduleForm.periodType === "weekly"
            ? `${scheduleForm.interval}주`
            : `${scheduleForm.interval}개월`
        }}
        {{
          scheduleForm?.periodType === "weekly"
            ? ` ${getDayNames(scheduleForm.days).join(", ")}요일`
            : ` ${scheduleForm.days?.join(", ")}일`
        }}
      </div>
    </el-form-item>

    <el-form-item v-if="route?.query?.type !== 'toMe'" label="받는사람">
      <el-select
        v-model="form.selectedTags"
        multiple
        filterable
        allow-create
        default-first-option
        remote
        :remote-method="remoteSearch ? remoteSearch : undefined"
        placeholder="받는 사람 추가"
        style="width: 100%"
        @update:modelValue="validateEmails"
      >
        <el-option
          v-for="item in addressOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
        <template #tag>
          <el-tag
            v-for="tag in form.selectedTags"
            :key="tag"
            :type="isValidEmail(tag) ? 'success' : 'danger'"
            closable
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-select>
    </el-form-item>

    <!-- <el-form-item label="참조">
      <el-input v-model="form.cc" placeholder="참조 이메일" />
    </el-form-item> -->

    <el-form-item label="제목">
      <el-input v-model="form.subject" placeholder="제목">
        <!-- <template #append>
          <el-checkbox v-model="form.important" label="중요!" />
        </template> -->
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
        @input="debouncedHandleInput"
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
import { useDebounceFn } from "@vueuse/core";

// 버릴것

const input = ref("");
const convertedInput = ref("");
///

const route = useRoute();

const remoteSearch = async (query) => {
  if (query !== "") {
    loading.value = true;
    try {
      // 서버에서 데이터를 가져오는 API 호출
      const response = await fetchAddressOptions(query);
      addressOptions.value = response.data.map((item) => ({
        value: item.email,
        label: item.email,
      }));
    } catch (error) {
      console.error("Error fetching address options:", error);
      ElMessage.error("주소 옵션을 가져오는 데 실패했습니다.");
    } finally {
      loading.value = false;
    }
  } else {
    addressOptions.value = [];
  }
};

const fetchAddressOptions = async (query) => {
  // 예시: axios를 사용한 API 호출
  // const response = await axios.get(`/api/email-addresses?query=${query}`);
  // return response.data;

  // 임시로 더미 데이터를 반환하는 예시

  if (import.meta.env.SSR) {
    // 서버 사이드 렌더링 시 동기적으로 처리
    return {
      data: [
        { email: `${query}@example.com` },
        { email: `${query}.user@example.com` },
        { email: `another.${query}@example.com` },
      ],
    };
  } else {
    // 클라이언트 사이드에서만 비동기 처리
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { email: `${query}@example.com` },
            { email: `${query}.user@example.com` },
            { email: `another.${query}@example.com` },
          ],
        });
      }, 300);
    });
  }
};

const loading = ref(false);
const addressOptions = ref([]);

// const addressOptions = ref([
//   { value: "example@email.com", label: "example@email.com" },
//   // 필요한 경우 여기에 더 많은 옵션을 추가할 수 있습니다.
// ]);

//submit 시 제출내용 저장
const form = reactive({
  selectedTags: [],
  to: "",
  subject: "",
  content: "",
});
//예약관련 내용 저장
const scheduleForm = ref({ periodType: "no" });

const getDayNames = (days) => {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return days.map((day) => dayNames[day]);
};
//보내기
const submitForm = () => {
  if (route.query.type === "toMe") {
    const a = { ...form, to: "example@email.com", ...scheduleForm.value };
    console.log(a);
  }
  form.selectedTags.forEach((mail) => {
    const a = { ...form, to: mail, ...scheduleForm.value };
    console.log(a);
  });
};

//////////////// 스니펫 시작//
const snippet = { $안녕: "hello", $잘가: "hello", $잘나1: "hello" };

let timeout = null;

const handleInput = (value) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    const textarea = document.querySelector("textarea");
    const originalCursorPosition = textarea.selectionStart;
    let result = value;
    let cursorOffset = 0;

    // 완전한 키워드 매칭 및 변환
    for (const [key, replacement] of Object.entries(snippet)) {
      const regex = new RegExp("\\" + key, "g");
      result = result.replace(regex, (match, index) => {
        if (index < originalCursorPosition) {
          cursorOffset += replacement.length - match.length;
        }
        return replacement;
      });
    }
    form.content = result;

    // 변환 완료 후 커서 위치 조정
    nextTick(() => {
      const newPosition = originalCursorPosition + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    });
  }, 100); // 100ms 지연
};
const debouncedHandleInput = useDebounceFn(handleInput, 300);
///////////// 스니펫 끝//

/////받는 메일 태그 검증 및 처리기능들
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateEmails = () => {
  form.selectedTags.forEach((email) => {
    if (!isValidEmail(email)) {
      ElMessage.error(`유효하지 않은 이메일 주소: ${email}`);
    }
  });
};

const handleClose = (tag) => {
  const index = form.selectedTags.indexOf(tag);
  if (index > -1) {
    form.selectedTags.splice(index, 1);
  }
};

const sendMail = () => {
  ElMessage.success("메일을 보냈습니다.");
};

const scheduleDialogVisible = ref(false);

const saveSchedule = (updatedData) => {
  scheduleForm.value = updatedData;
  ElMessage.success("변경된 예약설정이 반영되었습니다.");

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

const handleFileChange = (file, fileList) => {
  form.attachments = fileList;
};
</script>

<style scoped>
.mail-form {
  padding: 20px;
}
</style>
