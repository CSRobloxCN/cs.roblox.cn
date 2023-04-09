import config from "config";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { getData } from "helpers/httpRequest";
import { useOktaAuth } from "@okta/okta-react";
import { useLocation } from "react-router-dom";
import parseSearch from "helpers/parseSearch";
import { parseDateTimeWithTimeZone } from "utils";
import React, { useEffect, useState } from "react";

import {
  message,
  PageHeader,
  Divider,
  Table,
  Row,
  Col,
  Layout,
  Card,
} from "antd";
const { Content } = Layout;

const resourceServer = config.resourceServer;

const pageSize = 10;

// This Page is to show all the UpdateWhitelist history for target asset or bundle
// The history actions currrently contain "CreateTickets", "Add into whitelite", "Remove from whitelist"
const AssetWhitelistHistoryPage = () => {
  const { authState } = useOktaAuth();
  const [logs, setLogs] = useState([]);
  let [total, setTotal] = useState(0);
  let [page, setPage] = useState(1);
  const { t } = useTranslation();

  const searchString = useLocation().search;
  const searchStringObject = parseSearch(searchString);

  const { Asset, Bundle } = searchStringObject;
  let [type, id] = Asset ? ["Asset", Asset] : ["Bundle", Bundle];
  let title = t(type) + ":" + id + " " + t("Whitelist Record");

  let onPageChange = (newPage) => {
    setPage(newPage);
  };

  const refresh = async () => {
    const accessToken = authState.accessToken.value;
    let url = resourceServer["AllowlistUpdateHistory"];

    let queryData = { assetId: id, pageNum: page, pageSize: pageSize };
    let res = await getData(url, queryData, accessToken);

    if (res.status == 200) {
      if (res.data.error) {
        message.error(res.data.error.description);
        return;
      }
      setLogs(res.data.data.items);
      setTotal(res.data.data.total);
    } else {
      message.error(t("Search Fail"));
    }
  };

  const columns = [
    {
      title: t("ActionTime"),
      dataIndex: "createdUtc",
      key: "createdUtc",
      width: "10%",
      render: (createdUtc) =>
        parseDateTimeWithTimeZone(moment.utc(createdUtc).toDate())
    },
    {
      title: t("Operator"),
      dataIndex: "operatorEmail",
      key: "operatorEmail",
      width: "10%",
    },
    {
      title: t("ActionContent"),
      dataIndex: "action",
      key: "action",
      PageHeader,
      width: "10%",
      render: t,
    },
  ];

  useEffect(() => {
    refresh();
  }, [page]);

  return (
    <Layout>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <PageHeader title={title}></PageHeader>
        <Divider />
        {logs && (
          <Card bordered={false}>
            <Row>
              <Col span={24}>
                <Table
                  key="AssetsAllowlistLogTable"
                  dataSource={logs}
                  columns={columns}
                  size="small"
                  bordered
                  rowKey={(record) => record.createdUtc}
                  pagination={{
                    total: total,
                    current: page,
                    position: ["bottomRight"],
                    pageSize: pageSize,
                    onChange: onPageChange,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                  }}
                />
              </Col>
            </Row>
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default AssetWhitelistHistoryPage;
