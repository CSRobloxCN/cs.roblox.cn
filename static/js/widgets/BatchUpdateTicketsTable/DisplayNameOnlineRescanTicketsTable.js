import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { Table, Space, Button, message, Typography } from "antd";
import { postData, putRecord } from "helpers/httpRequest";
import { useOktaAuth } from "@okta/okta-react";
import { ModeratorAccount } from "context/ModeratorAccount";
import {
  Results,
  ModerationEvents,
  DisplayNameTicketExpirationDay,
} from "constants/index";
import config from "config";
import DisplayNameOnlineRescanColumns from "./DisplayNameOnlineRescanColumns";

const { Text } = Typography;

const DisplayNameOnlineRescanTicketsTable = ({
  tickets,
  handlePickTickets,
}) => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  const history = useHistory();
  const userInfo = useContext(ModeratorAccount);
  const [
    ticketsWithCurrentDisplayName,
    setTicketsWithCurrentDisplayName,
  ] = useState(tickets);
  const [selectedTicketIDs, setSelectedTicketIDs] = useState([]);

  useEffect(() => {
    const getPlayerInfo = async () => {
      if (!tickets || tickets.length === 0) {
        return;
      }
      const date1 = Date.now();
      const parsedTickets = tickets.map((ticket) => {
        const eventData =
          ticket.dynamicEvent &&
          ticket.dynamicEvent.dataString &&
          JSON.parse(ticket.dynamicEvent.dataString);
        const ticketCreatedDate = new Date(ticket.createdUtc);
        const diffTime = Math.abs(ticketCreatedDate - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          ticketId: ticket.ticketId,
          userId: eventData.UserId,
          displayName: eventData.DisplayName,
          diffDays, // use this to check if the ticket is over 7 days, if so

          // the following are display name rescan related attributes
          violatingWords: eventData.ViolatingWords,
          filterType: eventData.FilterType,
          textEvilType: eventData.TextEvilType,
        };
      });

      const expiredTickets = parsedTickets.filter(
        (ticket) => ticket.diffDays > DisplayNameTicketExpirationDay
      );

      var playersInfo = [];
      if (expiredTickets.length > 0) {
        const hide = message.loading("", 10);
        const playersInfoResponse = await postData(
          config.resourceServer.MultiGetByUserId,
          {
            userIds: expiredTickets.map((ticket) => ticket.userId),
            excludeBannedUsers: false,
          },
          authState.accessToken.value
        );
        hide();

        if (
          playersInfoResponse.status === 200 &&
          playersInfoResponse.data &&
          playersInfoResponse.data.data
        ) {
          playersInfo = playersInfoResponse.data.data.data;
        }
      }

      const result = parsedTickets.map((ticket) => {
        const player =
          playersInfo.length > 0 &&
          playersInfo.find((player) => player.id === ticket.userId);
        const currentDN =
          player && player.displayName
            ? player && player.displayName
            : ticket.displayName;
        return {
          key: ticket.ticketId,
          ticketId: ticket.ticketId,
          isSensitive: ticket.isSensitive,
          userId: ticket.userId,
          currentDN,
          isOutdated: ticket.displayName !== currentDN,

          // the following are display name rescan related attributes
          displayNameFoundInRescan: ticket.displayName,
          violatingWords: ticket.violatingWords.join(", "),
          filterType: ticket.filterType,
        };
      });

      setTicketsWithCurrentDisplayName(result);
    };

    getPlayerInfo();
  }, [tickets]);

  const handleBanUser = async ({ banLength, userId }) => {
    const ticket = ticketsWithCurrentDisplayName.find(
      (t) => t.userId === userId
    );

    if (ticket) {
      const hide = message.loading("", 10);
      const response = await postData(
        config.resourceServer.SubmitTicketResult,
        {
          ticketId: ticket.ticketId,
          moderatorId: userInfo.ModID,
          result: Results.BanUser,
          comment: "",
          actionLength: banLength,
        },
        authState.accessToken.value
      );
      hide();
      if (response.status !== 200 || (response.data && response.data.error)) {
        message.error(t("Ban user failed"));
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

    if (type === Results.ChangeDisplayName || type === Results.Reopen) {
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

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedTicketIDs(selectedRowKeys);
    },
  };

  const columns = DisplayNameOnlineRescanColumns({ handleBanUser });

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        {tickets && tickets.length === 0 ? (
          <Button
            type="primary"
            onClick={() =>
              handlePickTickets(ModerationEvents.DisplayNameChangeEvent)
            }
          >
            {t("Pick Tickets")}
          </Button>
        ) : (
          <>
            <Button
              type="primary"
              onClick={() => handleBatchAction(Results.ChangeDisplayName)}
            >
              {t("Batch set default user name")}
            </Button>
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
        dataSource={ticketsWithCurrentDisplayName}
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

DisplayNameOnlineRescanTicketsTable.displayName =
  "DisplayNameOnlineRescanTicketsTable";

export default DisplayNameOnlineRescanTicketsTable;
