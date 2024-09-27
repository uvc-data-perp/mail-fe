<template>
  <el-form
    :model="writeMailStore.mailMessage.contents"
    ref="mailFormRef"
    label-position="left"
    :rules="rules"
    class="mail-form"
    :hide-required-asterisk="!isSubmitting"
  >
    <!-- <div>
      {{ writeMailStore.mailMessage.contents }}
    </div> -->
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

        <el-button @click="previewEmail">미리보기</el-button>
      </el-button-group>
      <el-dialog
        v-model="previewVisible"
        width="50%"
        center="true"
        title="이메일 미리보기"
        align-center="true"
        :draggable="true"
        :close-on-click-modal="false"
      >
        <template #header>
          <div class="flex justify-center font-bold text-xl">
            <p>이메일 미리보기</p>
          </div>
        </template>
        <div v-html="emailPreview"></div>
      </el-dialog>
      <el-dropdown style="margin-left: 10px">
        <el-button
          >템플릿<el-icon class="el-icon--right"><arrow-down /></el-icon
        ></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="useTemplate">템플릿1</el-dropdown-item>
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
      label-width="120px"
      flex
      justify-between
      text-bold
      pb-4
    >
      <template #label>
        <span class="font-bold mr-4">받는사람</span>
      </template>
      <el-select
        class="w-full max-w-[calc(100%-230px)]"
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

    <el-form-item label-width="120px" prop="subject" label="제목">
      <template #label>
        <span class="font-bold mr-4">제목</span>
      </template>
      <el-input
        class="w-full max-w-[calc(100%-230px)]"
        v-model="writeMailStore.mailMessage.contents.subject"
        width:10px
        placeholder="제목"
      >
      </el-input>
    </el-form-item>

    <el-form-item prop="text">
      <el-input
        v-show="false"
        v-model="writeMailStore.mailMessage.contents.text"
        type="textarea"
        :rows="10"
        placeholder="내용을 입력하세요"
        @input="debouncedHandleInput"
      />
    </el-form-item>
    <el-form-item prop="text" label="내용" label-position="top">
      <template #label>
        <span class="font-bold mr-20">내용</span>
      </template>
      <ClientOnly>
        <CustomQuillEditor
          v-model:content="writeMailStore.mailMessage.contents.text"
          content-type="html"
          theme="snow"
          @update:content="debouncedHandleInput"
        />
      </ClientOnly>
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
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

//quill
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

defineNuxtComponent({
  ssr: false,
});

//store 불러오기
const writeMailStore = useWriteMailStore();
const snippetStore = useSnippetStore();

const mailFormRef = ref(null);

const isSubmitting = ref(false);

const rules = computed(() => {
  const baseRules = {
    subject: [
      {
        required: false,
        message: "제목을 지정해주세요",
        trigger: "submit",
      },
    ],
    content: [
      {
        required: false,
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
      data: [{ email: `${query}@gmail.com` }, { email: `shyk31971@gmail.com` }],
    };
  } else {
    // 클라이언트 사이드에서만 비동기 처리
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            { email: `${query}@gmail.com` },
            { email: `shyk31971@gmail.com` },
          ],
        });
      }, 300);
    });
  }
};

const loading = ref(false);
const addressOptions = ref([]);
function convertQuillClassesToInlineStyles(content) {
  return content
    .replace(/class="ql-size-huge"/g, 'style="font-size: 2.5em;"')
    .replace(/class="ql-size-large"/g, 'style="font-size: 1.5em;"')
    .replace(/class="ql-size-small"/g, 'style="font-size: 0.75em;"')
    .replace(/class="ql-align-center"/g, 'style="text-align: center;"')
    .replace(/class="ql-align-right"/g, 'style="text-align: right;"')
    .replace(/class="ql-align-justify"/g, 'style="text-align: justify;"')
    .replace(/class="ql-color-red"/g, 'style="color: #e60000;"')
    .replace(/class="ql-color-green"/g, 'style="color: #008a00;"')
    .replace(/class="ql-color-blue"/g, 'style="color: #06c;"')
    .replace(/class="ql-bg-red"/g, 'style="background-color: #ffebeb;"')
    .replace(/class="ql-bg-green"/g, 'style="background-color: #e6ffe6;"')
    .replace(/class="ql-bg-blue"/g, 'style="background-color: #e6f2ff;"')
    .replace(
      /class="ql-font-serif"/g,
      'style="font-family: Georgia, Times New Roman, serif;"'
    )
    .replace(
      /class="ql-font-monospace"/g,
      'style="font-family: Monaco, Courier New, monospace;"'
    );
}

