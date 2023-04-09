import React, { useState } from "react";
import { GameIdListQueryInput } from "widgets/GameIdListQueryInput";
import { GameIdListTable } from "widgets/GameIdListTable";
import { useOktaAuth } from "@okta/okta-react";
import config from "config";
import { message } from "antd";
import { loading } from "helpers/promiseWithLoading";
import { getData } from "helpers/httpRequest";

const resourceServer = config.resourceServer;

const GameIdList = () => {
  const { authState } = useOktaAuth();

  let [gameIdList, setGameIdList] = useState(null);
  let [total, setTotal] = useState(null);
  let [page, setPage] = useState(1);
  let [queryObject, setQueryObject] = useState(null);

  let url = resourceServer.GetGameIdList;

  let onQueryChange = (newQueryObject) => {
    setQueryObject(newQueryObject);
    setPage(1);
    const accessToken = authState.accessToken.value;
    loading(
      getData(url, getParams(page, newQueryObject), accessToken)
      .then(requestCallback)
    );
  };

  let onPageChange = (newPage) => {
    setPage(newPage);
    const accessToken = authState.accessToken.value;
    loading(
      getData(url, getParams(newPage, queryObject), accessToken)
      .then(requestCallback)
    );
  };

  function requestCallback(res) {
    if (res.status == 200) {
      if (res.data.error) {
        message.error(res.data.error);
        return;
      }
      setGameIdList(res.data.data.itemList);
      setTotal(res.data.data.total);
    } else {
      message.error("Request Failed");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <GameIdListQueryInput onChange={onQueryChange} />
      { gameIdList && (<GameIdListTable
          dataList = {gameIdList}
          total = {total}
          currentPage = {page}
          onPageChange = {onPageChange}
        />
      )}
    </div>
  );
};

function getParams(page, queryObject) {
  let params = {
    pageNum: page,
    pageSize: 10,
    desc: queryObject.desc,
    status: queryObject.status
  };
  return params;
}

export default GameIdList;
