import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descriptions, List, Space, Typography, Alert } from "antd";
import { LinkOut } from "components/LinkOut";
import ticketInfoMap from "./ticketInfoMap";
import axios from "axios";
import { readData } from "utils";
import config from "config";
import { useOktaAuth } from "@okta/okta-react";
import { parseDateTimeWithTimeZone } from "utils";
import { loading } from "helpers/promiseWithLoading";
import { DynamicEvent, USER_ID, ModerationEvents } from "constants/index";
import moment from "moment";

const {
  fieldLinkMap,
  infoMap,
  fieldTimeMap,
  fieldTranslateMap,
  fieldTextMap,
  fieldListMap,
  ticketExtraInfoMap,
} = ticketInfoMap;

const TicketInfo = ({ ticket }) => {
  const { authState } = useOktaAuth();
  const { t } = useTranslation();
  let [userInfo, setuserInfo] = useState(null);
  let [developerEmail, setDeveloperEmail] = useState(null);
  let [targetUserInfo, setTargetUserInfo] = useState(null);
  let [gameInfo, setGameInfo] = useState(null);
  let [currentDisplayName, setCurrentDisplayName] = useState();
  let [placeAccuseCount, setPlaceAccuseCount] = useState(0);

  let ticketInfo = parseTicketInfo(ticket, {
    [t("Current Display Name")]: currentDisplayName,
  });
  let ticketExtraInfo = parseTicketExtraInfo(ticket);
  useEffect(() => {
    let userId = ticketInfo.creatorId || ticketInfo.submitterUserId;
    let targetUserId = ticketInfo.accusedUserId;
    let placeId = ticketInfo.placeId;
    let playerId = ticketInfo.UserId;
    let gameId = ticketInfo.gameId;
    if (userId) {
      loading(
        getUserData(userId).then((res) => {
          if (res.status == 200) {
            setuserInfo(res.data);
          }
        })
      );
    }
    if (targetUserId) {
      loading(
        getUserData(targetUserId).then((res) => {
          if (res.status == 200) {
            setTargetUserInfo(res.data);
          }
        })
      );
    }
    if (placeId) {
      loading(
        getGameIdByPlaceId(placeId, authState.accessToken.value)
          .then((res) => {
            if (res.status == 200) {
              if (!res.data || !res.data[0] || !res.data[0].universeId) return;
              let gameId = res.data[0].universeId;
              return gameId;
            }
          })
          .then((gameId) => {
            return getGameData(gameId)
              .then((res) => {
                if (res.status == 200) {
                  setGameInfo(res.data.data[0]);
                }
              })
              .then(() => getDeveloperEmail(gameId, authState.accessToken.value))
              .then((res) => {
                if (res.status == 200) {
                  setDeveloperEmail(res.data.data);
                }
              });
          })
      );
      loading(
        getPlaceInAppAbuseReportCount(
          placeId,
          getLastWeekUtc(),
          getNowUtc(),
          authState.accessToken.value
        ).then((res) => {
          if (res && res.status == 200 && !res.data.error) {
            setPlaceAccuseCount(res.data.data);
          }
        })
      );
    }
    if (gameId) {
      loading(
        getGameData(gameId)
          .then((res) => {
            if (res && res.status == 200) {
              setGameInfo(res.data.data[0]);
            }
          })
          .then(() => getDeveloperEmail(gameId, authState.accessToken.value))
          .then((res) => {
            if (res && res.status == 200) {
              setDeveloperEmail(res.data.data);
            }
          })
      );
    }
    if (playerId) {
      loading(
        getPlayerInfo(playerId, authState.accessToken.value).then((res) => {
          if (res.status === 200) {
            const { data } = res;
            const playerInfo = data && data.data;
            setCurrentDisplayName(playerInfo.displayName);
          }
        })
      );
    }
  }, [ticket]);

  return (
    <Space direction="vertical" size={24} style={{ width: "100%",padding:24 }}>
      <Descriptions
        bordered
        column={4}
        title={t("Ticket Information")}
        size="small"
      >
        {Object.keys(ticketInfo).map((key) => {
          if (fieldLinkMap[key]) {
            return ticketInfo[key] ? (
              <Descriptions.Item label={t(key)} key={key}>
                <LinkOut href={fieldLinkMap[key] + ticketInfo[key]}>
                  {ticketInfo[key]}
                </LinkOut>
              </Descriptions.Item>
            ) : null;
          }
          if (fieldTimeMap[key]) {
            return ticketInfo[key] ? (
              <Descriptions.Item label={t(key)} key={key}>
                {parseDateTimeWithTimeZone(new Date(ticketInfo[key]))}
              </Descriptions.Item>
            ) : null;
          }
          if (fieldTranslateMap[key]) {
            return ticketInfo[key] ? (
              <Descriptions.Item label={t(key)} key={key}>
                {t(ticketInfo[key])}
              </Descriptions.Item>
            ) : null;
          }
          return (
            <Descriptions.Item label={t(key)} key={key}>
              {ticketInfo[key]}
            </Descriptions.Item>
          );
        })}
      </Descriptions>

      {ticketInfo &&
        ticketInfo.NewDisplayName &&
        currentDisplayName &&
        ticketInfo.NewDisplayName !== currentDisplayName && (
          <Alert
            message={t(
              "Current display name not equal to the pending review version. Please close the ticket."
            )}
            type="error"
          />
        )}

      {(ticketInfo.placeId || ticketInfo.gameId) &&
        renderGameDesc(gameInfo, developerEmail, placeAccuseCount, t)}
      {(ticketInfo.creatorId || ticketInfo.submitterUserId) &&
        renderUserDesc(userInfo, t("Submitter Information"), t)}
      {ticketInfo.accusedUserId &&
        renderUserDesc(targetUserInfo, t("Accused User Information"), t)}
      {Object.keys(ticketExtraInfo).map((key) => {
        if (fieldTextMap[key]) {
          let text = ticketExtraInfo[key];
          if (text) {
            return (
              <div key={text}>
                <Typography.Title level={5}>{t("comment")}</Typography.Title>
                <Typography.Paragraph>{text}</Typography.Paragraph>
              </div>
            );
          }
          return null;
        }
        if (fieldListMap[key]) {
          let list = ticketExtraInfo[key];
          if (list) {
            return (
              <>
                <Typography.Title level={5}>{t("chat")}</Typography.Title>
                <List
                  bordered
                  dataSource={list}
                  size="small"
                  renderItem={(item) => {
                    let username = item.userId;
                    if (userInfo && item.userId == userInfo.id) {
                      username = `(${t("Submitter User")}) ${
                        userInfo.displayName
                      }`;
                    }
                    if (targetUserInfo && item.userId == targetUserInfo.id) {
                      username = `(${t("Accused User")}) ${
                        targetUserInfo.displayName
                      }`;
                    }
                    return (
                      <List.Item>
                        <Typography.Text underline>{username}</Typography.Text>:{" "}
                        {item.value}
                      </List.Item>
                    );
                  }}
                />
              </>
            );
          }
          return null;
        }
      })}
    </Space>
  );
};

