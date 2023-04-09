import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import { parseDateTimeWithTimeZone } from "utils";
import moment from "moment";

const GameIdListTable = ({
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
      title: t("Updated Time"),
      render: (data) => parseDateTimeWithTimeZone(moment.utc(data.updatedUtc).toDate()),
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
        pageSize: 10,
        onChange: onPageChange,
        hideOnSinglePage: true,
        showSizeChanger: false,
      }}
    ></Table>
  );
};

export default GameIdListTable;
