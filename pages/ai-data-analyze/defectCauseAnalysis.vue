<template>
  <NuxtLayout name="default">
    <el-scrollbar max-height="100vh">
      <div class="container">
        <header
          class="el-header bg flex animate-fade-in items-center justify-center rounded-b-3xl transition duration-250 wp-100"
        >
          <div class="flex ~ gap3 mr-1 text-xl wp-95">
            <div class="flex items-center justify-center">
              불량원인 데이터 분석
            </div>
          </div>
        </header>

        <main class="el-main" id="el-main">
          <div v-if="!isEquipmentSelected">
            <div class="flex justify-start mt-2">
              <el-button type="primary" @click="handleCreateBoard"
                >생성</el-button
              >
            </div>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="title" label="제목" width="180" />
              <el-table-column prop="author" label="작성자" width="180" />
              <el-table-column prop="date" label="작성일" width="180" />
              <el-table-column label="작업" width="200">
                <template #default="scope">
                  <el-button
                    size="small"
                    @click="handleRead(scope.$index, scope.row)"
                    >조회</el-button
                  >
                  <el-button
                    size="small"
                    @click.stop="handleEdit(scope.$index, scope.row)"
                    >수정</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                    >삭제</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div v-if="isEquipmentSelected" class="nav-list">
            <EquipsList
              v-if="!isUploaded"
              @equipSelected="handleEquipSelected"
            />
            <DefectsList
              v-if="isUploaded"
              @defectSelected="handleDefectSelected"
            />
          </div>
          <UploadDialogue
            v-if="isSelectedEquip && !isUploaded"
            :data="selectedData"
            @emitIsUploaded="handleIsUploaded"
          />

          <!-- 업로드 이후 표시되는 메인 영역 -->
          <div
            v-if="isUploaded && defectType.defectName === '이미지 검증'"
            class="flex justify-center"
          >
            <iframe
              :src="fiftyoneUrl"
              width="100%"
              height="600px"
              frameborder="0"
              @load="onIframeLoad"
            ></iframe>
          </div>
          <div
            v-if="isUploaded && defectType.defectName !== '이미지 검증'"
            flex
            overflow-y-hidden
          >
            <!-- 메인영역 왼쪽 이미지 및 칼럼 -->
            <div class="inspection-left" wp-30 flex flex-col gap-10>
              <!-- 이미지 영역 -->
              <ObjectImg />
              <!-- 칼럼영역 -->
              <div class="ColumnList" flex-grow>
                <ScrollbarEl :data="filteredColumnListInfo" />
              </div>
            </div>
            <!-- 메인 우측  -->

            <div
              v-if="defectType"
              class="inspection-right"
              flex
              flex-wrap
              gap-4
              wp-70
              overflow-y-hidden
            >
              <div w-full>
                <div>
                  <div flex justify-end>
                    <el-button @click="showAddChartModal">Add Chart</el-button>
                  </div>
                  <div v-for="(config, key) in chartConfigs">
                    <DynamicChart
                      :chartData="processedChartData[key]"
                      :chartConfig="config"
                      :columnListInfo="
                        columnListInfo.map((item) => item.varName)
                      "
                      @update:chartConfig="
                        (newConfig) => updateChartConfig(key, newConfig)
                      "
                    />
                  </div>

                  <div>
                    <iframe
                      src="http://158.247.200.126:3000/d-solo/cdx1zqzt0p69sd/new-dashboard?orgId=1&panelId=1"
                      wp-100
                      height="400"
                      frameborder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </el-scrollbar>

    <EditModal
      v-if="editDialogVisible"
      v-model:visible="editDialogVisible"
      :edit-data="editForm"
      @save="saveEdit"
    />

    <!-- Add Chart Modal -->
    <el-dialog v-model="addChartDialogVisible" title="Add New Chart">
      <el-form :model="newChartForm">
        <el-form-item label="Chart Type">
          <el-select v-model="newChartForm.type">
            <el-option label="Scatter" value="scatter" />
            <el-option label="Line" value="line" />
            <el-option label="Bar" value="bar" />
            <el-option label="BoxPlot" value="boxplot" />
          </el-select>
        </el-form-item>
        <el-form-item label="X-Axis Field">
          <el-select v-model="newChartForm.xAxisField">
            <el-option
              v-for="field in availableFields"
              :key="field"
              :label="field"
              :value="field"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Y-Axis Fields">
          <el-select v-model="newChartForm.yAxisFields" multiple>
            <el-option
              v-for="field in availableFields"
              :key="field"
              :label="field"
              :value="field"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="threshold">
          <el-input v-model="newChartForm.thresholds[0]" />
        </el-form-item>
        <el-form-item label="Title">
          <el-input v-model="newChartForm.title" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addChartDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addNewChart">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </NuxtLayout>
