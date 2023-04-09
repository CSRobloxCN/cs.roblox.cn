import React, { useContext, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ModeratorAccount } from "context/ModeratorAccount";
import { useOktaAuth } from "@okta/okta-react";
import { Space, Input, Button, Descriptions } from "antd";
import { submitResult } from "./SubmitResultRequest";
import { loading } from "helpers/promiseWithLoading";
import { Results } from "constants/index";
import { BanUser } from "widgets/BanUser";
import axios from "axios";
import config from "config";

const { TextArea } = Input;

const DisplayNameChangeResultSumitter = ({ ticketId, onTicketChange }) => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  let [comment, setComment] = useState("");
  let userInfo = useContext(ModeratorAccount);

  let closeTicket = useCallback(() => {
    if (userInfo) {
      const accessToken = authState.accessToken.value;
      axios({
        method: "PUT",
        url: config.resourceServer.ChangeTicketStatus,
        data: {
          ticketId: ticketId,
          status: "Closed",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then(() => {
        window.location.reload();
      });
    }
  }, [ticketId, userInfo]);

  let handleBanUser = ({ banLength }) => {
    DoAction({
      ticketId,
      result: Results.BanUser,
      comment,
      actionLength: banLength,
      accessToken: authState.accessToken.value,
      onTicketChange,
    });
  };

  if (!userInfo) return null;

  return (
    <>
      <Descriptions bordered title={t("Ticket Result")} size="small" />
      <TextArea
        rows={4}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("Add some comment")}
        style={{ marginBottom: 20 }}
      />

      <Space size={20}>
        <BanUser handleBanUser={handleBanUser} />
        <Button
          onClick={() => {
            DoAction({
              ticketId,
              result: Results.ChangeDisplayName,
              comment,
              actionLength: 0,
              accessToken: authState.accessToken.value,
              onTicketChange,
            });
          }}
          type="primary"
        >
          {t("Change display name to default user name")}
        </Button>
        <Button
          onClick={() => {
            DoAction({
              ticketId,
              result: Results.Reopen,
              comment,
              actionLength: 0,
              accessToken: authState.accessToken.value,
              onTicketChange,
            });
          }}
        >
          {t("Repoen This Ticket With Comment")}
        </Button>
        <Button danger onClick={closeTicket}>
          {t("Close This Ticket")}
        </Button>
      </Space>
    </>
  );
};

function DoAction({
  ticketId,
  result,
  comment,
  actionLength,
  accessToken,
  onTicketChange,
}) {
  loading(
    submitResult(
      { ticketId, result, comment, actionLength },
      accessToken,
      {}
    ).then((res) => {
      if (
        res.status == 200 &&
        (res.data.data ||
          /Successfully submitted result for ticket/.test(res.data))
      ) {
        onTicketChange(res.data.data);
      }
    })
  );
}

export default DisplayNameChangeResultSumitter;
