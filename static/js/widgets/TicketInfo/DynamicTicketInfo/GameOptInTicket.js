import React, { useEffect, useState, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Input, Button, message, Select, Modal } from "antd";
import { LinkOut } from "components/LinkOut";
import axios from "axios";
import config from "config";
import { loading } from "helpers/promiseWithLoading";
import { parseDateTimeWithTimeZone } from "utils";
import { ModeratorAccount } from "context/ModeratorAccount";
import { useOktaAuth } from "@okta/okta-react";
import Clipboard from "clipboard";
import moment from "moment";
const { TextArea } = Input;
const { Option } = Select;

const GameOptInTicketInfo = ({ ticket }) => {
  const { t, i18n } = useTranslation();
  const { authState } = useOktaAuth();
  let [gameInfo, setGameInfo] = useState(null);
  let [developerEmail, setDeveloperEmail] = useState(null);
  let [gameIcon, setGameIcon] = useState(null);
  let [comment, setComment] = useState("");
  let [places, setPlaces] = useState([]);
  let [recordId, setRecordId] = useState(null);
  let userInfo = useContext(ModeratorAccount);
  let data = JSON.parse(ticket.dynamicEvent.dataString);
  let refreshPlaces = (places) => {
    if (places) {
      setPlaces(places.map((v) => v));
    }
  };
  let initiatePlaces = (allPlaces, updatedPlaces) => {
    let placeObjects = allPlaces.map((place) => {
      let placeObject = {
        isUpdated: false,
        version: "Unchanged",
        id: place.id,
        name: place.name,
        result: null,
        confirmed: false,
        selected: false,
        isFinished: false,
        gameId: place.universeId,
        onChange: function (v) {
          placeObject.result = v;
          refreshPlaces(placeObjects);
        },
        onConfirm: function () {
          placeObject.confirmed = true;
          refreshPlaces(placeObjects);
        },
        onRevert: function () {
          placeObject.confirmed = false;
          refreshPlaces(placeObjects);
        },
        onSelectChange: function (v) {
          placeObject.selected = v;
          refreshPlaces(placeObjects);
        },
      };
      if (updatedPlaces && updatedPlaces.length) {
        setRecordId(updatedPlaces[0].recordId);
        updatedPlaces
          .filter((v) => v.placeId == place.id)
          .forEach((updatedPlace) => {
            if (
              placeObject.version < updatedPlace.versionNumber ||
              placeObject.version == "Unchanged"
            ) {
              placeObject.version = updatedPlace.versionNumber;
              placeObject.isFinished = updatedPlace.isFinished;
              placeObject.isUpdated = true;
              placeObject.ticketId = updatedPlace.ticketId;
            }
          });
      }
      return placeObject;
    });
    setPlaces(placeObjects);
  };

  let reopen = () => {
    axios({
      method: "POST",
      url: config.resourceServer.GameUpdateRecordResultBatchSubmit,
      data: {
        recordId,
        placeUpdatedType: 1, // 1: PlaceUpdatedWhenOptIn  2:PlaceUpdatedAfterOptIn
        submitType: 3, // 1: Reject game 2: Submit places 3: Reopen
        placeModerationResults: null,
        comment,
      },
      headers: { Authorization: `Bearer ${authState.accessToken.value}` },
    }).then((res) => {
      if (res.status == 200 && res.data && !res.data.error) {
        window.location = "/";
      }
    });
  };

  let submit = () => {
    if (hasUnConfirmedPlace()) {
      return;
    }
    let gameId = null;
    let results = places
      .filter((place) => place.isUpdated)
      .map((place) => {
        gameId = place.gameId;
        return {
          ticketId: place.ticketId,
          placeId: place.id,
          versionNumber: place.version,
          moderationResult: place.result ? 1 : 2, // 1: pass 2:reject
        };
      });
    let resultString =
      "\n" +
      results
        .map((r) =>
          i18n.language == "zh"
            ? `场景ID ${r.placeId} 的版本号 ${
                r.versionNumber
              } 的白名单状态被设置为 ${
                r.moderationResult == 1 ? "通过" : "拒绝"
              }`
            : `Place ID ${r.placeId} with Version Number ${
                r.versionNumber
              } 's whitelist status is set to ${
                r.moderationResult == 1 ? "Approved" : "Rejected"
              }`
        )
        .join("\n");
    axios({
      method: "post",
      url: config.resourceServer.GameUpdateRecordResultBatchSubmit,
      data: {
        recordId,
        gameId,
        placeUpdatedType: 1, // 1: PlaceUpdatedWhenOptIn  2:PlaceUpdatedAfterOptIn
        submitType: 2, // 1: Reject game 2: Submit places 3: Reopen
        placeModerationResults: results,
        comment: comment + resultString,
      },
      headers: { Authorization: `Bearer ${authState.accessToken.value}` },
    }).then((res) => {
      if (res.status == 200 && res.data && !res.data.error) {
        window.location = "/";
      }
    });
  };

  // let reject = () => {
  //   axios({
  //     method: "POST",
  //     url: config.resourceServer.GameUpdateRecordResultBatchSubmit,
  //     data: {
  //       recordId,
  //       placeUpdatedType: 1, // 1: PlaceUpdatedWhenOptIn  2:PlaceUpdatedAfterOptIn
  //       submitType: 1, // 1: Reject game 2: Submit places 3: Reopen
  //       placeModerationResults: null,
  //       comment,
  //     },
  //     headers: { Authorization: `Bearer ${authState.accessToken.value}` },
  //   }).then(loadAllPlaceInfos);
  // };
  function hasUnConfirmedPlace() {
    return places.find((place) => {
      if (place.isUpdated) {
        if (place.result === undefined || place.result === null) {
          return true;
        }
        if (!place.confirmed) {
          return true;
        }
      }
      return false;
    });
  }
  function canSubmit() {
    return places.find((place) => !place.isFinished);
  }
  function loadAllPlaceInfos() {
    let gameId = data.universeId;
    return getPlacesUnderGame(gameId, authState.accessToken.value)
      .then((res) => {
        if (res.status == 200) {
          return res.data.data;
        }
      })
      .then((places) =>
        getPlaceUpdateInfo(ticket.ticketId, authState.accessToken.value).then(
          function (res) {
            if (res.status == 200 && res.data.data && !res.data.error) {
              initiatePlaces(places, res.data.data?.moderationRecords);
            } else if (res.data.error) {
              message.error(JSON.stringify(res.data.error));
            }
          }
        )
      );
  }
  let updatePlaces = () => {
    getPlaceUpdateInfo(ticket.ticketId, authState.accessToken.value).then(
      (res) => {
        if (res.status == 200 && res.data.data && !res.data.error) {
          let updatedPlaces = res.data.data.moderationRecords;
          setPlaces((oldPlaces) =>
            oldPlaces.map((placeObject) => {
              if (updatedPlaces && updatedPlaces.length) {
                let updated = 0;
                updatedPlaces
                  .filter((v) => v.placeId == placeObject.id)
                  .forEach((updatedPlace) => {
                    if (
                      placeObject.version < updatedPlace.versionNumber ||
                      placeObject.version == "Unchanged"
                    ) {
                      updated++;
                      placeObject.version = updatedPlace.versionNumber;
                      placeObject.isFinished = updatedPlace.isFinished;
                      placeObject.result = null;
                      placeObject.confirmed = false;
                      placeObject.isUpdated = true;
                    }
                  });
                if (updated) {
                  Modal.info({
                    content: `${updated} ${t("place(s) has been updated")}`,
                  });
                }
              }
              return placeObject;
            })
          );
        } else if (res.data.error) {
          message.error(JSON.stringify(res.data.error));
        }
      }
    );
  };
  useEffect(() => {
    let gameId = data.universeId;
    if (gameId) {
      let tasks = [
        getGameData(gameId).then((res) => {
          if (res.status == 200) {
            setGameInfo(res.data.data[0]);
          }
        }),
        getGameIcon(gameId).then((res) => {
          if (res.status == 200) {
            setGameIcon(res.data.data[0]?.imageUrl);
          }
        }),
        getDeveloperEmail(gameId, authState.accessToken.value).then((res) => {
          if (res.status == 200) {
            setDeveloperEmail(res.data.data);
          }
        }),
        loadAllPlaceInfos(),
      ];
      loading(Promise.all(tasks));
    }
    let timer = setInterval(updatePlaces, 60000);
    return () => clearInterval(timer);
  }, [ticket]);
  if (!userInfo || !gameInfo) return null;
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          backgroundColor: "#fff",
          position: "relative",
          padding: "0 24px",
        }}
        className="place-update-ticket"
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
            {t("GameOptIn")} #{ticket.ticketId}
          </div>
          <div
            style={{
              height: 20,
              lineHeight: "20px",
              fontSize: "12px",
              marginBottom: 4,
            }}
          >
            <InfoTitle title={t("Ticket")} />
            <InfoSpan
              name={t("createdUtc")}
              value={parseDateTimeWithTimeZone(
                moment.utc(ticket.dynamicEvent.createdUtc).toDate()
              )}
            />
            <InfoSpan name={t("status")} value={ticket.status} />
            <InfoSpan name={t("ticketId")} value={ticket.ticketId} />
          </div>
          <div
            style={{
              height: 20,
              lineHeight: "20px",
              fontSize: "12px",
              marginBottom: 4,
            }}
          >
            <InfoTitle title={t("Game")} />
            <InfoSpan
              name={t("gameId")}
              value={data.universeId}
              url={`https://www.roblox.com/games/${gameInfo.rootPlaceId}`}
            />
            <InfoSpan name={t("name")} value={gameInfo.name} />
            <InfoSpan
              name={t("Updated Time")}
              value={parseDateTimeWithTimeZone(moment.utc(gameInfo.updated).toDate())}
            />
          </div>
          <div
            style={{
              height: 20,
              lineHeight: "20px",
              fontSize: "12px",
              marginBottom: 4,
            }}
          >
            <InfoTitle title={t("Creator")} />
            <InfoSpan
              name={t("Creator ID")}
              value={gameInfo.creator.id}
              url={
                gameInfo.creator.type == "User"
                  ? `https://www.roblox.com/users/${gameInfo.creator.id}/profile/`
                  : `https://www.roblox.com/groups/${gameInfo.creator.id}`
              }
            />
            <InfoSpan name={t("Creator Name")} value={gameInfo.creator.name} />
            <InfoSpan name={t("Creator Type")} value={gameInfo.creator.type} />
            {developerEmail && (
              <InfoSpan name={t("Creator Email")} value={developerEmail} />
            )}
          </div>
          <div
            style={{
              lineHeight: "20px",
              fontSize: "12px",
              marginBottom: 4,
              display: "flex",
            }}
          >
            <InfoTitle title={t("Comment")} />
            <TextArea
              rows={2}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("Leave a comment")}
              style={{ width: "100%" }}
              maxLength={1000}
              showCount
            />
          </div>
        </div>
        {canSubmit() && (
          <div
            className="btns"
            style={{
              position: "absolute",
              top: 0,
              right: 24,
            }}
          >
            <Button
              onClick={reopen}
              type="primary"
              danger
              size="small"
              style={{ marginRight: 8 }}
            >
              {t("Repoen This Ticket With Comment")}
            </Button>
            <Button
              onClick={submit}
              type="primary"
              size="small"
              disabled={hasUnConfirmedPlace()}
            >
              {t("Submit")}
            </Button>
          </div>
        )}
      </div>
      <div
        className="place-list"
        style={{ backgroundColor: "#F4F5F6", padding: 24 }}
      >
        {places &&
          places.map((place) => {
            return (
              <PlaceBlock
                key={place.id}
                placeId={place.id}
                placeName={place.name}
                placeVersion={place.version}
                result={place.result}
                onChange={place.onChange}
                onConfirm={place.onConfirm}
                isConfirmed={place.confirmed}
                onRevert={place.onRevert}
                disabled={!place.isUpdated}
                // isSelected={place.selected}
                // onSelectChange={place.onSelectChange}
              />
            );
          })}
      </div>
    </>
  );
};