</template>

<script setup>
// import { ref } from "vue";
import { ref, computed, reactive } from "vue";
import EquipsList from "~/components/EquipsList.vue";
import DefectsList from "~/components/DefectsList.vue";
import UploadDialogue from "~/components/UploadDialogue.vue";
import ObjectImg from "~/components/ObjectImg.vue";
import ScrollbarEl from "~/components/ScrollbarEl.vue";

const isUploaded = ref(false);
const isSelectedEquip = ref(false);
const defectType = ref(false);
const selectedData = ref(null);

const fiftyoneUrl = "http://localhost:5151";

/////
// 새로운 상태 변수
const isEquipmentSelected = ref(false);

// 수정 모달 관련 상태
const editDialogVisible = ref(false);
const editForm = ref({});
const editIndex = ref(-1);

// 테이블 데이터
const tableData = ref([
  {
    title: "프로젝트 1",
    author: "홍길동",
    date: "2024-09-01",
  },
  {
    title: "프로젝트 2",
    author: "김철수",
    date: "2024-09-02",
  },
  // 더 많은 데이터를 여기에 추가할 수 있습니다.
]);

// const handleChartConfig = (newConfig) => {
//   Object.entries(chartConfigs.value).forEach(([key, config]) => {
//     con;
//     if (config.id === newConfig.id) {
//       // console.log(chartConfigs[key]);
//       chartConfigs.value[key] = newConfig;
//       // console.log(chartConfigs[key]);
//     }
//   });
// };
const handleCreateBoard = () => {
  editIndex.value = -1; // 새 항목 생성을 나타내는 특별한 값
  editForm.value = {
    title: "",
    author: "",
    date: new Date().toISOString().split("T")[0], // 현재 날짜
  };
  editDialogVisible.value = true;
};

const handleRead = (index, row) => {
  isEquipmentSelected.value = true;
  // 여기에 수정 로직을 추가하세요
};

// 수정 버튼 핸들러
const handleEdit = (index, row) => {
  editIndex.value = index;
  editForm.value = { ...row };
  editDialogVisible.value = true;
};

// 수정 저장 핸들러
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

// 삭제 버튼 핸들러
const handleDelete = (index, row) => {
  tableData.value.splice(index, 1);
};

//////

