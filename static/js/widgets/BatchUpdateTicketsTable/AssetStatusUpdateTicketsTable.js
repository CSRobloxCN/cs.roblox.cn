import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { Table, Space, Button, message, Typography } from "antd";
import { postData, putRecord } from "helpers/httpRequest";
import { useOktaAuth } from "@okta/okta-react";
import { ModeratorAccount } from "context/ModeratorAccount";
import { Results, ModerationEvents } from "constants/index";
import config from "config";
import AssetStatusUpdateColumns from "./AssetStatusUpdateColumns";

const { Text } = Typography;

const AssetStatusUpdateTicketsTable = ({
  tickets,
  handlePickTickets,
  eventType,
}) => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  const history = useHistory();
  const userInfo = useContext(ModeratorAccount);
  const [
    ticketsWithCurrentAssetStatus,
    setticketsWithCurrentAssetStatus,
  ] = useState(tickets);
  const [selectedTicketIDs, setSelectedTicketIDs] = useState([]);

  useEffect(() => {
    const getAssetInfo = async () => {
      if (!tickets || tickets.length === 0) {
        return;
      }
      const parsedTickets = tickets.map((ticket) => {
        const eventData =
          ticket.dynamicEvent &&
          ticket.dynamicEvent.dataString &&
          JSON.parse(ticket.dynamicEvent.dataString);

        return {
          key: ticket.ticketId,
          ticketId: ticket.ticketId,
          assetId: eventData.AssetId,
          assetType: eventData.AssetType,
          assetUrl:
            eventData.AssetType == "Bundle"
              ? `https://www.roblox.com/bundles/${eventData.AssetId}`
              : `https://www.roblox.com/catalog/${eventData.AssetId}`,
          policyLabel: eventData.PolicyLabel,
          comment: eventData.Comment,
        };
      });

      const result = parsedTickets;

      setticketsWithCurrentAssetStatus(result);
    };

    getAssetInfo();
  }, [tickets]);

  const handleAssetStatus = async ({
    ticketId,
    assetId,
    result,
    violationType,
    comment,
  }) => {
    const ticket = ticketsWithCurrentAssetStatus.find(
      (t) => t.ticketId === ticketId
    );
    if (ticket) {
      if (
        result == Results.ApproveUpdateAssetStatus ||
        result == Results.None
      ) {
        violationType = "";
      } else if (
        result == Results.RejectUpdateAssetStatus &&
        (violationType == undefined || violationType == "")
      ) {
        message.error(
          t(t("reject asset update must select the violationtype"))
        );
        return;
      }
      const hide = message.loading("", 10);
      const response = await postData(
        config.resourceServer.SubmitTicketResult,
        {
          ticketId: ticket.ticketId,
          moderatorId: userInfo.ModID,
          actionTargetId: assetId,
          result: result,
          violationType: violationType,
          comment: comment,
        },
        authState.accessToken.value
      );
      hide();
      if (response.status !== 200 || (response.data && response.data.errors)) {
        message.error(t("Handle Asset Status failed"));
        return;
      }
      history.go(0); // refresh the current page
    }
  };

  const handleBatchAction = async (type) => {
    const hide = message.loading("", 10);

    if (type === Results.Close) {
      const response = await putRecord(
        config.resourceServer.BatchUpdateTicketsStatus,
        {
          ticketIds: selectedTicketIDs,
          moderatorId: userInfo.ModID,
          status: "Closed",
        },
        authState.accessToken.value
      );
      hide();
      if (response.status !== 200 || (response.data && response.data.error)) {
        message.error(t("Failed to close tickets"));
        return;
      }
      history.go(0); // refresh the current page
      return;
    }
    if (type === Results.Reopen) {
      const response = await postData(
        config.resourceServer.BatchSubmitTickets,
        {
          ticketIds: selectedTicketIDs,
          moderatorId: userInfo.ModID,
          result: type,
        },
        authState.accessToken.value
      );
      hide();
      if (response.status !== 200 || (response.data && response.data.error)) {
        message.error(t("Failed to submit tickets"));
        return;
      }
      history.go(0); // refresh the current page
    }
  };

  var columns;
  if (eventType === ModerationEvents.AssetStatusUpdateEvent_Avatar.name) {
    columns = AssetStatusUpdateColumns(handleAssetStatus);
  } else if (
    eventType === ModerationEvents.AssetStatusUpdateEvent_Toolbox.name
  ) {
    columns = AssetStatusUpdateColumns(handleAssetStatus);
  }

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedTicketIDs(selectedRowKeys);
    },
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        {tickets && tickets.length === 0 ? (
          <Button
            type="primary"
            onClick={() =>
              handlePickTickets(ModerationEvents.AssetStatusUpdateEvent_Avatar)
            }
          >
            {t("Pick Tickets")}
          </Button>
        ) : (
          <>
            <Button onClick={() => handleBatchAction(Results.Reopen)}>
              {t("Batch re-open tickets")}
            </Button>
            <Button danger onClick={() => handleBatchAction(Results.Close)}>
              {t("Batch close tickets")}
            </Button>
            <Text mark>{`${selectedTicketIDs.length} ${t(
              "tickets selected"
            )}`}</Text>
          </>
        )}
      </Space>
      <Table
        dataSource={ticketsWithCurrentAssetStatus}
        columns={columns}
        size="small"
        pagination={false}
        scroll={{ y: 700 }}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      />
    </>
  );
};

AssetStatusUpdateTicketsTable.displayName = "AssetStatusUpdateTicketsTable";

export default AssetStatusUpdateTicketsTable;
