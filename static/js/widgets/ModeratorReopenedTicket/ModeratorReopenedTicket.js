import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Layout, Input, message, Space, Button, PageHeader } from "antd";
import "antd/dist/antd.css";
import config from "config";
import axios from "axios";

import ModeratorReopenedTicketModel from "./ModeratorReopenedTicketModel";
import { loading } from "helpers/promiseWithLoading";
import { TimeRangePicker } from "components/TimeRangePicker";
import parseSearch from "helpers/parseSearch";

const resourceServer = config.resourceServer;

const ModeratorReopenedTicket = () => {
  const { authState } = useOktaAuth();
  const { t } = useTranslation();
  const DEFAULT_PAGE_NUMBER  = 1;

  const searchString = useLocation().search;
  const searchStringObject = parseSearch(searchString);
  const { moderatorId, pageSize, startTime, endTime } = searchStringObject;
  let [timeRange, setTimeRange] = useState([startTime, endTime]);
  let [ticketId, setTicketId] = useState(null);
  // This is the data returned by moderation service
  let [moderatorReopenedTicketData, setModeratorReopenedTicketData] = useState(
    []
  );
  let [total, setTotal] = useState(null);
  let [currentPage, setPage] = useState(DEFAULT_PAGE_NUMBER);
  
  useEffect(() => {
    if (moderatorId) {
      const accessToken = authState.accessToken.value;
      loading(
        getData(
          accessToken,
          moderatorId,
          timeRange,
          currentPage,
          ticketId,
          pageSize
        ).then(requestCallback)
      );
    }
  }, [moderatorId]);

  function requestCallback(res) {
    if (res.status == 200) {
      if (res.data.error) {
        message.error(res.data.error.description);
        return;
      }
      setModeratorReopenedTicketData(res.data.data.items);
      setTotal(res.data.data.total);
    } else {
      message.error("Request Failed");
    }
  }

  let onTicketIdChange = (value) => {
    // This is to remove all whitespace that are mis-typed by the moderator
    let ticketId = value;
    ticketId = ticketId.replace(/\s/g, "");
    // This is to remove tab in the string
    ticketId = ticketId.replace(/\t/g, "");
    // This is to make sure that if moderatorID/moderatorEmail is empty string,
    // it is set to be null, instead of [null]/['']
    ticketId = ticketId ? ticketId : null;
    setTicketId(ticketId);
  };

  let onPageChange = (newPage) => {
    setPage(newPage);
    const accessToken = authState.accessToken.value;
    loading(
      getData(accessToken, moderatorId, timeRange, newPage, ticketId, pageSize).then(
        requestCallback
      )
    );
  };

  let onTimeRangeChange = (moments) => {
    setTimeRange(moments);
  };

  let onClick = () => {
    const accessToken = authState.accessToken.value;
    setPage(DEFAULT_PAGE_NUMBER);
    loading(
      getData(accessToken, moderatorId, timeRange, currentPage, ticketId,pageSize).then(
        requestCallback
      )
    );
  };
  return (
    <Layout>
        <PageHeader
          className="site-page-header"
          title={
            t("Moderator") + `  (${moderatorId})  ` + t("Reopened Tickets")
          }
        />
        <Space>
          <label>{t("Time Range (The smallest unit is hour)")} : </label>
          <TimeRangePicker 
          onChange={onTimeRangeChange}
          defaultValue = {timeRange}
          />
          <label>{t("Ticket ID")} : </label>
          <Input
            value={ticketId}
            onChange={(event) => onTicketIdChange(event.target.value)}
          />
          <Button type="primary" onClick={onClick}>
            {t("Search")}
          </Button>
        </Space>
        <ModeratorReopenedTicketModel
          dataList={moderatorReopenedTicketData}
          total={total}
          currentPage={currentPage}
          onPageChange={onPageChange}
          pageSize={pageSize}
        />
    </Layout>
  );
};

function getData(accessToken, moderatorId, timeRange, page, ticketId,pageSize) {
  let params = {
    moderatorId,
    ticketId,
    pageNum: page,
    pageSize: pageSize,
  };
  // if UI Service receive the null value of startTime, it can not be converted into system.DateTime
  // This is to make sure that server will not reponse 400 bad request
  if (timeRange && timeRange[0] && timeRange[1]) {
    params["startTime"] = timeRange[0];
    params["endTime"] = timeRange[1];
  }
  let url = resourceServer.GetModeratorReopenedTicketData;
  return axios({
    method: "get",
    url,
    params,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export default ModeratorReopenedTicket;
