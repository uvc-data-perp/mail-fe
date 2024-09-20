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
      v-if="writeMailStore.mailMessage.contents.periodType !== 'no'"
      class="flex gap-4"
      label="예약"
    >
      <div
        v-if="writeMailStore.mailMessage.contents.reservedTimestamp"
        class="mr-4"
      >
        {{
          `최초 전송:  ${writeMailStore.mailMessage.contents.reservedTimestamp} 
        `
        }}
        <br />
      </div>
      <div
        v-if="writeMailStore.mailMessage.contents.periodType !== 'single'"
        class="mr-4"
      >
        {{ `만료일:${writeMailStore.mailMessage.contents.expiryDate}` }}
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

    <!-- <el-form-item label="참조">
      <el-input v-model="form.cc" placeholder="참조 이메일" />
    </el-form-item> -->

    <el-form-item prop="subject" label="제목">
      <el-input
        v-model="writeMailStore.mailMessage.contents.subject"
        placeholder="제목"
      >
        <!-- <template #append>
          <el-checkbox v-model="form.important" label="중요!" />
        </template> -->
      </el-input>
    </el-form-item>

    <!-- <el-form-item label="파일첨부">
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
    </el-form-item> -->

    <el-form-item prop="text" label="내용">
      <el-input
        v-model="writeMailStore.mailMessage.contents.text"
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
import { useSnippetStore } from "~/stores/snippetStore"; // 스토어 파일 경로에 맞게 수정해주세요
import { useWriteMailStore } from "~/stores/writeMailStore"; // 스토어 파일 경로에 맞게 수정해주세요

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

const getDayNames = (days) => {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return days.map((day) => dayNames[day]);
};
//보내기
async function submitForm() {
  if (!mailFormRef.value) return;

  try {
    const valid = await mailFormRef.value.validate();
    if (valid) {
      // 유효성 검사 통과 시 기존 로직 실행
      if (route.query.type === "toMe") {
        const a = {
          ...writeMailStore.mailMessage.contents,
          to: "example@email.com",
        };
        console.log(a);
      }

      switch (writeMailStore.mailMessage.contents.periodType) {
        case "no":
          try {
            const results = await writeMailStore.sendMailTest();
            console.log("All email sending results:", results);

            const successCount = results.filter((r) => r.success).length;
            const failCount = results.length - successCount;

            if (failCount === 0) {
              ElMessage.success(
                `${successCount}개의 메일이 성공적으로 전송되었습니다.`
              );
            } else {
              ElMessage.warning(
                `${successCount}개의 메일 전송 성공, ${failCount}개의 메일 전송 실패.`
              );
            }
          } catch (error) {
            console.error("Error sending emails:", error);
            ElMessage.error("메일 전송 중 오류가 발생했습니다.");
          }
          break;

        case "single":
          try {
            const result = await writeMailStore.sendMailTest();
            console.log("Email reservation result:", result);
            ElMessage.success("메일이 성공적으로 예약되었습니다.");
          } catch (error) {
            console.error("Error reserving email:", error);
            ElMessage.error("메일 예약 중 오류가 발생했습니다.");
          }
          break;

        default:
          ElMessage.error("지원하지 않는 전송 유형입니다.");
          break;
      }
    } else {
      // 유효성 검사 실패 시
      ElMessage.error("폼 유효성 검사에 실패했습니다. 입력을 확인해주세요.");
    }
  } catch (error) {
    console.error("Form validation error:", error);
    ElMessage.error("폼 검증 중 오류가 발생했습니다.");
  }
}

// async function submitForm() {
//   //예약 메일 보내기 확인

//   //예약설정 추가
//   for (const key in scheduleForm.value) {
//     writeMailStore.mailMessage.contents[key] = scheduleForm.value[key];
//   }

//   // for (const singleMail of writeMailStore.mailMessage.contents.selectedTags) {
//     // writeMailStore.mailMessage.contents.to = singleMail;
//     // const a = { contents: writeMailStore.mailMessage.contents };
//     // console.log("A:", a);

//     if (!mailFormRef.value) return;

//     mailFormRef.value.validate((valid) => {
//       if (valid) {
//     switch (writeMailStore.mailMessage.contents.periodType) {
//       case "no":
//         try {
//           const results = await writeMailStore.sendMailTest(writeMailStore.mailMessage.contents.selectedTags);
//           console.log("All email sending results:", results);
//           ElMessage.success("모든 메일이 성공적으로 전송되었습니다.");
//         } catch (error) {
//           console.error("Error sending emails:", error);
//           ElMessage.error("메일 전송 중 오류가 발생했습니다.");
//         }
//         break;
//           case "single":
//             useAsyncData("reserveEmail", async () => {
//               await writeMailStore.reserveEmailTest();
//             });
//             console.log("finish-single send");
//             console.log("finish-single send");
//             console.log("finish-single send");
//             console.log("finish-single send");
//             console.log("finish-single send");
//             console.log("finish-single send");
//             break;
//         }

//         // 여기에 실제 제출 로직 추가 (예: API 호출)

//         ElMessage.success("메일이 성공적으로 전송되었습니다.");
//       } else {
//         // 유효성 검사 실패 시
//         ElMessage.error("폼 유효성 검사에 실패했습니다. 입력을 확인해주세요.");
//         return false;
//       }
//     });

// }

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

    //     // 완전한 키워드 매칭 및 변환
    // for (const [key, replacement] of Object.entries(snippet)) {
    //   const regex = new RegExp("\\" + key, "g");
    //   result = result.replace(regex, (match, index) => {
    //     if (index < originalCursorPosition) {
    //       cursorOffset += replacement.length - match.length;
    //     }
    //     return replacement;
    //   });
    // }
    // form.content = result;

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

// const handleInput = (value) => {
//   if (timeout) {
//     clearTimeout(timeout);
//   }

//   timeout = setTimeout(() => {
//     const textarea = document.querySelector("textarea");
//     const originalCursorPosition = textarea.selectionStart;
//     let result = value;
//     let cursorOffset = 0;

//     // 완전한 키워드 매칭 및 변환
//     for (const [key, replacement] of Object.entries(snippet)) {
//       const regex = new RegExp("\\" + key, "g");
//       result = result.replace(regex, (match, index) => {
//         if (index < originalCursorPosition) {
//           cursorOffset += replacement.length - match.length;
//         }
//         return replacement;
//       });
//     }
//     form.content = result;

//     // 변환 완료 후 커서 위치 조정
//     nextTick(() => {
//       const newPosition = originalCursorPosition + cursorOffset;
//       textarea.setSelectionRange(newPosition, newPosition);
//     });
//   }, 100); // 100ms 지연
// };
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

// const handleFileChange = (file, fileList) => {
//   writeMailStore.mailMessage.contents.attachments = fileList;
// };

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