const chartData = ref([
  {
    timeStamp: "2021-01-01 09:00:41",
    No_Shot: 0,
    Machine_Cycle_Time: 16.54,
    Cycle_Time: 16.52,
    Barrel_Temp_Z1: 210.2,
    Barrel_Temp_Z2: 200.7,
    Barrel_Temp_Z3: 193.5,
    Barrel_Temp_Z4: 187.3,
    Hopper_Temp: 40.1,
    Injection_Pressure_Real_Time: 1.23,
    Screw_Position: 6.02,
    Injection_Peak_Press: 1211.65,
    Max_Injection_Rate: 78.37,
    Screw_Velocity: 20.6,
    VP_Time: 2,
    VP_Position: 8.14,
    Weighing_Start_Position: 10.51,
    VP_Press: 1062,
    Plasticizing_Time: 4.74,
    Plasticizing_Start_Position: 10.46,
    Plasticizing_End_Position: 63.11,
    Plasticizing_RPM: 28.27,
    Minimum_Cushion: 6.02,
    Cooling_Time: 8,
    Back_Flow: 49.03,
    Decompression_Time: 0.32,
    _ID: 0,
  },
  {
    timeStamp: "2021-01-01 09:02:41",
    No_Shot: 1,
    Machine_Cycle_Time: 16.56,
    Cycle_Time: 16.54,
    Barrel_Temp_Z1: 210.2,
    Barrel_Temp_Z2: 200.8,
    Barrel_Temp_Z3: 193.5,
    Barrel_Temp_Z4: 187.2,
    Hopper_Temp: 40.2,
    Injection_Pressure_Real_Time: 1.24,
    Screw_Position: 6.02,
    Injection_Peak_Press: 1211.65,
    Max_Injection_Rate: 78.37,
    Screw_Velocity: 20.6,
    VP_Time: 2,
    VP_Position: 8.14,
    Weighing_Start_Position: 10.51,
    VP_Press: 1062,
    Plasticizing_Time: 4.81,
    Plasticizing_Start_Position: 10.49,
    Plasticizing_End_Position: 63.11,
    Plasticizing_RPM: 28.27,
    Minimum_Cushion: 6.02,
    Cooling_Time: 8,
    Back_Flow: 49.03,
    Decompression_Time: 0.32,
    _ID: 1,
  },
  {
    timeStamp: "2021-01-01 09:04:41",
    No_Shot: 2,
    Machine_Cycle_Time: 16.58,
    Cycle_Time: 16.56,
    Barrel_Temp_Z1: 210.1,
    Barrel_Temp_Z2: 200.7,
    Barrel_Temp_Z3: 193.5,
    Barrel_Temp_Z4: 187.2,
    Hopper_Temp: 40.2,
    Injection_Pressure_Real_Time: 1.26,
    Screw_Position: 6.02,
    Injection_Peak_Press: 1209.16,
    Max_Injection_Rate: 78.32,
    Screw_Velocity: 35.38,
    VP_Time: 2,
    VP_Position: 8.12,
    Weighing_Start_Position: 10.54,
    VP_Press: 1101.41,
    Plasticizing_Time: 4.8,
    Plasticizing_Start_Position: 10.53,
    Plasticizing_End_Position: 63.11,
    Plasticizing_RPM: 28.27,
    Minimum_Cushion: 6.02,
    Cooling_Time: 8,
    Back_Flow: 49.03,
    Decompression_Time: 0.32,
    _ID: 2,
  },
  {
    timeStamp: "2021-01-01 09:06:41",
    No_Shot: 3,
    Machine_Cycle_Time: 16.62,
    Cycle_Time: 16.58,
    Barrel_Temp_Z1: 210.1,
    Barrel_Temp_Z2: 200.6,
    Barrel_Temp_Z3: 193.5,
    Barrel_Temp_Z4: 187.2,
    Hopper_Temp: 40.2,
    Injection_Pressure_Real_Time: 1.3,
    Screw_Position: 6.28,
    Injection_Peak_Press: 1228.24,
    Max_Injection_Rate: 78.19,
    Screw_Velocity: 36.35,
    VP_Time: 2,
    VP_Position: 8.12,
    Weighing_Start_Position: 10.79,
    VP_Press: 1092.55,
    Plasticizing_Time: 4.84,
    Plasticizing_Start_Position: 10.78,
    Plasticizing_End_Position: 63.11,
    Plasticizing_RPM: 28.27,
    Minimum_Cushion: 6.28,
    Cooling_Time: 8,
    Back_Flow: 49.03,
    Decompression_Time: 0.33,
    _ID: 3,
  },
  {
    timeStamp: "2021-01-01 09:08:41",
    No_Shot: 4,
    Machine_Cycle_Time: 16.62,
    Cycle_Time: 16.62,
    Barrel_Temp_Z1: 210,
    Barrel_Temp_Z2: 200.5,
    Barrel_Temp_Z3: 193.4,
    Barrel_Temp_Z4: 187.3,
    Hopper_Temp: 40.1,
    Injection_Pressure_Real_Time: 1.31,
    Screw_Position: 6.46,
    Injection_Peak_Press: 1287.11,
    Max_Injection_Rate: 77.99,
    Screw_Velocity: 46.1,
    VP_Time: 2,
    VP_Position: 8.1,
    Weighing_Start_Position: 10.96,
    VP_Press: 1153.41,
    Plasticizing_Time: 4.86,
    Plasticizing_Start_Position: 10.94,
    Plasticizing_End_Position: 63.11,
    Plasticizing_RPM: 28.27,
    Minimum_Cushion: 6.46,
    Cooling_Time: 8,
    Back_Flow: 49.03,
    Decompression_Time: 0.33,
    _ID: 4,
  },
  {
    timeStamp: "2021-01-01 09:10:41",
    No_Shot: 5,
    Machine_Cycle_Time: 16.62,
    Cycle_Time: 16.64,
    Barrel_Temp_Z1: 210,
    Barrel_Temp_Z2: 200.4,
    Barrel_Temp_Z3: 193.4,
    Barrel_Temp_Z4: 187.3,
    Hopper_Temp: 40.1,
    Injection_Pressure_Real_Time: 1.3,
    Screw_Position: 6.43,
    Injection_Peak_Press: 1261.17,
    Max_Injection_Rate: 78.07,
    Screw_Velocity: 47.77,
    VP_Time: 2,
    VP_Position: 8.11,
    Weighing_Start_Position: 10.94,
    VP_Press: 1176.73,
    Plasticizing_Time: 4.87,
    Plasticizing_Start_Position: 10.92,
    Plasticizing_End_Position: 63.11,
    Plasticizing_RPM: 28.27,
    Minimum_Cushion: 6.43,
    Cooling_Time: 8,
    Back_Flow: 49.03,
    Decompression_Time: 0.33,
    _ID: 5,
  },
  {
    timeStamp: "2021-01-01 09:12:41",
    No_Shot: 6,
    Machine_Cycle_Time: 16.62,
    Cycle_Time: 16.62,
    Barrel_Temp_Z1: 210,
    Barrel_Temp_Z2: 200.3,
    Barrel_Temp_Z3: 193.3,
    Barrel_Temp_Z4: 187.4,
    Hopper_Temp: 40,
    Injection_Pressure_Real_Time: 1.31,
    Screw_Position: 6.51,
    Injection_Peak_Press: 1276.63,
    Max_Injection_Rate: 78.03,
    Screw_Velocity: 46.78,
    VP_Time: 2,
    VP_Position: 8.11,
    Weighing_Start_Position: 11,
    VP_Press: 1162.02,
    Plasticizing_Time: 4.84,
    Plasticizing_Start_Position: 10.99,
    Plasticizing_End_Position: 63.11,
    Plasticizing_RPM: 28.27,
    Minimum_Cushion: 6.51,
    Cooling_Time: 8,
    Back_Flow: 49.03,
    Decompression_Time: 0.33,
    _ID: 6,
  },
  {
    timeStamp: "2021-01-01 09:14:41",
    No_Shot: 7,
    Machine_Cycle_Time: 16.62,
    Cycle_Time: 16.62,
    Barrel_Temp_Z1: 210.1,
    Barrel_Temp_Z2: 200.3,
    Barrel_Temp_Z3: 193.4,
    Barrel_Temp_Z4: 187.5,
    Hopper_Temp: 40,
    Injection_Pressure_Real_Time: 1.3,
    Screw_Position: 6.38,
    Injection_Peak_Press: 1285.61,
    Max_Injection_Rate: 78.17,
    Screw_Velocity: 45.13,
    VP_Time: 2,
    VP_Position: 8.12,
    Weighing_Start_Position: 10.89,
    VP_Press: 1151.92,
    Plasticizing_Time: 4.87,
    Plasticizing_Start_Position: 10.87,
    Plasticizing_End_Position: 63.11,
    Plasticizing_RPM: 28.27,
    Minimum_Cushion: 6.38,
    Cooling_Time: 8,
    Back_Flow: 49.03,
    Decompression_Time: 0.32,
    _ID: 7,
  },
  {
    timeStamp: "2021-01-01 09:16:41",
    No_Shot: 8,
    Machine_Cycle_Time: 16.6,
    Cycle_Time: 16.64,
    Barrel_Temp_Z1: 210,
    Barrel_Temp_Z2: 200.4,
    Barrel_Temp_Z3: 193.4,
    Barrel_Temp_Z4: 187.7,
    Hopper_Temp: 39.9,
    Injection_Pressure_Real_Time: 1.31,
    Screw_Position: 6.39,
    Injection_Peak_Press: 1241.21,
    Max_Injection_Rate: 78.11,
    Screw_Velocity: 39.1,
    VP_Time: 2,
    VP_Position: 8.14,
    Weighing_Start_Position: 10.9,
    VP_Press: 1108.89,
    Plasticizing_Time: 4.89,
    Plasticizing_Start_Position: 10.89,
    Plasticizing_End_Position: 63.11,
    Plasticizing_RPM: 28.27,
    Minimum_Cushion: 6.39,
    Cooling_Time: 8,
    Back_Flow: 49.03,
    Decompression_Time: 0.32,
    _ID: 8,
  },
  {
    timeStamp: "2021-01-01 09:18:41",
    No_Shot: 9,
    Machine_Cycle_Time: 16.62,
    Cycle_Time: 16.62,
    Barrel_Temp_Z1: 209.9,
    Barrel_Temp_Z2: 200.3,
    Barrel_Temp_Z3: 193.6,
    Barrel_Temp_Z4: 187.9,
    Hopper_Temp: 40,
    Injection_Pressure_Real_Time: 1.32,
    Screw_Position: 6.4,
    Injection_Peak_Press: 1283.99,
    Max_Injection_Rate: 78.17,
    Screw_Velocity: 45.59,
    VP_Time: 2,
    VP_Position: 8.12,
    Weighing_Start_Position: 10.9,
    VP_Press: 1149.05,
    Plasticizing_Time: 4.93,
    Plasticizing_Start_Position: 10.88,
    Plasticizing_End_Position: 63.11,
    Plasticizing_RPM: 28.27,
    Minimum_Cushion: 6.4,
    Cooling_Time: 8,
    Back_Flow: 49.03,
    Decompression_Time: 0.32,
    _ID: 9,
  },
]);

