<template>
  <div>
    <button @click="resetZoom">Reset Zoom</button>

    <div v-for="(threshold, index) in thresholds" :key="index">
      <label>Threshold {{ index + 1 }}: </label>
      <input
        v-model.number="thresholds[index]"
        type="range"
        :min="0"
        :max="100"
        step="1"
      />
      <span>{{ threshold }}</span>
      <button @click="addThreshold">Add Threshold</button>
      <button @click="removeThreshold" :disabled="thresholds.length <= 2">
        Remove Threshold
      </button>
    </div>
    <ClientOnly>
      <div>
        <p text="blue">chartType:</p>
        <ColumnDropdownList
          :columnListInfo="chartTypeList"
          @update:selectedColumn="
            (newValue) => changeSelectedColumn(`type`, newValue)
          "
        />
        <el-button>{{ props.chartConfig.type }}</el-button>
      </div>
      <div>
        <p text="blue">xAxis:</p>
        <ColumnDropdownList
          :columnListInfo="props.columnListInfo"
          @update:selectedColumn="
            (newValue) => changeSelectedColumn(`xAxisField`, newValue)
          "
        />
        <el-button>{{ props.chartConfig.xAxisField }}</el-button>
      </div>
      <div>
        <p text="blue">yAxis:</p>
        <ColumnDropdownList
          :columnListInfo="props.columnListInfo"
          @update:selectedColumn="(newValue) => addSelectedColumn(newValue)"
        />

        <el-button
          v-for="field in props.chartConfig.yAxisFields"
          :value="{}"
          @click="() => deleteSelectedColumn(`yAxisFields`, field)"
          >{{ field }}</el-button
        >
      </div>
      <div>
        <p text="blue">class:</p>
        <ColumnDropdownList
          :columnListInfo="props.columnListInfo"
          @update:selectedColumn="
            (newValue) => changeSelectedColumn(`classField`, newValue)
          "
        />
        <el-button>{{ props.chartConfig.classField }}</el-button>
      </div>

      <v-chart class="chart" :option="chartOption" autoresize />
    </ClientOnly>
  </div>
</template>

<script setup>
import {
  ScatterChart,
  LineChart,
  BarChart,
  BoxplotChart,
} from "echarts/charts";
import { onMounted, computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";

import { getScatterChartOption } from "~/composables/scatterChartUtils";
import { getBoxplotChartOption } from "~/composables/boxplotUtils";

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
  chartConfig: {
    type: Object,
    required: true,
  },
  columnListInfo: {
    type: Array,
    required: false,
  },
});

const emit = defineEmits(["update:chartConfig"]);

const chartTypeList = ["scatter", "boxplot"];

const thresholds = ref(props.chartConfig.thresholds || [33, 66]);
let chartInstance = null;

const colors = [
  "#c23531",
  "#2f4554",
  "#61a0a8",
  "#d48265",
  "#91c7ae",
  "#749f83",
  "#ca8622",
  "#bda29a",
  "#6e7074",
  "#546570",
];

const chartOption = computed(() => {
  switch (props.chartConfig.type) {
    case "scatter":
      return getScatterChartOption(props.chartConfig, props.chartData);
    case "boxplot":
      return getBoxplotChartOption(props.chartConfig, props.chartData);
    default:
      console.warn(`Unsupported chart type: ${props.chartConfig.type}`);
      return null;
  }
});

const addSelectedColumn = (column) => {
  const updatedConfig = {
    ...props.chartConfig,
    yAxisFields: [...props.chartConfig.yAxisFields, column],
  };
  emit("update:chartConfig", updatedConfig);
};
const changeSelectedColumn = (key, column) => {
  const updatedConfig = {
    ...props.chartConfig,
    [key]: column,
  };
  emit("update:chartConfig", updatedConfig);
};
const deleteSelectedColumn = (key, column) => {
  const updatedFields = props.chartConfig[key].filter((item) => {
    return item !== column;
  });

  const updatedConfig = {
    ...props.chartConfig,
    [key]: updatedFields,
  };

  emit("update:chartConfig", updatedConfig);
};
const addThreshold = () => {
  if (thresholds.value.length < 9) {
    thresholds.value.push(
      Math.floor((thresholds.value[thresholds.value.length - 1] + 100) / 2)
    );
    thresholds.value.sort((a, b) => a - b);
  }
};
const removeThreshold = () => {
  if (thresholds.value.length > 2) {
    thresholds.value.pop();
  }
};

const resetZoom = () => {
  if (chartInstance) {
    chartInstance.dispatchAction({
      type: "dataZoom",
      start: 0,
      end: 100,
    });
  }
};

onMounted(() => {
  use([
    CanvasRenderer,
    ScatterChart,
    LineChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    BoxplotChart,
  ]);
});
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
