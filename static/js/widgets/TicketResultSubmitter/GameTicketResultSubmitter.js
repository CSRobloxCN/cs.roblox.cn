import React, { /*useCallback,*/ useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModeratorAccount } from "context/ModeratorAccount";
import { useOktaAuth } from "@okta/okta-react";
import { Space, Input, Button, Descriptions } from "antd";
import { Results, submitResult } from "./SubmitResultRequest";
import { loading } from "helpers/promiseWithLoading";
// import axios from "axios";
// import config from "config";

const { TextArea } = Input;
const GameTicketResultSubmitter = ({ ticketId, placeId, onTicketChange,doWhitelistAction = false }) => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  let [comment, setComment] = useState("");
  let userInfo = useContext(ModeratorAccount);
  // let closeTicket = useCallback(() => {
  //   if (userInfo) {
  //     const accessToken = authState.accessToken.value;
  //     axios({
  //       method: "PUT",
  //       url: config.resourceServer.ChangeTicketStatus,
  //       data: {
  //         ticketId: ticketId,
  //         status: "Closed",
  //       },
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     }).then(() => {
  //       window.location.reload();
  //     });
  //   }
  // }, [ticketId, userInfo]);
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
        <Button
          onClick={() => {
            DoAction(
              ticketId,
              Results.RemoveGameFromWhitelist,
              comment,
              authState.accessToken.value,
              onTicketChange,
              placeId,
              doWhitelistAction
            );
          }}
          type="primary"
          danger
        >
          {t("Remove Game From Whitelist")}
        </Button>
        <Button
          onClick={() => {
            DoAction(
              ticketId,
              Results.AddGameToWhitelist,
              comment,
              authState.accessToken.value,
              onTicketChange,
              placeId,
              doWhitelistAction
            );
          }}
          type="primary"
        >
          {t("Add Game to Whitelist")}
        </Button>
        <Button
          onClick={() => {
            DoAction(
              ticketId,
              Results.Reopen,
              comment,
              authState.accessToken.value,
              onTicketChange
            );
          }}
        >
          {t("Repoen This Ticket With Comment")}
        </Button>
        {/* <Button danger onClick={closeTicket}>
          {t("Close This Ticket")}
        </Button> */}
      </Space>
    </>
  );
};

function DoAction(
  ticketId,
  result,
  comment,
  accessToken,
  onTicketChange,
  placeId,
  doWhitelistAction
) {
  loading(
    submitResult(
      { ticketId, result, comment, actionLength: 0 },
      accessToken,
      { placeId, bypassWhitelistActions: !doWhitelistAction }
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

export default GameTicketResultSubmitter;