const filteredColumnListInfo = computed(() => {
  return columnListInfo.value.filter((item) =>
    selectedIndex.value.includes(item.index)
  );
});

const handleEquipSelected = (equip) => {
  isSelectedEquip.value = equip;
};

const handleDefectSelected = (defect) => {
  defectType.value = defect;
  selectedIndex.value = [4, 5, 6, 7, 9, 11, 12, 22, 23];
};

const handleIsUploaded = () => {
  isUploaded.value = true;
};
const handleNodeClick = (data) => {
  selectedData.value = data;
};

const chartConfigs = ref({
  chart1: {
    id: "chart1",
    type: "scatter",
    xAxisField: "Injection_Pressure_Real_Time",
    yAxisFields: ["Injection_Pressure_Real_Time"],
    classField: "Screw_Velocity",
    thresholds: [33, 66],
    title: "default title",
  },
  // ... other chart configs ...
});

// Add this function to handle chart config updates
const updateChartConfig = (chartId, newConfig) => {
  chartConfigs.value[chartId] = newConfig;
};

const addChartDialogVisible = ref(false);
const newChartForm = reactive({
  type: "scatter",
  xAxisField: "",
  yAxisFields: [],
  classField: "",
  thresholds: [0],
  title: "",
});

const availableFields = computed(() => {
  if (chartData.value.length > 0) {
    return Object.keys(chartData.value[0]);
  }
  return [];
});

