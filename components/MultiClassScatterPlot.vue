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

const getClassIndex = (value) => {
  return thresholds.value.findIndex((t) => value <= t) + 1;
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
        const xValue = params.value[0];
        const yValues = params.value.slice(1, -1);
        const classValue = params.value[params.value.length - 1].classValue;
        const classIndex = getClassIndex(classValue);

        let tooltipText = `${props.chartConfig.xAxisField}: ${xValue}<br/>`;
        props.chartConfig.yAxisFields.forEach((field, index) => {
          tooltipText += `${field}: ${yValues[index]}<br/>`;
        });
        tooltipText += `${props.chartConfig.classField}: ${classValue}<br/>`;
        tooltipText += `Class: ${classIndex}`;

        return tooltipText;
      },
    },
    legend: {
      data: ["Class 1", "Class 2", "Class 3", "Class 4"],
      orient: "vertical",
      right: 10,
      top: "center",
    },
    xAxis: {
      name: props.chartConfig.xAxisField,
      type: "value",
    },
    yAxis: {
      name: props.chartConfig.yAxisFields[0],
      type: "value",
    },
    dataZoom: [
      { type: "inside", xAxisIndex: [0], filterMode: "empty" },
      { type: "inside", yAxisIndex: [0], filterMode: "empty" },
      { type: "slider", xAxisIndex: [0], filterMode: "empty" },
      { type: "slider", yAxisIndex: [0], filterMode: "empty" },
    ],
  };

  if (selectedChartType.value === "boxplot") {
    // Boxplot logic here (needs to be implemented)
  } else {
    const series = [1, 2, 3, 4].map((classIndex) => ({
      name: `Class ${classIndex}`,
      type: selectedChartType.value,
      symbolSize: 10,
      data: props.chartData
        .filter(
          (item) =>
            getClassIndex(item[item.length - 1].classValue) === classIndex
        )
        .map((item) => item),
      itemStyle: {
        color: colors[classIndex - 1],
      },
    }));

    return {
      ...baseOption,
      series,
    };
  }
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