function getUserData(userId) {
  return axios.get(config.resourceServer.GetRobloxUserInfoWithUserID + userId);
}

function getGameData(gameId) {
  return axios.get(config.resourceServer.GetRobloxGameInfoWithGameID + gameId);
}

function getDeveloperEmail(gameId, accessToken) {
  return axios({
    method: "get",
    url: config.resourceServer.GetDeveloperEmail(gameId),
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

function getGameIdByPlaceId(placeId, accessToken) {
  return axios({
    method: "get",
    url: config.resourceServer.GetGameIDWithPlaceID + placeId,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

function getPlayerInfo(playerId, accessToken) {
  return axios({
    method: "post",
    url: config.resourceServer.GetUserInfo,
    data: { idType: USER_ID, id: playerId },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

function renderGameDesc(gameInfo, developerEmail, placeAccuseCount, t) {
  if (!gameInfo) return null;
  return (
    <Descriptions bordered size="small" title={t("Game Information")}>
      <Descriptions.Item label={t("Game ID")}>
        <LinkOut href={fieldLinkMap.placeId + gameInfo.rootPlaceId}>
          {gameInfo.id}
        </LinkOut>
      </Descriptions.Item>
      <Descriptions.Item label={t("Game Name")}>
        {gameInfo.name}
      </Descriptions.Item>
      <Descriptions.Item label={t("Creator Name")}>
        {gameInfo.creator.name}
      </Descriptions.Item>
      <Descriptions.Item label={t("Creator Type")}>
        {gameInfo.creator.type}
      </Descriptions.Item>
      <Descriptions.Item label={t("Creator ID")}>
        {gameInfo.creator.id}
      </Descriptions.Item>
      <Descriptions.Item label={t("Creator Contact Email")}>
        {developerEmail}
      </Descriptions.Item>
      <Descriptions.Item label={t("Accuse Count(past week)")}>
        <span style={{ color: placeAccuseCount >= 3 ? "#f00" : "inherit" }}>
          {placeAccuseCount}
        </span>
      </Descriptions.Item>
    </Descriptions>
  );
}

function renderUserDesc(userInfo, title, t) {
  if (!userInfo) return null;
  return (
    <Descriptions bordered size="small" title={title}>
      <Descriptions.Item label={t("User ID")}>
        <LinkOut href={fieldLinkMap.creatorId + userInfo.id}>
          {userInfo.id}
        </LinkOut>
      </Descriptions.Item>
      <Descriptions.Item label={t("User Name")}>
        {userInfo.name}
      </Descriptions.Item>
      <Descriptions.Item label={t("Display Name")}>
        {userInfo.displayName}
      </Descriptions.Item>
      <Descriptions.Item label={t("Account Create Date")}>
        {parseDateTimeWithTimeZone(new Date(userInfo.created))}
      </Descriptions.Item>
      <Descriptions.Item label={t("Ban Status")}>
        {userInfo.isBanned ? t("Banned") : t("Not Banned")}
      </Descriptions.Item>
    </Descriptions>
  );
}

function parseTicketInfo(ticket, dynamicEventAdditionalData = {}) {
  if (!ticket) {
    return null;
  }

  try {
    const { eventType } = ticket;
    let result = {};
    let mapEntry = infoMap[eventType];

    Object.keys(mapEntry).forEach((key) => {
      result[key] = readData(ticket, mapEntry[key]);
    });

    if (
      eventType === DynamicEvent &&
      ticket.dynamicEvent &&
      ticket.dynamicEvent.dataString
    ) {
      const dynamicEventObj = JSON.parse(ticket.dynamicEvent.dataString);

      if (
        ticket.dynamicEvent.templateType ===
        ModerationEvents.DisplayNameChangeEvent.name
      ) {
        result = {
          ...result,
          NewDisplayName: dynamicEventObj.NewDisplayName,
          ...dynamicEventAdditionalData,
          UserId: dynamicEventObj.UserId,
        };
      }

      if (
        ticket.dynamicEvent.templateType ===
        ModerationEvents.DisplayNameRescanEvent.name
      ) {
        result = {
          ...result,
          DisplayName: dynamicEventObj.DisplayName,
          ViolatingWords: dynamicEventObj.ViolatingWords,
          ...dynamicEventAdditionalData,
          UserId: dynamicEventObj.UserId,
        };
      }

      if (
        ticket.dynamicEvent.templateType ===
          ModerationEvents.GameOptInEvent.name &&
        dynamicEventObj &&
        dynamicEventObj.Message
      ) {
        const messageObj = JSON.parse(dynamicEventObj.Message);
        result = {
          ...result,
          gameId: messageObj && messageObj.universeId,
        };
      }
    }
    return result;
  } catch (e) {
    console.error(e);
    return {};
  }
}

function parseTicketExtraInfo(ticket) {
  try {
    let result = {};
    let mapEntry = ticketExtraInfoMap[ticket.eventType];
    Object.keys(mapEntry).forEach((key) => {
      result[key] = readData(ticket, mapEntry[key]);
    });
    return result;
  } catch (e) {
    console.error(e);
    return {};
  }
}

function getPlaceInAppAbuseReportCount(placeId, startUtc, endUtc, accessToken) {
  return axios({
    method: "get",
    url:
      config.resourceServer.GetPlaceInAppAbuseReport +
      "/place-id/" +
      placeId +
      "/count?startUtc=" +
      startUtc +
      "&endUtc=" +
      endUtc,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

function getLastWeekUtc() {
  return moment().subtract(7, "days").toISOString();
}

function getNowUtc() {
  return moment().toISOString();
}

export default TicketInfo;
