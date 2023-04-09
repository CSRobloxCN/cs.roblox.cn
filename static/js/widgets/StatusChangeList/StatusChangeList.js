import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Table } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";

const StatusChangeList = ({ dataList, total, currentPage, onPageChange }) => {
  const { t } = useTranslation();
  let columns = [
    {
      title: t("Ticket ID"),
      key: "ticketId",
      render: function ticketIdColumn(data) {
        return (
          <Link
            to={{
              pathname: "/ticket",
              search: `?ticketId=${data.ticketId}`,
              state: { pageNum: currentPage },
            }}
          >
            <Button type="link">{data.ticketId}</Button>
          </Link>
        );
      },
    },
    {
      title: t("Moderator ID"),
      key: "ticketId",
      dataIndex: "moderatorId",
    },
    {
      title: t("Status"),
      key: "ticketId",
      dataIndex: "status",
    },
    {
      title: t("Created Time"),
      key: "ticketId",
      render: (data) => moment.utc(data.createdUtc).toDate().toLocaleString(),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataList}
      bordered
      rowKey="ticketId"
      size="small"
      style={{ marginTop: 24 }}
      pagination={{
        total,
        current: currentPage,
        pageSize: 10,
        onChange: onPageChange,
        hideOnSinglePage: true,
      }}
    ></Table>
  );
};

export default StatusChangeList;