const showAddChartModal = () => {
  addChartDialogVisible.value = true;
};

const addNewChart = () => {
  const newId = `chart${Object.keys(chartConfigs.value).length + 1}`;
  chartConfigs.value[newId] = {
    id: newId,
    type: newChartForm.type,
    xAxisField: newChartForm.xAxisField,
    yAxisFields: newChartForm.yAxisFields,
    thresholds: newChartForm.thresholds, // 기본값 설정
    title: newChartForm.title,
  };

  addChartDialogVisible.value = false;
  // 폼 초기화
  newChartForm.type = "scatter";
  newChartForm.xAxisField = "";
  newChartForm.yAxisFields = [];
  (newChartForm.thresholds = [0]), (newChartForm.title = "");
};

// config의 xxAxisField, yAxisFields를 map으로 꺼낸 다음 합친 배열하나를 요소로 하는 map함수
const processChartData = (config, data) => {
  return data.map((item) => {
    const yValues = config.yAxisFields.map((field) => item[field]);
    return [item[config.xAxisField], ...yValues, item[config.classField]];
  });
};

/**
 * chartConfigs에 있는 각 차트 설정에 대한 데이터를
 * processChartData 함수를 호출하여 처리하고,
 * 그 결과를 result에 저장
 */
const processedChartData = computed(() => {
  const result = {};
  // chartConfigs에 있는 각 차트 설정을 순회
  // 예를 들어 chartConfigs에 { chart1: { ... }, chart2: { ... } }와 같은 형태의 데이터가 있을 때
  for (const [key, config] of Object.entries(chartConfigs.value)) {
    console.log(`Processing data for chart: ${key}`);
    // processChartData 함수를 호출하여 데이터를 처리
    result[key] = processChartData(config, chartData.value);
  }
  // 최종 처리된 데이터를 반환
  return result;
});

