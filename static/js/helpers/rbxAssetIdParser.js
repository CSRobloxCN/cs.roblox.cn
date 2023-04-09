import axios from "axios";
import config from "config";
const assetUrlRegexp = /http:\/\/www.roblox.com\/asset\/?\?id=/i;
const assetIdRegexp = /rbxassetid:\/\//;
async function getAssetURL(assetId, useProxy) {
  if (!useProxy) {
    return Promise.resolve(
      `https://assetdelivery.roblox.qq.com/v1/asset?id=${assetId}`
    );
  }
  return await axios({
    url: config.resourceServer.GetAsset(assetId),
    params: { Accept: "application/json", "Accept-Encoding": "json" },
  }).then((res) => {
    if (res.status == 200 && res.data.location) {
      return res.data.location;
    } else {
      return "";
    }
  });
}

function getAssetId(string) {
  if (assetUrlRegexp.test(string)) {
    return string.replace(assetUrlRegexp, "").replace(/\s/g, "");
  }
  if (assetIdRegexp.test(string)) {
    return string.replace(assetIdRegexp, "").replace(/\s/g, "");
  }
  return string;
}

function isAssetLink(string) {
  return string && (assetIdRegexp.test(string) || assetUrlRegexp.test(string));
}

function removeSystemAsset(medias) {
  Object.keys(medias).forEach((key) => {
    if (!medias[key]) return;
    medias[key] = medias[key]
      .map((media) => {
        if (media.assetUrl) {
          if (!isAssetLink(media.assetUrl)) {
            return null;
          }
          media.type = key;
          return media;
        }
        if (media.url || media.text) {
          media.type = key;
          return media;
        }
      })
      .filter((v) => v);
  });
  console.log(medias);
}

export { getAssetId, getAssetURL, isAssetLink, removeSystemAsset };
