// export const getBoxplotChartOption = (config, chartData) => {
//   console.log("Generating boxplot data");
//   const boxplotSeries = config.yAxisFields.map((field, index) => {

//     const boxplotData = calculateBoxPlotData(chartData, index);
//     return {
//       name: field,
//       type: "boxplot",
//       data: [[boxplotData]],
//       itemStyle: {
//         color: getColor(index, config.thresholds),
//       },
//     };
//   });

//   return {
//     title: { text: config.title || "Boxplot Chart" },
//     tooltip: {
//       trigger: "item",
//       formatter: (params) => `${params.seriesName}<br/>
//         Max: ${params.data[5]}<br/>
//         Q3: ${params.data[4]}<br/>
//         Median: ${params.data[3]}<br/>
//         Q1: ${params.data[2]}<br/>
//         Min: ${params.data[1]}`,
//     },
//     xAxis: { type: "category", data: [config.xAxisField] },
//     yAxis: { type: "value", name: "Value" },
//     series: boxplotSeries,
//   };
// };

// // calculateBoxPlotData 함수를 필드 이름으로 데이터를 찾도록 수정
// const calculateBoxPlotData = (data, index) => {
//   console.log(`Calculating boxplot for index: ${index}`);
//   console.log(`Input data:`, data);

//   const values = data
//     .map((item) => Number(item[index + 1]))
//     .filter((v) => !isNaN(v))
//     .sort((a, b) => a - b);

//   const len = values.length;
//   if (len === 0) {
//     console.warn(`No valid data for value: ${index}`);
//     return [];
//   }

//   const min = values[0];
//   const max = values[len - 1];
//   const q1 = values[Math.floor(len * 0.25)];
//   const median = values[Math.floor(len * 0.5)];
//   const q3 = values[Math.floor(len * 0.75)];

//   const result = [min, q1, median, q3, max];
//   console.log(`Boxplot data for ${field}:`, result);

//   return result;
// };

// export const getBoxplotChartOption = (config, chartData) => {
//   console.log("Generating boxplot data");
//   console.log("Input chartData:", chartData);

//   const boxplotSeries = config.yAxisFields.map((field, index) => {
//     const boxplotData = calculateBoxPlotData(chartData, index);
//     return {
//       name: field,
//       type: "boxplot",
//       data: [boxplotData],
//       itemStyle: {
//         color: getColor(index, config.thresholds),
//       },
//     };
//   });

//   console.log("Generated boxplotSeries:", boxplotSeries);

//   return {
//     title: { text: config.title || "Boxplot Chart" },
//     tooltip: {
//       trigger: "item",
//       formatter: (params) => {
//         return `${params.seriesName}<br/>
//         Max: ${params.data[5]}<br/>
//         Q3: ${params.data[4]}<br/>
//         Median: ${params.data[3]}<br/>
//         Q1: ${params.data[2]}<br/>
//         Min: ${params.data[1]}`;
//       },
//     },
//     xAxis: { type: "category", data: config.yAxisFields },
//     yAxis: { type: "value", name: "Value" },
//     dataZoom: [
//       {
//         type: "inside",
//         yAxisIndex: [0],
//         filterMode: "filter",
//       },
//       {
//         type: "slider",
//         yAxisIndex: [0],
//         filterMode: "filter",
//       },
//     ],
//     series: boxplotSeries,
//   };
// };

export const getBoxplotChartOption = (config, chartData) => {
  console.log("Generating boxplot data");
  console.log("Input chartData:", chartData);

  const boxplotSeries = config.yAxisFields.map((field, index) => {
    const boxplotData = calculateBoxPlotData(chartData, index);
    return {
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
      name: field,
      type: "boxplot",
      data: [boxplotData],
      itemStyle: {
        color: getColor(index, config.thresholds),
      },
    };
  });

  console.log("Generated boxplotSeries:", boxplotSeries);

  return {
    title: { text: config.title || "Boxplot Chart" },
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        return `${params.seriesName}<br/>
        Max: ${params.data[5]}<br/>
        Q3: ${params.data[4]}<br/>
        Median: ${params.data[3]}<br/>
        Q1: ${params.data[2]}<br/>
        Min: ${params.data[1]}`;
      },
    },
    xAxis: { type: "category", data: [config.xAxisField] },
    yAxis: { type: "value", name: "Value" },
    series: boxplotSeries,
  };
};

const calculateBoxPlotData = (data, columnIndex) => {
  console.log(`Calculating boxplot for column index: ${columnIndex}`);

  // 특정 열(필드)의 데이터만 추출
  const values = data
    .map((row) => Number(row[columnIndex + 1]))
    .filter((v) => !isNaN(v))
    .sort((a, b) => a - b);

  console.log(`Processed values:`, values);

  const len = values.length;
  if (len === 0) {
    console.warn(`No valid data for column index: ${columnIndex}`);
    return [];
  }

  const min = values[0];
  const max = values[len - 1];
  const q1 = values[Math.floor(len * 0.25)];
  const median = values[Math.floor(len * 0.5)];
  const q3 = values[Math.floor(len * 0.75)];

  const result = [min, q1, median, q3, max];
  console.log(`Boxplot data for column ${columnIndex}:`, result);

  return result;
};

// getColor 함수는 그대로 사용한다고 가정
