import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descriptions, Space } from "antd";
import { LinkOut } from "components/LinkOut";
import axios from "axios";
import config from "config";
import { loading } from "helpers/promiseWithLoading";
import { useOktaAuth } from "@okta/okta-react";

const GameInformationUpdateTicket = ({ ticket }) => {
  const { authState } = useOktaAuth();
  const { t } = useTranslation();
  let [gameInfo, setGameInfo] = useState(null);
  let [developerEmail, setDeveloperEmail] = useState(null);
  let data = JSON.parse(ticket.dynamicEvent.dataString);
  useEffect(() => {
    let gameId = data.gameId;
    if (gameId) {
      loading(
        getGameData(gameId)
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
          })
      );
    }
  }, [ticket]);

  let gameThumbnail;
  try {
    gameThumbnail = JSON.parse(data.gameThumbnail);
  } catch (e) {
    console.error(e);
  }

  if (!gameInfo) return null;
  return (
    <Space direction="vertical" size={24} style={{ width: "100%",padding:24 }}>
      {renderGameDesc(ticket, gameInfo, developerEmail, t)}
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "row",
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{ width: 120, height: 120, borderRadius: 12, marginRight: 20 }}
        >
          <img src={data.gameIcon} style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              height: 20,
              lineHeight: "20px",
              fontSize: "16px",
              color: "#1f1f1f",
              fontWeight: "bolder",
              marginBottom: 4,
            }}
          >
            <LinkOut
              href={`https://www.roblox.com/games/${gameInfo.rootPlaceId}`}
            >
              {data.gameTitle}
            </LinkOut>
          </div>
          <div
            style={{
              height: 20,
              lineHeight: "20px",
              fontSize: "10px",
              color: "#8c8c8c",
              marginBottom: 4,
            }}
          >
            {gameInfo.playing}
            {t(" Current Players")}
          </div>
          <div
            style={{
              lineHeight: "20px",
              fontSize: "12px",
              color: "#262626",
              marginBottom: 4,
              whiteSpace: "pre-wrap",
            }}
          >
            {data.gameDescription}
          </div>
        </div>
      </div>
      <div>
        {gameThumbnail?.map((e) => (
          <img
            src={e.imageUrl}
            key={e.imageUrl}
            style={{
              display: "block",
              maxWidth: "100%",
              marginBottom: 4,
              marginLeft: 20,
            }}
          />
        ))}
      </div>
    </Space>
  );
};

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

function renderGameDesc(ticket, gameInfo, developerEmail, t) {
  if (!gameInfo) return null;
  return (
    <>
      <Descriptions bordered size="small" title={t("Ticket Information")}>
        <Descriptions.Item label={t("ticketId")}>
          {ticket.ticketId}
        </Descriptions.Item>
        <Descriptions.Item label={t("status")}>
          {ticket.status}
        </Descriptions.Item>
        <Descriptions.Item label={t("createdUtc")}>
          {ticket.createdUtc}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions bordered size="small" title={t("Game Information")}>
        <Descriptions.Item label={t("Game ID")}>
          <LinkOut
            href={"https://www.roblox.com/games/" + gameInfo.rootPlaceId}
          >
            {gameInfo.id}
          </LinkOut>
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
      </Descriptions>
    </>
  );
}
export default GameInformationUpdateTicket;