function PlaceBlock({
  result,
  onChange,
  onConfirm,
  isConfirmed,
  onRevert,
  placeId,
  placeName,
  placeVersion,
  disabled,
  // isSelected,
  // onSelectChange,
}) {
  const { t } = useTranslation();
  let copyBtn = useRef();
  useEffect(() => {
    let clipboardObject;
    if (copyBtn.current) {
      clipboardObject = new Clipboard(copyBtn.current);
      clipboardObject.on("success", function () {
        message.success(t("Copied"));
      });
    }
    return () => {
      if (clipboardObject) {
        clipboardObject.destroy();
      }
    };
  });
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 12,
        padding: "24px 16px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelectChange(!isSelected)}
        style={{ marginRight: 32 }}
      /> */}
      <div>
        <div style={{ fontSize: 12, marginBottom: 17 }}>
          <span style={{ fontSize: 18, fontWeight: "bold", marginRight: 32 }}>
            {placeName}
          </span>
          <InfoSpan name={t("Version")} value={t(placeVersion)} />
          <InfoSpan name={t("PlaceID")} value={placeId} />
          <InfoSpan
            name={t("Link")}
            value={`https://dev.roblox.cn/deeplink.html?placeid=${placeId}`}
          />
          <Button
            ref={copyBtn}
            size="small"
            data-clipboard-text={`https://dev.roblox.cn/deeplink.html?placeid=${placeId}`}
          >
            {t("Copy Link")}
          </Button>
        </div>
        {!disabled && (
          <>
            <Select
              value={result}
              onChange={onChange}
              size="small"
              style={{ width: 200, marginRight: 8 }}
            >
              <Option value={true}>
                <svg className="icon" aria-hidden="true">
                  <use href="#icon-circle"></use>
                </svg>
                {t("Pass")}
              </Option>
              <Option value={false}>
                <svg className="icon" aria-hidden="true">
                  <use href="#icon-circle-copy2"></use>
                </svg>
                {t("Not Pass")}
              </Option>
            </Select>
            <Button
              style={{ marginRight: 8 }}
              size="small"
              type="primary"
              disabled={isConfirmed}
              onClick={onConfirm}
            >
              {t("Confirm")}
            </Button>
            {isConfirmed && (
              <Button size="small" type="link" onClick={onRevert}>
                {t("Revert")}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
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

function getGameIcon(gameId) {
  return axios({
    method: "get",
    url: config.resourceServer.GetGameIcon(gameId),
  });
}
function getPlacesUnderGame(gameId, accessToken) {
  return axios({
    method: "get",
    url: config.resourceServer.GetPlacesUnderGameId,
    params: {
      gameId,
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
function getPlaceUpdateInfo(ticketId, accessToken) {
  return axios({
    method: "get",
    url: config.resourceServer.GetGameUpdateRecordByTicketId,
    params: {
      ticketId,
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
function InfoSpan({ name, value, url }) {
  if (url) {
    return (
      <LinkOut href={url} simple={true} style={{ marginRight: 16 }}>
        <span style={{ color: "#8C8C8C" }}>{name} </span>
        <span style={{ color: "#000" }}>{value}</span>
      </LinkOut>
    );
  }
  return (
    <>
      <span style={{ color: "#8C8C8C" }}>{name} </span>
      <span style={{ marginRight: 16 }}>{value}</span>
    </>
  );
}

function InfoTitle({ title }) {
  return <span style={{ fontWeight: "bold", marginRight: 16 }}>{title}</span>;
}
export default GameOptInTicketInfo;
