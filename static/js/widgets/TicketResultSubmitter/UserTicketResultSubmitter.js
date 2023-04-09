import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Space, Input, Button, Descriptions } from "antd";
import { useOktaAuth } from "@okta/okta-react";
import { ModeratorAccount } from "context/ModeratorAccount";
import { Results, submitResult } from "./SubmitResultRequest";
import { loading } from "helpers/promiseWithLoading";
import { BanUser } from "widgets/BanUser";
const { TextArea } = Input;

const UserTicketResultSubmitter = ({ ticketId, onTicketChange }) => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  let [comment, setComment] = useState("");
  let userInfo = useContext(ModeratorAccount);

  let handleBanUser = ({ banLength }) => {
    DoAction(
      ticketId,
      Results.BanUser,
      comment,
      banLength,
      authState.accessToken.value,
      onTicketChange
    );
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
            DoAction(
              ticketId,
              Results.None,
              comment,
              0,
              authState.accessToken.value,
              onTicketChange
            );
          }}
          type="primary"
        >
          {t("Don't Ban User")}
        </Button>
        <Button
          onClick={() => {
            DoAction(
              ticketId,
              Results.Reopen,
              comment,
              0,
              authState.accessToken.value,
              onTicketChange
            );
          }}
        >
          {t("Repoen This Ticket With Comment")}
        </Button>
      </Space>
    </>
  );
};
function DoAction(
  ticketId,
  result,
  comment,
  actionLength,
  accessToken,
  onTicketChange
) {
  loading(
    submitResult({ ticketId, result, comment, actionLength }, accessToken, {
      bypassWhitelistActions: true,
    }).then((res) => {
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
export default UserTicketResultSubmitter;
