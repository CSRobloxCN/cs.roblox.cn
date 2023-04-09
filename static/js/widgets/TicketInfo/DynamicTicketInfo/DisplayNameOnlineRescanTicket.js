import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descriptions, Space, Alert } from "antd";
import { LinkOut } from "components/LinkOut";
import axios from "axios";
import config from "config";
import { useOktaAuth } from "@okta/okta-react";
import { parseDateTimeWithTimeZone } from "utils";
import { loading } from "helpers/promiseWithLoading";
import { USER_ID } from "constants/index";
import moment from "moment";

const DisplayNameOnlineRescanTicketInfo = ({ ticket }) => {
  const { authState } = useOktaAuth();
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState(null);
  const event = JSON.parse(
    ticket && ticket.dynamicEvent && ticket.dynamicEvent.dataString
  );

  useEffect(() => {
    const userId = event.UserId;
    if (userId) {
      loading(
        getUserInfo(userId, authState.accessToken.value).then((res) => {
          if (res.status === 200) {
            const { data } = res;
            const userIdInfo = data && data.data;
            setUserInfo(userIdInfo);
          }
        })
      );
    }
  }, [ticket]);

  return (
    <Space
      direction="vertical"
      size={24}
      style={{ width: "100%", padding: 24 }}
    >
      <Descriptions
        bordered
        column={4}
        title={t("Ticket Information")}
        size="small"
      >
        <Descriptions.Item label={t("ticketId")}>
          {ticket.ticketId}
        </Descriptions.Item>
        <Descriptions.Item label={t("eventType")}>
          {t(event.Type)}
        </Descriptions.Item>
        <Descriptions.Item label={t("createdUtc")}>
          {parseDateTimeWithTimeZone(moment.utc(ticket.createdUtc).toDate())}
        </Descriptions.Item>
        <Descriptions.Item label={t("status")}>
          {ticket.status}
        </Descriptions.Item>
        <Descriptions.Item label={t("moderatorId")}>
          {ticket.moderatorId}
        </Descriptions.Item>
        <Descriptions.Item label={t("User ID")}>
          <LinkOut href={`https://www.roblox.com/users/${event.UserId}`}>
            {event.UserId}
          </LinkOut>
        </Descriptions.Item>
        <Descriptions.Item label={t("Current Display Name")}>
          {userInfo && userInfo.displayName}
        </Descriptions.Item>
        <Descriptions.Item label={t("Display Name Pending Review")}>
          {event.DisplayName}
        </Descriptions.Item>
        <Descriptions.Item label={t("Violating Words")}>
          {event.ViolatingWords.join(", ")}
        </Descriptions.Item>
        <Descriptions.Item label={t("Filter Type")}>
          {event.FilterType}
        </Descriptions.Item>
      </Descriptions>

      {event && userInfo && event.DisplayName !== userInfo.displayName && (
        <Alert
          message={t(
            "Current display name not equal to the pending review version. Please close the ticket."
          )}
          type="error"
        />
      )}
    </Space>
  );
};

function getUserInfo(playerId, accessToken) {
  return axios({
    method: "post",
    url: config.resourceServer.GetUserInfo,
    data: { idType: USER_ID, id: playerId },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export default DisplayNameOnlineRescanTicketInfo;
