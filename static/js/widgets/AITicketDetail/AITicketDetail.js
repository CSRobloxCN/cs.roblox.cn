import React, { useEffect, useState } from "react";
import { Space, Layout } from "antd";
import "./AITicketDetailStyleOverride.css";
import { GameDetailCard } from "widgets/AITicketDetail/GameDetailCard";
import { MediaTab } from "widgets/AITicketDetail/MediaTab";
import axios from "axios";
import { useOktaAuth } from "@okta/okta-react";
import { loading } from "helpers/promiseWithLoading";
import config from "config";
import { getCache } from "./browserCache";
import {
  getAssetId,
  getAssetURL,
  isAssetLink,
  removeSystemAsset,
} from "helpers/rbxAssetIdParser";
const resourceServer = config.resourceServer;

const AITicketDetail = ({ ticket }) => {
  const { authState } = useOktaAuth();
  let [medias, setMedias] = useState(null);
  useEffect(() => {
    let dataStringId = ticket?.dynamicEvent?.dataString;
    if (ticket.moderatorActions && ticket.moderatorActions[0]) {
      try {
        dataStringId = JSON.parse(ticket.moderatorActions[0].comment).id;
      } catch (e) {
        console.error(e);
      }
    }
    if (dataStringId) {
      const accessToken = authState.accessToken.value;
      loading(
        axios({
          method: "get",
          url: resourceServer.GetPlaceSnapshotResult(dataStringId),
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then((res) => {
          if (res.status == 200) {
            let mediaDataRaw = JSON.parse(res.data.data.dataString);
            if (ticket.status == "Locked") {
              let cache = getCache(
                `${mediaDataRaw.placeId}_${mediaDataRaw.placeVersion}`
              );
              if (cache) {
                setMedias(JSON.parse(cache));
                preloadMedias(JSON.parse(cache).data);
                return;
              }
            }
            removeSystemAsset(mediaDataRaw.data);
            setMedias(mediaDataRaw);
            preloadMedias(mediaDataRaw.data);
          }
        })
      );
    }
  }, [ticket]);
  if (!medias) return null;
  return (
    <Space
      size={12}
      direction="vertical"
      style={{ width: "100%" }}
      className="ai-ticket"
    >
      <Layout.Content style={{ width: "100%", position: "relative" }}>
        <GameDetailCard placeId={medias.placeId} />
        <MediaTab
          mediaData={medias.data}
          placeId={medias.placeId}
          versionNumber={medias.placeVersion}
          ticketId={ticket.ticketId}
          isLocked={ticket.status == "Locked"}
        />
      </Layout.Content>
    </Space>
  );
};
async function preloadMedias(medias) {
  window.preloadImages = [];
  let mediaUrls = Object.keys(medias)
    .map((key) => {
      return medias[key];
    })
    .reduce((pre, cur) => (cur ? pre.concat(cur) : pre), []);
  for (let media of mediaUrls) {
    let url;
    if (!media) continue;
    if (media.assetUrl && /(image)|(screenshots)/i.test(media.type)) {
      if (isAssetLink(media.assetUrl)) {
        url = await getAssetURL(getAssetId(media.assetUrl));
      }
    } else {
      url = media.url;
    }
    if (url) {
      try {
        window.preloadImages.push(await loadImage(url));
      } catch (e) {
        console.log(e);
      }
    }
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (e) => reject(e);
    image.src = url;
    setTimeout(() => reject(), 15000);
  });
}
export default AITicketDetail;
