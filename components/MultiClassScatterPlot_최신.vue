<template>
  <div>
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
    </div>
    <button @click="addThreshold">Add Threshold</button>
    <button @click="removeThreshold" :disabled="thresholds.length <= 2">
      Remove Threshold
    </button>
    <button @click="resetZoom">Reset Zoom</button>
    <select v-model="selectedChartType">
      <option value="scatter">Scatter</option>
      <option value="line">Line</option>
      <option value="bar">Bar</option>
      <option value="boxplot">BoxPlot</option>
    </select>
    <ClientOnly>
      <v-chart
        class="chart"
        :option="chartOption"
        autoresize
        @zr:click="onClick"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  ScatterChart,
  LineChart,
  BarChart,
  BoxplotChart,
} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
} from "echarts/components";

// Props definition
const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
  chartConfig: {
    type: Object,
    required: true,
  },
});

let chartInstance = null;

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

const thresholds = ref(props.chartConfig.thresholds || [33, 66]);
const selectedChartType = ref(props.chartConfig.type || "scatter");
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

const calculateBoxPlotData = (data, fieldIndex) => {
  console.log(`Calculating boxplot data for field index: ${fieldIndex}`);
  const values = data
    .map((item) => Number(item[fieldIndex]))
    .filter((v) => !isNaN(v))
    .sort((a, b) => a - b);
  console.log(`Values for field index ${fieldIndex}:`, values);
  const len = values.length;
  if (len === 0) return [];
  const min = values[0];
  const max = values[len - 1];
  const q1 = values[Math.floor(len * 0.25)];
  const median = values[Math.floor(len * 0.5)];
  const q3 = values[Math.floor(len * 0.75)];
  const result = [min, q1, median, q3, max];
  console.log(`Boxplot data for field index ${fieldIndex}:`, result);
  return result;
};

const chartOption = computed(() => {
  console.log("Chart Data:", props.chartData);
  console.log("Chart Config:", props.chartConfig);
  const baseOption = {
    title: {
      text: props.chartConfig.title || "Multi-Class Chart",
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        if (selectedChartType.value === "boxplot") {
          return `${params.seriesName}<br/>
            Max: ${params.data[5]}<br/>
            Q3: ${params.data[4]}<br/>
            Median: ${params.data[3]}<br/>
            Q1: ${params.data[2]}<br/>
            Min: ${params.data[1]}`;
        }
        const value = params.value[params.value.length - 1];
        let classIndex = thresholds.value.findIndex((t) => value <= t);
        if (classIndex === -1) {
          classIndex = thresholds.value.length;
        }
        return `(${params.value[0]}, ${params.value[1]})<br/>Class: ${
          classIndex + 1
        }`;
      },
    },
    legend: {
      data: props.chartConfig.yAxisFields,
      orient: "vertical",
      right: 10,
      top: "center",
    },
    xAxis: (() => {
      const xAxisConfig = {
        name: props.chartConfig.xAxisField,
        type: "value", // 기본값을 "value"로 설정
      };

      switch (selectedChartType.value) {
        case "boxplot":
          return {
            ...xAxisConfig,
            type: "category",
            data: [props.chartConfig.xAxisField],
          };
        case "scatter":
          var xRange = calculateDataRangeX(props.chartData, 0); // x값은 배열의 첫 번째 요소라고 가정
          return {
            ...xAxisConfig,
            min: xRange.min,
            max: xRange.max,
          };
        case "line":
          var xRange = calculateDataRangeX(props.chartData, 0); // x값은 배열의 첫 번째 요소라고 가정

          return {
            ...xAxisConfig,
            min: xRange.min,
            max: xRange.max,
          };
        case "bar":
          var xRange = calculateDataRangeX(props.chartData, 0); // x값은 배열의 첫 번째 요소라고 가정
          return {
            ...xAxisConfig,
            min: xRange.min,
            max: xRange.max,
          };
        default:
          return xAxisConfig;
      }
    })(),
    yAxis: (() => {
      const yAxisConfig = {
        type: "value",
        name:
          selectedChartType.value === "boxplot"
            ? "Value"
            : props.chartConfig.yAxisFields[0],
      };

      const yRange = calculateDataRangeY(
        props.chartData,
        selectedChartType.value,
        props.chartConfig.yAxisFields
      );
      return {
        ...yAxisConfig,
        min: yRange.min,
        max: yRange.max,
      };
    })(),

    dataZoom: [
      { type: "inside", xAxisIndex: [0], filterMode: "empty" },
      { type: "inside", yAxisIndex: [0], filterMode: "empty" },
      { type: "slider", xAxisIndex: [0], filterMode: "empty" },
      { type: "slider", yAxisIndex: [0], filterMode: "empty" },
    ],
  };

  if (selectedChartType.value === "boxplot") {
    console.log("Generating boxplot data");
    const boxplotSeries = props.chartConfig.yAxisFields.map((field, index) => {
      console.log(`Processing field: ${field} at index: ${index}`);
      const boxplotData = calculateBoxPlotData(props.chartData, index + 1);
      return {
        name: field,
        type: "boxplot",
        data: [boxplotData],
        itemStyle: {
          color: colors[index % colors.length],
        },
      };
    });
    console.log("Final boxplot series:", boxplotSeries);
    return {
      ...baseOption,
      series: boxplotSeries,
    };
  }
  return {
    ...baseOption,
    series: [
      {
        symbolSize: 10,
        data: props.chartData.map((item) => ({
          value: item,
          itemStyle: {
            color:
              colors[
                thresholds.value.findIndex((t) => item[item.length - 1] <= t) +
                  1
              ] || colors[0],
          },
        })),
        type: selectedChartType.value,
      },
    ],
  };
});

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

const calculateDataRangeX = (data) => {
  const values = data
    .map((item) => Number(item[0])) // X 값은 배열의 첫 번째 요소
    .filter((v) => !isNaN(v));
  return {
    min: Math.min(...values) * 0.99,
    max: Math.max(...values) * 1.01,
  };
};

const calculateDataRangeY = (data, selectedType, yAxisFields) => {
  let values = [];

  switch (selectedType) {
    case "boxplot":
      // boxplot의 경우 모든 y축 필드에 대한 min, max 값을 고려
      yAxisFields.forEach((field, index) => {
        const fieldData = calculateBoxPlotData(data, index + 1);
        values.push(fieldData[0]); // min
        values.push(fieldData[4]); // max
      });
      break;
    case "scatter":
    case "line":
    case "bar":
      // 기존 로직
      values = data
        .map((item) => Number(item[1])) // Y 값은 배열의 두 번째 요소
        .filter((v) => !isNaN(v));
      break;
    default:
      console.warn("Unsupported chart type for Y-axis range calculation");
      return { min: 0, max: 100 }; // 기본값 설정
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  // 여백 추가 (1% 정도)
  return {
    min: min * 0.99,
    max: max * 1.01,
  };
};
const onClick = (event) => {
  chartInstance = event.chartInstance;
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
