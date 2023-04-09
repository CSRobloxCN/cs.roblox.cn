import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModeratorAccount } from "context/ModeratorAccount";
import { useOktaAuth } from "@okta/okta-react";
import { Space, Input, Button, Descriptions, Select, message } from "antd";
import { Results } from "constants/index";
import { postData } from "helpers/httpRequest";
import violationTypeMap from "../HandleAssetStatus/violationTypeMap";
import config from "config";

const { Option } = Select;
const { TextArea } = Input;

const AssetStatusUpdateResultSubmitter = ({
  ticketId,
  dataString,
  onTicketChange,
}) => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  let [comment, setComment] = useState("");
  let [violationType, setViolationType] = useState("");
  let userInfo = useContext(ModeratorAccount);
  let actionTargetId = 0;
  try {
    actionTargetId = JSON.parse(dataString).AssetId;
  } catch (e) {
    console.error(e);
    return null;
  }

  if (!userInfo || !actionTargetId) return null;

  const handleAssetStatus = async ({
    ticketId,
    actionTargetId,
    result,
    violationType,
    comment,
    onTicketChange,
  }) => {
    if (result == Results.ApproveUpdateAssetStatus || result == Results.None) {
      violationType = "";
    } else if (
      result == Results.RejectUpdateAssetStatus &&
      (violationType == undefined || violationType == "")
    ) {
      message.error(t("reject asset update must select the violationtype"));
      return;
    }
    const hide = message.loading("", 10);
    const response = await postData(
      config.resourceServer.SubmitTicketResult,
      {
        ticketId: ticketId,
        moderatorId: userInfo.ModID,
        actionTargetId: actionTargetId,
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
    onTicketChange(response.data.data);
  };

  return (
    <>
      <Descriptions bordered title={t("Ticket Result")} size="small" />
      <TextArea
        rows={4}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("comment placeholder")}
        style={{ marginBottom: 20 }}
      />

      <Space size={20}>
        <span>
          <Button
            onClick={() => {
              let result = Results.ApproveUpdateAssetStatus;
              handleAssetStatus({
                ticketId,
                actionTargetId,
                result,
                violationType,
                comment,
                onTicketChange,
              });
            }}
            type="primary"
          >
            {t("Approve Asset Update")}
          </Button>
          <Button
            onClick={() => {
              let result = Results.RejectUpdateAssetStatus;
              handleAssetStatus({
                ticketId,
                actionTargetId,
                result,
                violationType,
                comment,
                onTicketChange,
              });
            }}
            type="primary"
            danger
          >
            {t("Reject Asset Update")}
          </Button>
          <Select
            placeholder={t("set violationType placeholder")}
            dropdownMatchSelectWidth={true}
            onChange={setViolationType}
          >
            {violationTypeMap.map((type) => (
              <Option value={type} key={type}>
                {t(type)}
              </Option>
            ))}
          </Select>
        </span>
        <Button
          onClick={() => {
            let result = Results.Reopen;
            handleAssetStatus({
              ticketId,
              actionTargetId,
              result,
              violationType,
              comment,
              onTicketChange,
            });
          }}
        >
          {t("Repoen This Ticket With Comment")}
        </Button>
        <Button
          onClick={() => {
            let result = Results.None;
            handleAssetStatus({
              ticketId,
              actionTargetId,
              result,
              violationType,
              comment,
              onTicketChange,
            });
          }}
        >
          {t("Ignore Asset Update")}
        </Button>
      </Space>
    </>
  );
};

export default AssetStatusUpdateResultSubmitter;
