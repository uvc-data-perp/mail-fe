<template>
  <el-form
    :model="writeMailStore.mailMessage.contents"
    ref="mailFormRef"
    label-position="top"
    :rules="rules"
    class="mail-form"
  >
    <div>
      {{ writeMailStore.mailMessage.contents }}
    </div>
    <el-form-item>
      <el-button-group>
        <el-button type="primary" @click="submitForm">보내기</el-button>
        <el-button @click="scheduleDialogVisible = true">예약</el-button>
        <ScheduleModal
          v-if="scheduleDialogVisible"
          v-model:visible="scheduleDialogVisible"
          :edit-data="writeMailStore.mailMessage.contents"
          @save="saveSchedule"
        />

        <el-button @click="saveDraft">임시저장</el-button>
        <el-button @click="previewEmail">미리보기</el-button>
      </el-button-group>
      <el-dialog v-model="previewVisible" title="이메일 미리보기" width="50%">
        <div v-html="emailPreview"></div>
      </el-dialog>
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
      v-if="writeMailStore.mailMessage.contents.periodType !== 'no'"
      class="flex gap-4"
      label="예약"
    >
      <div
        v-if="writeMailStore.mailMessage.contents.reservedTimestamp"
        class="mr-4"
      >
        {{
          `최초 전송:  ${writeMailStore.mailMessage.contents.reservedDate} 
        `
        }}
        <br />
      </div>
      <div
        v-if="writeMailStore.mailMessage.contents.periodType !== 'single'"
        class="mr-4"
      >
        {{ `만료일:${writeMailStore.mailMessage.contents.expiredTimestamp}` }}
        {{
          writeMailStore.mailMessage.contents?.periodType === "weekly"
            ? ` ${getDayNames(writeMailStore.mailMessage.contents.days).join(
                ", "
              )}요일`
            : ` ${writeMailStore.mailMessage.contents.days?.join(", ")}일`
        }}
      </div>
    </el-form-item>

    <el-form-item
      v-if="route?.query?.type !== 'toMe'"
      prop="selectedTags"
      label="받는사람"
    >
      <el-select
        v-model="writeMailStore.mailMessage.contents.selectedTags"
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
            v-for="tag in writeMailStore.mailMessage.contents.selectedTags"
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

    <el-form-item prop="subject" label="제목">
      <el-input
        v-model="writeMailStore.mailMessage.contents.subject"
        placeholder="제목"
      >
      </el-input>
    </el-form-item>

    <!-- <el-form-item prop="text" label="내용">
      <el-input
        v-model="writeMailStore.mailMessage.contents.text"
        type="textarea"
        :rows="10"
        placeholder="내용을 입력하세요"
        @input="debouncedHandleInput"
      />
    </el-form-item> -->
    <el-form-item prop="text" label="내용">
      <el-input
        v-model="writeMailStore.mailMessage.contents.text"
        type="textarea"
        :rows="10"
        placeholder="내용을 입력하세요. 스타일 적용: **볼드**, *이탤릭*, [red]빨간색[/red]"
        @input="debouncedHandleInput"
      />

      <TiptapEditor
        v-model="writeMailStore.mailMessage.contents.text"
        @update:modelValue="debouncedHandleInput"
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
import { useSnippetStore } from "~/stores/snippetStore"; // 스토어 파일 경로에 맞게 수정해주세요
import { useWriteMailStore } from "~/stores/writeMailStore"; // 스토어 파일 경로에 맞게 수정해주세요
import mjml2html from "mjml-browser";
//store 불러오기
const writeMailStore = useWriteMailStore();
const snippetStore = useSnippetStore();

const mailFormRef = ref(null);

const rules = computed(() => {
  const baseRules = {
    subject: [
      {
        required: true,
        message: "제목을 지정해주세요",
        trigger: "submit",
      },
    ],
    content: [
      {
        required: true,
        message: "내용을 작성해주세요",
        trigger: "submit",
      },
    ],
    selectedTags: [
      {
        required: true,
        type: "array",
        message: "보낼 사람을 작성해주세요",
        trigger: "submit",
      },
    ],
  };

  return baseRules;
});

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