const selectedIndex = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26,
]);
const columnListInfo = ref([
  { index: "No", varName: "변수", varType: "데이터 타입", description: "설명" },
  { index: 1, varName: "No_Shot", varType: "int64", description: "Shot 번호" },
  {
    index: 2,
    varName: "Machine_Cycle_Time",
    varType: "float64",
    description: "기계 사이클 타임",
  },
  {
    index: 3,
    varName: "Cycle_Time",
    varType: "float64",
    description: "사이클 타임",
  },
  {
    index: 4,
    varName: "Barrel_Temp_Z1",
    varType: "float64",
    description: "배럴 온도",
  },
  {
    index: 5,
    varName: "Barrel_Temp_Z2",
    varType: "float64",
    description: "배럴 온도",
  },
  {
    index: 6,
    varName: "Barrel_Temp_Z3",
    varType: "float64",
    description: "배럴 온도",
  },
  {
    index: 7,
    varName: "Barrel_Temp_Z4",
    varType: "float64",
    description: "배럴 온도",
  },
  {
    index: 8,
    varName: "Hopper_Temp",
    varType: "float64",
    description: "호퍼 온도",
  },
  {
    index: 9,
    varName: "Injection_Pressure_Real_Time",
    varType: "float64",
    description: "사출 시간",
  },
  {
    index: 10,
    varName: "Screw_Position",
    varType: "float64",
    description: "스크류 위치",
  },
  {
    index: 11,
    varName: "Injection_Peak_Press",
    varType: "float64",
    description: "사출최대압력",
  },
  {
    index: 12,
    varName: "Max_Injection_Rate",
    varType: "float64",
    description: "최대사출율",
  },
  {
    index: 13,
    varName: "Screw_Velocity",
    varType: "float64",
    description: "스크류 속도",
  },
  {
    index: 14,
    varName: "VP_Time",
    varType: "float64",
    description: "보압 시간",
  },
  {
    index: 15,
    varName: "VP_Position",
    varType: "float64",
    description: "보압절환위치",
  },
  {
    index: 16,
    varName: "Weighing_Start_Position",
    varType: "float64",
    description: "보압시작위치",
  },
  {
    index: 17,
    varName: "VP_Press",
    varType: "float64",
    description: "보압절환압력",
  },
  {
    index: 18,
    varName: "Plasticizing_Time",
    varType: "float64",
    description: "계량시간",
  },
  {
    index: 19,
    varName: "Plasticizing_Start_Position",
    varType: "float64",
    description: "계량시작위치",
  },
  {
    index: 20,
    varName: "Plasticizing_End_Position",
    varType: "float64",
    description: "계량종료위치",
  },
  {
    index: 21,
    varName: "Plasticizing_Screw_Velocity",
    varType: "float64",
    description: "계량스크류속도",
  },
  {
    index: 22,
    varName: "Minimum_Cushion",
    varType: "float64",
    description: "최소쿠션",
  },
  {
    index: 23,
    varName: "Cooling_Time",
    varType: "float64",
    description: "냉각시간",
  },
  {
    index: 24,
    varName: "Back_Flow",
    varType: "float64",
    description: "백플로우",
  },
  {
    index: 25,
    varName: "Decompression_Time",
    varType: "float64",
    description: "석백",
  },
  {
    index: 26,
    varName: "_ID",
    varType: "int64",
    description: "식별정보",
  },
]);
</script>

<style scoped>
/* 필요한 경우 스타일 추가 */
</style>
