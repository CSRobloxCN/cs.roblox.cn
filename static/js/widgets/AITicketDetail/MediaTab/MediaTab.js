import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button, message, Tabs } from "antd";
import { MediaTabRenderer } from "widgets/AITicketDetail/MediaTabRenderer";
import { FocusMode } from "widgets/AITicketDetail/FocusMode";
import { useOktaAuth } from "@okta/okta-react";
import axios from "axios";
import config from "config";
import { loading } from "helpers/promiseWithLoading";
import { setCache } from "../browserCache";
import { ModeratorAccount } from "context/ModeratorAccount";
const { TabPane } = Tabs;

const MediaTab = ({
  mediaData,
  placeId,
  versionNumber,
  ticketId,
  isLocked,
}) => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  let [finishedKeys, setFinishedKeys] = useState({});
  let [canSubmit, setCanSubmit] = useState(false);
  let [count, setCount] = useState({});
  let [showFocusMode, setShowFocusMode] = useState(false);
  let [currentMedia, setCurrentMedia] = useState(null);
  let [activeTabKey, setActiveTabKey] = useState(null);
  let userInfo = useContext(ModeratorAccount);
  let keys = Object.keys(mediaData)
    .filter((v) => mediaData[v])
    .sort();
  let onFinish = (key) => {
    finishedKeys[key] = true;
    setFinishedKeys(finishedKeys);
    console.log(finishedKeys);
    if (Object.keys(finishedKeys).length === keys.length) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };
  let updateCount = (updatedMedia) => {
    let newCount = {};
    keys.forEach((key) => {
      newCount[key] = {
        confirmed: mediaData[key].filter((v) => v.result).length,
        total: mediaData[key].length,
      };
      if (newCount[key].confirmed == newCount[key].total) {
        onFinish(key);
      }
    });
    setCount(newCount);
    setCurrentMedia(findNext(mediaData, updatedMedia, keys, setActiveTabKey));
    setCache(
      `${placeId}_${versionNumber}`,
      JSON.stringify({
        placeId,
        placeVersion: versionNumber,
        data: mediaData,
      })
    );
  };
  useEffect(() => {
    updateCount();
    setActiveTabKey(keys[0]);
  }, []);
  let onMoveForward = () => {
    setCurrentMedia(findNext(mediaData, currentMedia, keys, setActiveTabKey));
  };
  let onMoveBackward = () => {
    setCurrentMedia(
      findPrevious(mediaData, currentMedia, keys, setActiveTabKey)
    );
  };

  let openFocusModeOnCurrentMedia = (media) => {
    setCurrentMedia(media);
    setShowFocusMode(true);
  };
  let reopen = () => {
    loading(
      axios({
        method: "POST",
        url: config.resourceServer.SubmitTicketResult,
        data: {
          ticketId,
          result: "Reopen",
          comment: null,
          actionLength: 0,
          placeId: placeId,
          bypassWhitelistActions: true,
        },
        headers: {
          Authorization: `Bearer ${authState.accessToken.value}`,
        },
      }).then((res) => {
        if (res.status == 200 && res.data.data && !res.data.error) {
          message.success("");
          setTimeout(() => window.location.reload(), 2000);
        } else {
          message.error(res?.data?.error);
        }
      })
    );
  };
  let submit = () => {
    if (canSubmit) {
      loading(
        axios({
          method: "POST",
          url: config.resourceServer.SavePlaceSnapshotResult,
          data: {
            placeId,
            versionNumber,
            dataString: JSON.stringify({
              placeId,
              placeVersion: versionNumber,
              data: mediaData,
            }),
          },
          headers: { Authorization: `Bearer ${authState.accessToken.value}` },
        })
          .then((res) => {
            if (res.status == 200 && res.data.data && !res.data.error) {
              return res.data.data;
            } else {
              throw "Failed to save result";
            }
          })
          .then((id) => {
            return axios({
              method: "POST",
              url: config.resourceServer.SubmitTicketResult,
              data: {
                ticketId,
                result: "None",
                comment: JSON.stringify({ id }),
                actionLength: 0,
                placeId: placeId,
                bypassWhitelistActions: true,
              },
              headers: {
                Authorization: `Bearer ${authState.accessToken.value}`,
              },
            });
          })
          .then((res) => {
            if (res.status == 200 && res.data.data && !res.data.error) {
              message.success("");
              setTimeout(() => (window.location.href = "/"), 2000);
            } else {
              message.error(res?.data?.error);
            }
          })
      );
    }
  };
  if (!userInfo) return null;
  return (
    <>
      {isLocked && (
        <div style={{ position: "absolute", top: 20, right: 20 }}>
          <Button style={{ marginRight: 8 }} danger onClick={reopen}>
            {t("Repoen This Ticket")}
          </Button>
          <Button type="primary" disabled={!canSubmit} onClick={submit}>
            {t("Complete and Submit")}
          </Button>
        </div>
      )}
      <div style={{ marginTop: 12, position: "relative" }}>
        <div style={{ position: "absolute", top: 4, right: 20, zIndex: 999 }}>
          <Button
            onClick={() => setShowFocusMode(true)}
            style={{ backgroundColor: "#000", color: "#fff", borderRadius: 10 }}
          >
            {t("Focus Mode")}
          </Button>
          <FocusMode
            visible={showFocusMode}
            media={currentMedia}
            onChange={updateCount}
            count={count}
            close={() => setShowFocusMode(false)}
            onMoveForward={onMoveForward}
            onMoveBackward={onMoveBackward}
          />
        </div>
        <Tabs
          onChange={(key) => {
            setActiveTabKey(key);
            setCurrentMedia(mediaData[key][0]);
          }}
          activeKey={activeTabKey}
        >
          {keys.map((key) => {
            return (
              <TabPane
                tab={
                  <>
                    {t(key)}{" "}
                    {(count[key]?.confirmed || 0) +
                      "/" +
                      (count[key]?.total || 0)}
                  </>
                }
                key={key}
              >
                <MediaTabRenderer
                  mediaType={key}
                  mediaData={mediaData[key]}
                  onFinish={onFinish}
                  onMediaUpdate={updateCount}
                  openFocusModeOnCurrentMedia={openFocusModeOnCurrentMedia}
                  currentMedia={currentMedia}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    </>
  );
};
function findNext(mediaData, media, keys, setKey) {
  try {
    if (!media) {
      return mediaData[keys[0]][0];
    }
    let index = mediaData[media.type].indexOf(media);
    if (index == mediaData[media.type].length - 1) {
      let keyIndex = keys.indexOf(media.type);
      let nextKey = keys[keyIndex + 1];
      setKey(nextKey);
      return mediaData[nextKey][0];
    } else {
      return mediaData[media.type][index + 1];
    }
  } catch {
    return media;
  }
}
function findPrevious(mediaData, media, keys, setKey) {
  try {
    if (!media) {
      return mediaData[keys[0]][0];
    }
    let index = mediaData[media.type].indexOf(media);
    if (index == 0) {
      let keyIndex = keys.indexOf(media.type);
      let nextKey = keys[keyIndex - 1];
      setKey(nextKey);
      return mediaData[nextKey][mediaData[nextKey].length - 1];
    } else {
      return mediaData[media.type][index - 1];
    }
  } catch {
    return media;
  }
}
export default MediaTab;
