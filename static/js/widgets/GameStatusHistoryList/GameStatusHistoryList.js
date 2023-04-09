import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import moment from "moment";

const GameStatusHistoryList = ({
  dataList,
  total,
  currentPage,
  onPageChange,
}) => {
  const { t } = useTranslation();
  let columns = [
    {
      title: t("Game ID"),
      dataIndex: "gameId",
    },
    {
      title: t("Old Whitelist Status"),
      dataIndex: "previousWhiteListStatus",
    },
    {
      title: t("New Whitelist Status"),
      dataIndex: "whiteListStatus",
    },
    {
      title: t("Created Time"),
      render: (data) => moment.utc(data.createdUtc).toDate().toLocaleString(),
    },
  ];
  return (
    <Table
      dataSource={dataList}
      columns={columns}
      bordered
      rowKey={record => record.gameId + record.createdUtc}
      size="small"
      style={{ marginTop: 24 }}
      pagination={{
        total,
        current: currentPage,
        pageSize: 100,
        onChange: onPageChange,
        hideOnSinglePage: true,
        showSizeChanger: false,
      }}
    />
  );
};

export default GameStatusHistoryList;
