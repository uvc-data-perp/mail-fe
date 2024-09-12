// chartUtils.js

export const calculateDataRangeX = (chartData) => {
  const values = chartData
    .map((item) => Number(item[0]))
    .filter((v) => !isNaN(v));
  return {
    min: Math.min(...values) * 0.99,
    max: Math.max(...values) * 1.01,
  };
};

export const calculateDataRangeY = (chartData, config) => {
  let values = [];
  config.yAxisFields.forEach((field, index) => {
    const fieldValues = chartData
      .map((item) => Number(item[index + 1]))
      .filter((v) => !isNaN(v));
    values = values.concat(fieldValues);
  });

  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    min: min * 0.99,
    max: max * 1.01,
  };
};

export const getColor = (value, thresholds) => {
  const colors = ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae"];
  const index = thresholds.findIndex((t) => value <= t);
  return colors[index !== -1 ? index : colors.length - 1];
};

export const getScatterChartOption = (config, data) => {
  const xRange = calculateDataRangeX(data);
  const yRange = calculateDataRangeY(data, config);

  return {
    title: {
      text: config.title || "Multi-Class Scatter Plot",
    },
    dataZoom: [
      {
        id: "dataZoomX",
        type: "slider",
        xAxisIndex: [0],
        filterMode: "filter", // Set as 'filter' so that the modification
        // of window of xAxis will effect the
        // window of yAxis.
        start: 0,
        end: 100,
      },
      {
        id: "dataZoomY",
        type: "slider",
        yAxisIndex: [0],
        filterMode: "empty",
        start: 0,
        end: 100,
      },
    ],
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        const value = params.value[params.value.length - 1];
        let classIndex = config.thresholds.findIndex((t) => value <= t);
        if (classIndex === -1) {
          classIndex = config.thresholds.length;
        }
        return `(${params.value[0]}, ${params.value[1]})<br/>Class: ${
          classIndex + 1
        }`;
      },
    },
    xAxis: {
      name: config.xAxisField,
      type: "value",
      min: xRange.min,
      max: xRange.max,
    },
    yAxis: {
      name: config.yAxisFields[0],
      type: "value",
      min: yRange.min,
      max: yRange.max,
    },
    series: [
      {
        symbolSize: 10,
        data: data.map((item) => ({
          value: item,
          itemStyle: {
            color: getColor(item[item.length - 1], config.thresholds),
          },
        })),
        type: "scatter",
      },
    ],
    // 기타 필요한 옵션들...
  };
};
