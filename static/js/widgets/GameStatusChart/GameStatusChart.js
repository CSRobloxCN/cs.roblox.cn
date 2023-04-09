import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as echarts from "echarts";
import moment from "moment";

const GameStatusChart = ({ gameStatusList }) => {
  const { t } = useTranslation();
  let container = React.createRef();
  useEffect(() => {
    let chart = echarts.init(container.current);
    chart.setOption(buildChartOption(gameStatusList, t));
    return () => chart.dispose();
  },[gameStatusList]);
  return <div ref={container} style={{ width: "100%", height: "300px" }}></div>;
};

function buildChartOption(statusList, t) {
  if (!statusList) return {};
  let data = statusList
    .map((status) => {
      return [
        [
          moment(status.createdUtc).subtract(5, "minutes").toISOString(),
          t(status.previousWhiteListStatus),
        ],
        [moment(status.createdUtc).toISOString(), t(status.whiteListStatus)],
      ];
    })
    .reduce((pre, cur) => pre.concat(cur), []).sort((a,b)=>moment(a[0])-moment(b[0]));
  console.log(data);
  return {
    visualMap: {
      show: false,
      type: "piecewise",
      pieces: [
        { lte: 0, color: "black" },
        { lte: 1, color: "#cc0000" },
        { lte: 2, color: "#ff9933" },
        { lte: 3, color: "#33cc33" },
      ],
    },
    xAxis: {
      type: "time",
      boundaryGap: ["5%", "5%"],
      splitLine:{
        show:true
      }
    },
    yAxis: {
      type: "category",
      data: [
        t("Approved"),
        t("InReview"),
        t("Rejected"),
        t("Unknown"),
      ].reverse(),
      splitLine:{
        show:true
      },
      axisTick:{
        alignWithLabel:true
      }
    },
    series: [
      {
        data: data,
        type: "line",
        symbolSize:10,
        // step:"end",
        label:{show:true,formatter:"{b}"}
      },
    ],
  };
}

export default GameStatusChart;
