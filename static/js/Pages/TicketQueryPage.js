import React, { useState } from "react";
import { TicketQueryInput } from "widgets/TicketQueryInput";
import { TicketList } from "widgets/TicketList";
import { useOktaAuth } from "@okta/okta-react";
import axios from "axios";
import { message } from "antd";
import config from "config";
import { loading } from "helpers/promiseWithLoading";

const resourceServer = config.resourceServer;

const TicketPage = () => {
  const { authState } = useOktaAuth();

  let [events, setEvents] = useState(null);
  let [total, setTotal] = useState(null);
  let [page, setPage] = useState(1);
  let [queryObject, setQueryObject] = useState(null);

  let onQueryChange = (newQueryObject) => {
    setQueryObject(newQueryObject);
    setPage(1);
    const accessToken = authState.accessToken.value;
    loading(
      getData(newQueryObject, accessToken, page).then((res) => {
        if (res.status == 200) {
          if (res.data.error) {
            message.error(res.data.error);
            return;
          }
          setEvents(res.data.data.itemList);
          setTotal(res.data.data.total);
        } else {
          message.error("Request Failed");
        }
      })
    );
  };

  let onPageChange = (newPage) => {
    setPage(newPage);
    const accessToken = authState.accessToken.value;
    loading(
      getData(queryObject, accessToken, newPage).then((res) => {
        if (res.status == 200) {
          if (res.data.error) {
            message.error(res.data.error);
            return;
          }
          setEvents(res.data.data.itemList);
          setTotal(res.data.data.total);
        } else {
          message.error("Request Failed");
        }
      })
    );
  };

  return (
    <div style={{padding:24}}>
      <TicketQueryInput onChange={onQueryChange} />
      {events && (
        <TicketList
          events={events}
          eventType={queryObject.eventType}
          total={total}
          currentPage={page}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
function getData(queryObject, accessToken, page) {
  let queryData = Object.assign({}, queryObject);
  if (queryData.startUtc) {
    queryData.startUtc = queryData.startUtc.format("x");
  }
  if (queryData.endUtc) {
    queryData.endUtc = queryData.endUtc.format("x");
  }
  queryData.eventType = undefined;
  queryData.pageNum = page;
  queryData.pageSize = 10;
  return axios({
    method: "get",
    url: resourceServer[queryObject.eventType],
    params: queryData,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
export default TicketPage;
