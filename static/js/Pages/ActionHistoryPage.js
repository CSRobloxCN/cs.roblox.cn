import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  SearchCriteriaSelector,
  GetActionHistoryCols,
} from "widgets/ActionHistory";
import {
  Layout,
  Typography,
  Card,
  message,
  Skeleton,
  Row,
  Table,
  Divider,
} from "antd";
import { ModeratorAccount } from "context/ModeratorAccount";
import { useOktaAuth } from "@okta/okta-react";
import { getData } from "helpers/httpRequest";
import config from "config";

const { Content } = Layout;
const { Title } = Typography;

const ActionHistoryPage = () => {
  const { t } = useTranslation();
  const moderatorInfo = useContext(ModeratorAccount);
  const { authState } = useOktaAuth();
  const [actionHistory, setActionHistory] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [searchParams, setSearchParams] = useState({});
  const columns = GetActionHistoryCols(t);

  if (!moderatorInfo) return <Skeleton active />;

  const handleSearchParamsChange = () => {
    setPagination({
      current: 1,
      pageSize: 10,
    });
  };

  const handleOnSearch = async (params) => {
    setSearchParams({ ...params });
    await fetch(params, pagination);
  };

  const handleTableChange = async (p) => {
    await fetch(searchParams, p);
  };

  const fetch = async (searchParams, p) => {
    const hide = message.loading("loading...", 0);
    const response = await getData(
      config.resourceServer.GetUserManagementActionHistory,
      {
        ...searchParams,
        pageNum: p.current,
        pageSize: p.pageSize,
      },
      authState.accessToken.value
    );
    hide();

    const { data } = response;
    if (data && !data.error) {
      const items = data && data.data && data.data.items;
      const total = data && data.data && data.data.total;
      setActionHistory(items);
      setPagination({
        ...p,
        total,
      });
    }
  };

  return (
    <Layout>
      <Content
        style={{
          margin: 0,
          minHeight: "280px",
          padding: "24px",
          background: "#fff",
        }}
      >
        <Card bordered={false}>
          <Title level={4}>{t("Action History")}</Title>
          <SearchCriteriaSelector
            t={t}
            search={handleOnSearch}
            handleSearchParamsChange={handleSearchParamsChange}
          />
          {actionHistory && actionHistory.length > 0 && (
            <Row>
              <Divider />
              <Table
                rowKey={(record) => record.guId}
                columns={columns}
                dataSource={actionHistory}
                pagination={pagination}
                onChange={handleTableChange}
              />
            </Row>
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default ActionHistoryPage;
