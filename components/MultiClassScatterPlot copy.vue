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
        const index = thresholds.value.findIndex((t) => params.value[2] <= t);
        return `(${params.value[0]}, ${params.value[1]})<br/>Class: ${
          index === -1 ? "Class 1" : `Class ${index + 1}`
        }`;
      },
    },
    legend: {
      data: props.chartConfig.yAxisFields,
      orient: "vertical",
      right: 10,
      top: "center",
    },
    xAxis: {
      type: "category",
      data:
        selectedChartType.value === "boxplot"
          ? [props.chartConfig.xAxisField]
          : undefined,
      name: props.chartConfig.xAxisField,
    },
    yAxis: {
      type: "value",
      name:
        selectedChartType.value === "boxplot"
          ? "Value"
          : props.chartConfig.yAxisFields[0],
    },
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
              colors[thresholds.value.findIndex((t) => item[2] <= t) + 1] ||
              colors[0],
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

const onClick = (event) => {
  chartInstance = event.chartInstance;
};
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
