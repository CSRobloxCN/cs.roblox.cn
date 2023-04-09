import React, { useEffect } from "react";
import * as echarts from "echarts";
const TwoAxisBarChart = ({ labels, datas }) => {
  let container = React.createRef();
  useEffect(() => {
    let chart = echarts.init(container.current);
    chart.setOption(buildChartOption(labels, datas));
    return () => chart.dispose();
  }, [labels, datas]);
  return <div ref={container} style={{ width: "100%", height: "300px" }}></div>;
};

function buildChartOption(labels, datas) {
  if (!labels || !datas) return {};
  let chartData = datas.map((v) => {
    return {
      data: v.data,
      name:v.name,
      type: "bar",
      label: {
        show: true,
        position: "top",
        // formatter:"{a}:{c}",
        formatter:"{c}",
        rotate:"54"
      },
    };
  });
  return {
    xAxis: {
      type: "category",
      data: labels,
      boundaryGap: ["5%", "5%"],
      splitLine: {
        show: true,
      },
      axisLabel: {
        show: true,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
      },
    },
    series: chartData,
  };
}
export default TwoAxisBarChart;
