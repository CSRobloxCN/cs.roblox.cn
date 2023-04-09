import React, { useState, useEffect, useContext } from "react";
import { StatusChangeList } from "widgets/StatusChangeList";
import { useOktaAuth } from "@okta/okta-react";
import axios from "axios";
import { message, Breadcrumb, Layout } from "antd";
import config from "config";
import { ModeratorAccount } from "context/ModeratorAccount";
import { loading } from "helpers/promiseWithLoading";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";

const resourceServer = config.resourceServer;

const ModeratorTicketPage = () => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();

  let location = useLocation();
  let history = useHistory();
  let [ticketStatusHistories, setTicketStatusHistories] = useState(null);
  let [total, setTotal] = useState(null);
  let [page, setPage] = useState(1);
  let userInfo = useContext(ModeratorAccount);

  useEffect(() => {
    if (userInfo) {
      let initialPageNum = 1;
      if (location.search) {
        let pageNum = +location.search.split("?")[1].split("=")[1];
        initialPageNum = pageNum || 1;
      }
      setPage(initialPageNum);
      const accessToken = authState.accessToken.value;
      loading(
        getData(accessToken, initialPageNum).then(updateData)
      );
    }
  }, [userInfo, location.search]);

  let onPageChange = (newPage) => {
    history.push(`/mytickets?pageNum=${newPage}`);
  };

  let updateData = (res) => {
    if (res.status == 200) {
      if (res.data.error) {
        message.error(res.data.error);
        return;
      }
      setTicketStatusHistories(res.data.data.itemList);
      setTotal(res.data.data.total);
    } else {
      message.error("Request Failed");
    }
  };

  return (
    <div style={{padding:24}}>
      <Layout.Content
        style={{ background: "#fff", padding: "10px 28px", marginBottom: 12 }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("My Tickets")}</Breadcrumb.Item>
        </Breadcrumb>
      </Layout.Content>
      {ticketStatusHistories && (
        <StatusChangeList
          dataList={ticketStatusHistories}
          total={total}
          currentPage={page}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
function getData(accessToken, page) {
  let queryData = { pageNum: page, pageSize: 10, desc: true };
  return axios({
    method: "get",
    url: resourceServer.GetModeratorHistoryByID,
    params: queryData,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
export default ModeratorTicketPage;
