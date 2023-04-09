import React from "react";
import { useTranslation } from "react-i18next";
import { Button, List, Table, Typography } from "antd";
import { ticketListInfoMap, fieldTranslateMap } from "./ticketListInfoMap";
import { Link } from "react-router-dom";
import { parseDateTimeWithTimeZone } from "utils";

const { Text } = Typography;
const TicketList = ({ events, eventType, total, currentPage, onPageChange }) => {
  const { t } = useTranslation();
  let columns = getSubTable(eventType, t);
  columns.push({
    title: t("Created Time"),
    key: ["event", "createdUtc"],
    render: (event) => parseDateTimeWithTimeZone(new Date(event.createdUtc)),
  });
  columns.push({
    title: t("Ticket Information"),
    fixed: "right",
    width: 200,
    render: function ticketInfoColumn(event) {
      return (
        <List
          dataSource={event.tickets}
          renderItem={(ticket) => {
            return (
              <List.Item>
                <Text>{t("Ticket ID")}</Text>:<Text>{ticket.ticketId}</Text>
                <br />
                <Text>{t("Status")}</Text>:<Text>{ticket.status}</Text>
                <Link
                  to={`/ticket?ticketId=${ticket.ticketId}`}
                  target="_blank"
                >
                  <Button type="link">{t("View")}</Button>
                </Link>
              </List.Item>
            );
          }}
        />
      );
    },
  });
  return (
    <Table
      columns={columns}
      dataSource={events}
      bordered
      rowKey="eventId"
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
function getSubTable(eventType, t) {
  let mapEntry = ticketListInfoMap[eventType];
  let result = Object.keys(mapEntry).map((key) => {
    if (fieldTranslateMap[key]) {
      return {
        dataIndex: mapEntry[key],
        key: key,
        title: t(key),
        render: (text) => t(text),
      };
    }
    return {
      dataIndex: mapEntry[key],
      key: key,
      title: t(key),
    };
  });
  return result;
}

export default TicketList;
