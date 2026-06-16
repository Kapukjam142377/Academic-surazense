import React from "react";
import ReactECharts from "echarts-for-react";

// Memoized ECharts component to bypass React's Virtual DOM diffing during fast real-time sweeps
const QcmChart = React.memo(({ option }) => {
  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      notMerge={true}
    />
  );
});

export default QcmChart;
