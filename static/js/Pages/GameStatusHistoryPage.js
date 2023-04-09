import React, { useState, useContext } from "react";
import { TimeRangePicker } from "components/TimeRangePicker";
import { GameStatusChart } from "widgets/GameStatusChart";
import { GameStatusHistoryList } from "widgets/GameStatusHistoryList";
import { useOktaAuth } from "@okta/okta-react";
import axios from "axios";
import config from "config";
import { ModeratorAccount } from "context/ModeratorAccount";
import { Input, message, Space, Button } from "antd";
import { useTranslation } from "react-i18next";
import { loading } from "helpers/promiseWithLoading";

const resourceServer = config.resourceServer;

const GameStatusHistoryPage = () => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  let userInfo = useContext(ModeratorAccount);
  let [timeRange, setTimeRange] = useState(null);
  let [statusHistories, setStatusHistories] = useState();
  let [total, setTotal] = useState(null);
  let [page, setPage] = useState(1);
  let [gameId, setGameId] = useState(null);
  let [showGameStatusChart, setShowGameStatusChart] = useState(false);

  if (!userInfo) return null;

  let onPageChange = (newPage) => {
    setPage(newPage);
    const accessToken = authState.accessToken.value;
    loading(
      getData(accessToken, newPage, timeRange, gameId)
        .then(requestCallback)
        .then(() => {
          if (gameId) {
            setShowGameStatusChart(true);
          } else {
            setShowGameStatusChart(false);
          }
        })
    );
  };

  let onTimeRangeChange = (moments) => {
    setTimeRange(moments);
  };

  let onGameIdChange = (gameId) => {
    setGameId(gameId);
  };
  let submit = () => {
    const accessToken = authState.accessToken.value;
    loading(
      getData(accessToken, 1, timeRange, gameId)
        .then(requestCallback)
        .then(() => {
          if (gameId) {
            setShowGameStatusChart(true);
          } else {
            setShowGameStatusChart(false);
          }
        })
    );
  };
  function requestCallback(res) {
    if (res.status == 200) {
      if (res.data.error) {
        message.error(res.data.error);
        return;
      }
      setStatusHistories(res.data.data.itemList);
      setTotal(res.data.data.total);
    } else {
      message.error("Request Failed");
    }
  }
  return (
    <div style={{padding:24}}>
      <Space>
        <label>{t("Time Range")} : </label>
        <TimeRangePicker onChange={onTimeRangeChange} />
        <label>{t("Game ID")} : </label>
        <Input
          value={gameId}
          onChange={(event) => onGameIdChange(event.target.value)}
        />
        <Button type="primary" onClick={submit}>
          {t("Search")}
        </Button>
      </Space>
      {showGameStatusChart && (
        <GameStatusChart gameStatusList={statusHistories} />
      )}
      <GameStatusHistoryList
        dataList={statusHistories}
        total={total}
        currentPage={page}
        onPageChange={onPageChange}
      />
    </div>
  );
};

function getData(accessToken, page, timeRange, gameId) {
  let params = {
    pageNum: page,
    pageSize: 100,
    startUtc: timeRange ? timeRange[0] : null,
    endUtc: timeRange ? timeRange[1] : null,
  };
  let url = gameId
    ? resourceServer.GetLuobuGameStatusHistoryByGameId(gameId)
    : resourceServer.GetLuobuGamesStatusHistories;
  return axios({
    method: "get",
    url,
    params,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export default GameStatusHistoryPage;
