import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import config from "config";
import { loading } from "helpers/promiseWithLoading";
import { LinkOut } from "components/LinkOut";
const resourceServer = config.resourceServer;

const GameDetailCard = ({ placeId }) => {
  const { t } = useTranslation();
  let [gameInfo, setGameInfo] = useState(null);
  let [gameIcon, setGameIcon] = useState(null);
  useEffect(() => {
    loading(
      getGameIdByPlaceId(placeId)
        .then((res) => {
          if (res.status == 200) {
            return res?.data[0]?.universeId;
          }
        })
        .then((gameId) => {
          let infoPromise = getGameInfo(gameId).then((res) => {
            if (res.status == 200) {
              setGameInfo(res.data.data[0]);
            }
          });
          let iconPromise = getGameIcon(gameId).then((res) => {
            if (res.status == 200) {
              setGameIcon(res.data.data[0].imageUrl);
            }
          });
          return Promise.all([infoPromise, iconPromise]);
        })
    );
  }, [placeId]);
  if (!gameInfo) return <div style={{height:48}}></div>;
  return (
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
        <img src={gameIcon} style={{ width: "100%", height: "100%" }} />
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
            {gameInfo.name}
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
          {gameInfo.description}
        </div>
      </div>
    </div>
  );
};

function getGameInfo(gameId) {
  return axios({
    method: "get",
    url: resourceServer.GetRobloxGameInfoWithGameID + gameId,
  });
}
function getGameIcon(gameId) {
  return axios({
    method: "get",
    url: resourceServer.GetGameIcon(gameId),
  });
}

function getGameIdByPlaceId(placeId) {
  return axios.get(config.resourceServer.GetGameIDWithPlaceID + placeId);
}
export default GameDetailCard;
