import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Table } from "antd";
import { Link } from "react-router-dom";

const ModeratorReviewDataList = ({
  dataList,
  total,
  currentPage,
  onPageChange,
  startTime,
  endTime,
  pageSize,
}) => {
  const { t } = useTranslation();
  let columns = [
    {
      title: t("Moderator ID"),
      dataIndex: "moderatorId",
      key: "moderatorId",
      sorter: (a, b) => a.moderatorId - b.moderatorId,
    },
    {
      title: t("Moderator Email"),
      dataIndex: "moderatorEmail",
      key: "moderatorEmail",
    },
    {
      title: t("Locked Ticket Number"),
      dataIndex: "lockedTicketNumber",
      key: "lockedTicketNumber",
      sorter: (a, b) => a.lockedTicketNumber - b.lockedTicketNumber,
    },
    {
      title: t("Finished Ticket Number"),
      key: "finishedTicketNumber",
      sorter: (a, b) => a.finishedTicketNumber - b.finishedTicketNumber,
      render: function ticketIdColumn(data) {
        let searchString = `?moderatorId=${data.moderatorId}&pageSize=${pageSize}`;
        if (startTime) {
          searchString += `&startTime=${startTime}`;
        }
        if (endTime) {
          searchString += `&endTime=${endTime}`;
        }
        return (
          <Link
            to={{
              pathname: "/moderator-finished-ticket-review",
              search: searchString,
            }}
            target="_blank"
          >
            <Button type="link">{data.finishedTicketNumber}</Button>
          </Link>
        );
      },
    },
    {
      title: t("Reopened Ticket Number"),
      key: "reopenedTicketNumber",
      sorter: (a, b) => a.reopenedTicketNumber - b.reopenedTicketNumber,
      render: function ticketIdColumn(data) {
        let searchString = `?moderatorId=${data.moderatorId}&pageSize=${pageSize}`;
        if (startTime) {
          searchString += `&startTime=${startTime}`;
        }
        if (endTime) {
          searchString += `&endTime=${endTime}`;
        }
        return (
          <Link
            to={{
              pathname: "/moderator-reopened-ticket-review",
              search: searchString,
            }}
            target="_blank"
          >
            <Button type="link">{data.reopenedTicketNumber}</Button>
          </Link>
        );
      },
    },
    {
      title: t("Average Game Review Time(sec)"),
      dataIndex: "averageGameRevTimeInSec",
      key: "averageGameRevTimeInSec",
      sorter: (a, b) => a.averageGameRevTimeInSec - b.averageGameRevTimeInSec,
    },
    {
      title: t("Average User Review Time(sec)"),
      dataIndex: "averageUserRevTimeInSec",
      key: "averageUserRevTimeInSec",
      sorter: (a, b) => a.averageUserRevTimeInSec - b.averageUserRevTimeInSec,
    },
    {
      title: t("Average Name Review Time(sec)"),
      dataIndex: "averageNameRevTimeInSec",
      key: "averageNameRevTimeInSec",
      sorter: (a, b) => a.averageNameRevTimeInSec - b.averageNameRevTimeInSec,
    },
    {
      title: t("Average GameInfo Review Time(sec)"),
      dataIndex: "averageGameInfoRevTimeInSec",
      key: "averageGameInfoRevTimeInSec",
      sorter: (a, b) => a.averageGameInfoRevTimeInSec - b.averageGameInfoRevTimeInSec,
    },
    {
      title: t("Average Asset Review Time(sec)"),
      dataIndex: "averageAssetRevTimeInSec",
      key: "averageAssetRevTimeInSec",
      sorter: (a, b) => a.averageAssetRevTimeInSec - b.averageAssetRevTimeInSec,
    },
  ];
  return (
    <Table
      dataSource={dataList}
      columns={columns}
      bordered
      size="small"
      style={{ marginTop: 24 }}
      rowKey={(moderator) => moderator.moderatorId}
      pagination={{
        total,
        current: currentPage,
        pageSize: pageSize,
        onChange: onPageChange,
        hideOnSinglePage: false,
        showSizeChanger: false,
      }}
    />
  );
};

export default ModeratorReviewDataList;
