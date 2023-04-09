import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";
import converUtcToLocal from "helpers/convertUtcTimeToLocalTime";
import moment from "moment";

const ModeratorReopenedTicketModel = ({
  dataList,
  total,
  currentPage,
  onPageChange,
  pageSize
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
      title: t("Ticket ID"),
      dataIndex: "ticketId",
      key: "ticketId",
      sorter: (a, b) => a.ticketId - b.ticketId,
      render: (ticketId,data) => {
        if (data.lockedTime === "0001-01-01T00:00:00")
        {
          return ticketId + " "+  t("Missing Value");
        }
        return ticketId;
      }
    },
    {
      title: t("Ticket Pool Name"),
      dataIndex: "ticketPoolName",
      key: "ticketPoolName",
      render: (name) => {
        return t(name);
      }
    },
    {
      title: t("Locked Time"),
      dataIndex: "lockedTime",
      key: "lockedTime",
      sorter: (a, b) => moment(a.lockedTime).unix() - moment(b.lockedTime).unix(),
      render: (utcLockedTime) => {
        if (utcLockedTime === "0001-01-01T00:00:00")
        {
          return;
        }
        return converUtcToLocal(utcLockedTime);
      },
    },
    {
      title: t("Reopened Time"),
      dataIndex: "openedTime",
      key: "openedTime",
      sorter: (a, b) => moment(a.openedTime).unix() - moment(b.openedTime).unix(),
      render: (utcOpenedTime) => {
        return converUtcToLocal(utcOpenedTime);
      },
    },
    {
      title: t("Review Time"),
      dataIndex: "reviewTime",
      key: "reviewTime",
      sorter: (a, b) => a.reviewTime.totalSeconds - b.reviewTime.totalSeconds,
      render: function formatReviewTime(reviewTime,data) {
        if (data.lockedTime === "0001-01-01T00:00:00")
        {
          return;
        }
        let reviewTimeFormatted =
        reviewTime.days +
        t("Days") +
        reviewTime.hours +
        t("Hours") +
        reviewTime.minutes +
        t("Minutes") +
        reviewTime.seconds +
        t("Seconds");
        return reviewTimeFormatted;
      },
    },
  ];
  return (
    <Table
      dataSource={dataList}
      columns={columns}
      bordered
      size="small"
      style={{ marginTop: 24 }}
      rowKey={(moderator) => moderator.ticketId + moderator.openedTime}
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

export default ModeratorReopenedTicketModel;