function parseStyledContent(content) {
  // 볼드 처리: **텍스트**
  content = content.replace(
    /\*\*(.*?)\*\*/g,
    '<mj-text font-weight="bold">$1</mj-text>'
  );

  // 이탤릭 처리: *텍스트*
  content = content.replace(
    /\*(.*?)\*/g,
    '<mj-text font-style="italic">$1</mj-text>'
  );

  // 색상 처리: [색상]텍스트[/색상]
  content = content.replace(
    /\[(#[0-9A-Fa-f]{6}|[a-zA-Z]+)\](.*?)\[\/\1\]/g,
    '<mj-text color="$1">$2</mj-text>'
  );

  // 글자 크기 처리: {크기px}텍스트{/크기}
  content = content.replace(
    /\{(\d+)px\}(.*?)\{\/\1\}/g,
    '<mj-text font-size="$1px">$2</mj-text>'
  );

  // 링크 처리: [링크텍스트](URL)
  content = content.replace(
    /\[(.*?)\]\((https?:\/\/.*?)\)/g,
    '<mj-text><a href="$2" style="color: #1155CC;">$1</a></mj-text>'
  );

  // 줄바꿈 처리
  content = content.split("\n").join("</mj-text><mj-text>");

  return `<mj-text>${content}</mj-text>`;
}

const generateEmailContent = () => {
  const styledContent = parseStyledContent(
    writeMailStore.mailMessage.contents.text
  );

  const mjmlTemplate = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px" color="#F45E43" font-family="helvetica">
              ${writeMailStore.mailMessage.contents.subject}
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#f0f0f0">
          <mj-column>
            ${styledContent}
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;

  const { html } = mjml2html(mjmlTemplate);
  return html;
};

const submitForm = async () => {
  if (!mailFormRef.value) return;

  try {
    await mailFormRef.value.validate();

    const emailContent = generateEmailContent();

    writeMailStore.mailMessage.contents = {
      ...writeMailStore.mailMessage.contents,
      html: emailContent,
    };

    // 생성된 HTML 내용을 사용하여 이메일 전송
    await writeMailStore.submitForm(mailFormRef.value);

    ElMessage.success("메일을 성공적으로 보냈습니다.");
  } catch (error) {
    console.error("Form validation failed:", error);
    ElMessage.error("입력 내용을 확인해주세요.");
  }
};

//보내기
let timeout = null;

const handleInput = (value) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const originalCursorPosition = textarea.selectionStart;
    let result = value;
    let cursorOffset = 0;

    // 완전한 키워드 매칭 및 변환
    snippetStore.snippets.forEach((snippet) => {
      const regex = new RegExp("\\" + snippet.from, "g");
      result = result.replace(regex, (match, index) => {
        if (index < originalCursorPosition) {
          cursorOffset += snippet.to.length - match.length;
        }
        return snippet.to;
      });
    });
    writeMailStore.mailMessage.contents.text = result;

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
  writeMailStore.mailMessage.contents.selectedTags.forEach((email) => {
    if (!isValidEmail(email)) {
      ElMessage.error(`유효하지 않은 이메일 주소: ${email}`);
    }
  });
};

const handleClose = (tag) => {
  const index = writeMailStore.mailMessage.contents.selectedTags.indexOf(tag);
  if (index > -1) {
    writeMailStore.mailMessage.contents.selectedTags.splice(index, 1);
  }
};

const sendMail = () => {
  ElMessage.success("메일을 보냈습니다.");
};

const scheduleDialogVisible = ref(false);

const saveSchedule = (updatedData) => {
  writeMailStore.mailMessage.contents.value = updatedData;
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

/////////

const handleShortcut = (event) => {
  // 모든 단축키 조합을 처리

  const pressedKey = event.key.toLowerCase();
  const ctrlKey = event.ctrlKey;
  const altKey = event.altKey;
  const shiftKey = event.shiftKey;

  const matchedSnippet = snippetStore.snippets.find((snippet) => {
    if (!snippet.keyBoard) return false;
    const shortcut = snippet.keyBoard.toLowerCase();
    const [modifier, key] = shortcut.split("+");
    if (key === pressedKey) {
      if (modifier === "ctrl" && ctrlKey) return true;
      if (modifier === "alt" && altKey) return true;
      if (modifier === "shift" && shiftKey) return true;
    }
    return false;
  });

  if (matchedSnippet) {
    event.preventDefault();
    insertSnippetText(matchedSnippet.to);
    ElMessage.success(
      `단축키 "${matchedSnippet.keyBoard}"가 입력되었습니다: "${matchedSnippet.to}"`
    );
  }
};

const insertSnippetText = (text) => {
  const textarea = document.querySelector("textarea");
  if (!textarea) return;

  const cursorPosition = textarea.selectionStart;
  const textBefore = writeMailStore.mailMessage.contents.text.slice(
    0,
    cursorPosition
  );
  const textAfter = writeMailStore.mailMessage.contents.text.slice(
    textarea.selectionEnd
  );

  writeMailStore.mailMessage.contents.text = textBefore + text + textAfter;

  nextTick(() => {
    const newCursorPosition = cursorPosition + text.length;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    textarea.focus();
  });
};

//미리보기////////////////////////////////
const previewVisible = ref(false);
const emailPreview = ref("");
const previewEmail = () => {
  emailPreview.value = generateEmailContent(
    writeMailStore.mailMessage.contents.subject,
    writeMailStore.mailMessage.contents.text
  );
  previewVisible.value = true;
};

onMounted(() => {
  document.addEventListener("keydown", handleShortcut);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleShortcut);
});
</script>

<style scoped>
.mail-form {
  padding: 20px;
}
</style>