const generateEmailContent = () => {
  const subject = writeMailStore.mailMessage.contents.subject;
  let content = convertQuillClassesToInlineStyles(
    writeMailStore.mailMessage.contents.text
  ); // Quill 에디터의 HTML 내용

  // Quill 클래스를 인라인 스타일로 변환

  // 기타 필요한 Quill 클래스 변환 로직 추가

  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            .ql-align-center { text-align: center; }
            .ql-align-right { text-align: right; }
            .ql-align-justify { text-align: justify; }
            /* 추가 Quill 스타일 정의 */
        </style>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #F45E43;">${subject}</h1>
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
                ${content}
            </div>
        </div>
    </body>
    </html>
  `;
};
const submitForm = async () => {
  if (!mailFormRef.value) return;

  try {
    isSubmitting.value = true;
    await mailFormRef.value.validate();

    const emailContent = generateEmailContent();

    writeMailStore.mailMessage.contents = {
      ...writeMailStore.mailMessage.contents,
      html: emailContent,
      text: emailContent,
    };

    // 생성된 HTML 내용을 사용하여 이메일 전송
    await writeMailStore.submitForm(mailFormRef.value);

    ElMessage.success("메일을 성공적으로 보냈습니다.");
  } catch (error) {
    console.error("Form validation failed:", error);
    ElMessage.error("입력 내용을 확인해주세요.");
  } finally {
    isSubmitting.value = false;
  }
};

//보내기
let timeout = null;

// function deltaToPlainText(delta) {
//   if (typeof delta === "string") return delta;
//   if (!delta || !delta.ops) return "";
//   return delta.ops.map((op) => op.insert || "").join("");
// }

// // 에디터 업데이트 핸들러
// const handleEditorUpdate = (content) => {
//   // content는 델타 객체입니다
//   const plainText = deltaToPlainText(content);
//   debouncedHandleInput(plainText);
// };

// // 기존 handleInput 함수 (약간의 수정)
// const handleInput = (value) => {
//   if (timeout) {
//     clearTimeout(timeout);
//   }

//   timeout = setTimeout(() => {
//     let result = value;

//     // 완전한 키워드 매칭 및 변환
//     snippetStore.snippets.forEach((snippet) => {
//       const regex = new RegExp(escapeRegExp(snippet.from), "g");
//       result = result.replace(regex, snippet.to);
//     });

//     // 결과를 다시 델타 객체로 변환
//     writeMailStore.mailMessage.contents.text = { ops: [{ insert: result }] };
//   }, 100);
// };

// const handleInput = (quill, value) => {
//   if (timeout) {
//     clearTimeout(timeout);
//   }

//   timeout = setTimeout(() => {
//     const range = quill.getSelection();
//     if (!range) return;

//     const originalCursorPosition = range.index;
//     let result = value;
//     let cursorOffset = 0;

//     // 완전한 키워드 매칭 및 변환
//     snippetStore.snippets.forEach((snippet) => {
//       const regex = new RegExp(escapeRegExp(snippet.from), "g");
//       result = result.replace(regex, (match, index) => {
//         if (index < originalCursorPosition) {
//           cursorOffset += snippet.to.length - match.length;
//         }
//         return snippet.to;
//       });
//     });

//     // Quill의 내용 업데이트
//     quill.setText(result);

//     // 변환 완료 후 커서 위치 조정
//     nextTick(() => {
//       const newPosition = originalCursorPosition + cursorOffset;
//       quill.setSelection(newPosition, 0);
//     });

//     // store 업데이트
//     writeMailStore.mailMessage.contents.text = result;
//   }, 100); // 100ms 지연
// };

// 정규표현식 특수문자 이스케이프 함수
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const handleInput = (value) => {
  if (timeout) {
    clearTimeout(timeout);
  }
  console.log;

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

const previewMail = () => {
  ElMessage.info("미리보기 기능은 아직 구현되지 않았습니다.");
};

const useTemplate = () => {
  ElMessage.info("템플릿 기능을 적용하였습니다.");
  writeMailStore.mailMessage.contents.text = testText;
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
    if (!snippet.command) return false;
    const shortcut = snippet.command.toLowerCase();
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
      `단축키 "${matchedSnippet.command}"가 입력되었습니다: "${matchedSnippet.to}"`
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

const getDayNames = (days) => {
  const dayNames = ["월", "화", "수", "목", "금", "토", "일"];
  return days.map((day) => dayNames[day]);
};

onMounted(() => {
  document.addEventListener("keydown", handleShortcut);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleShortcut);
});

const testText = `

    <h2 style="background-color: rgb(52, 152, 219); color: white; padding: 10px; margin: 0; border: 20px solid black;">1. 프로젝트 현황</h2>
    <p style="border: 20px solid black; border-top: none; padding: 0; margin: 0; background-color: rgb(241, 196, 15);">
        <span style="background-color: rgb(52, 152, 219);" >진행률 70%</span>
        
    </p>
    
    <h2 style="background-color: rgb(46, 204, 113); color: white; padding: 10px; margin: 10px 0 0 0; border: 2px solid black;">2. 주요 성과</h2>
    <p style="border: 2px solid black; border-top: none; padding: 0; margin: 0; background-color: rgb(236, 240, 241); display: flex; flex-wrap: wrap;">
        <span style="flex: 1; padding: 5px; box-sizing: border-box; border-right: 2px solid black;"><span style="background-color: yellow;"><strong>신규 고객 5개사 유치</strong></span></span>
        <span style="flex: 1; padding: 5px; box-sizing: border-box; border-right: 2px solid black;"><em><u>분기별 매출 목표 110% 달성</u></em></span>
        <span style="flex: 1; padding: 5px; box-sizing: border-box;"><span style="color: rgb(142, 68, 173);">신제품 론칭 성공</span></span>
    </p>
    
    <h2 style="background-color: rgb(230, 126, 34); color: white; padding: 10px; margin: 10px 0 0 0; border: 2px solid black;">3. 향후 계획</h2>
    <p style="border: 2px solid black; border-top: none; padding: 0; margin: 0; background-color: rgb(236, 240, 241); display: flex; flex-wrap: wrap;">
        <span style="flex: 1; padding: 5px; box-sizing: border-box; border-right: 2px solid black;"><strong style="color: rgb(52, 152, 219);">해외 시장 진출 준비</strong></span>
        <span style="flex: 1; padding: 5px; box-sizing: border-box; border-right: 2px solid black;"><em style="color: rgb(155, 89, 182);">신규 인력 채용 및 교육</em></span>
        <span style="flex: 1; padding: 5px; box-sizing: border-box;"><u style="color: rgb(231, 76, 60);">R&D 투자 확대</u></span>
    </p>
    
    <p style="text-align: center; font-size: 18px; color: rgb(127, 140, 141); margin-top: 10px; font-style: italic; border: 2px solid black; padding: 10px;">본 보고서는 월간 성과와 계획을 요약한 것입니다. 자세한 내용은 부서별 상세 보고서를 참조하십시오.</p>
</body>
</html>`;

const insertTable = () => {
  if (customEditor.value) {
    customEditor.value.insertTable(); // expose된 insertTable 메서드 호출
  }
};
</script>

<style scoped>
.mail-form {
  padding: 20px;
}
</style>
