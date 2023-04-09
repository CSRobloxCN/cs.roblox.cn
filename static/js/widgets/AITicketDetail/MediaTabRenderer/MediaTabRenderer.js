import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Pagination, Tabs, TreeSelect, Checkbox } from "antd";
import { ratingMap } from "./ratingMap";
import { getAssetId, getAssetURL, isAssetLink } from "helpers/rbxAssetIdParser";
const { TabPane } = Tabs;
const flagOrderMap = {
  all: 0,
  red: 1,
  yellow: 2,
  undefined: 3,
};
const pageSize = 60;

const MediaTabRenderer = ({
  mediaData,
  mediaType,
  onFinish,
  onMediaUpdate,
  openFocusModeOnCurrentMedia,
  currentMedia,
}) => {
  const { t } = useTranslation();
  let [medias, setMedia] = useState(null);
  let [filter, setFilter] = useState("all");
  let [pageNum, setPageNum] = useState(1);
  let [sortByResult, setSortByResult] = useState(false);
  let [targetImageArray, setTargetImageArray] = useState([]);
  let [targetPageImageArray, setTargetPageImageArray] = useState([]);

  let changeFilter = (filter) => {
    setFilter(filter);
  };

  let getFilterTabName = (flagName) => {
    let filteredImageArray = getFilteredContent(medias, flagName);
    let confirmedFilteredImageArray = filteredImageArray.filter(
      (v) => v.result
    );
    return (
      <div>
        {t(flagName)} {confirmedFilteredImageArray.length}/
        {filteredImageArray.length}
      </div>
    );
  };

  let getFilteredContent = (mediaArray, flagName) => {
    switch (flagName) {
      case "all":
        return mediaArray;
      default:
        return mediaArray.filter((v) => v?.aiMeta?.flag == flagName);
    }
  };

  let onConfirmResult = (media, result) => {
    media.result = result;
    setMedia(medias.filter((v) => v));
    onMediaUpdate(media);
  };

  useEffect(() => {
    setMedia(mediaData);

    if (!mediaData) return;
    let unconfirmedMedia = mediaData.filter((v) => !v.result);
    let confirmedMedia = mediaData.filter((v) => v.result);
    let targetImageSourceArray = sortByResult
      ? unconfirmedMedia.concat(confirmedMedia)
      : mediaData;
    let targetImageArray = getFilteredContent(targetImageSourceArray, filter);
    let targetPageImageArray = targetImageArray.slice(
      pageSize * (pageNum - 1),
      pageSize * pageNum
    );
    if (unconfirmedMedia.length === 0) {
      onFinish(mediaType);
    }

    setTargetImageArray(targetImageArray);
    setTargetPageImageArray(targetPageImageArray);
  }, [mediaData, sortByResult, pageNum, filter, medias]);

  useEffect(() => {
    if (currentMedia) {
      let index = targetImageArray.indexOf(currentMedia);
      console.log(index);
      if (index != -1) {
        setPageNum(Math.ceil((index + 1) / pageSize));
      }
    }
  }, [currentMedia]);

  if (!medias) return null;

  return (
    <div style={{ backgroundColor: "#F0F0F0", padding: 24 }}>
      <div style={{ backgroundColor: "#fff", borderRadius: 8 }}>
        <div style={{ display: "flex", flexDirection: "row", padding: 20 }}>
          {false && (
            <Tabs
              onChange={changeFilter}
              activeKey={filter}
              className="filter-tab"
            >
              {Object.keys(flagOrderMap).map((flagName) => {
                return (
                  <TabPane
                    key={flagName}
                    tab={
                      <div
                        style={{
                          padding: "5px 16px",
                          height: 32,
                          border: `1px solid ${
                            filter == flagName ? "#1890FF" : "#D9D9D9"
                          }`,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {getFilterTabName(flagName)}
                      </div>
                    }
                  ></TabPane>
                );
              })}
            </Tabs>
          )}
          <Checkbox
            style={{ marginLeft: 16, lineHeight: "32px" }}
            checked={sortByResult}
            onChange={() => setSortByResult(!sortByResult)}
          >
            {t("Sort by completion status")}
          </Checkbox>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: mediaType === "text" ? "column" : "row",
            alignItems: "stretch",
            justifyContent: "left",
            flexWrap: "wrap",
          }}
        >
          {targetPageImageArray.map((media) => {
            return (
              <div
                key={media.path + media.url}
                style={{
                  margin: "0 16px 20px",
                  width: mediaType == "text" ? "auto" : 216,
                }}
              >
                <MediaBox
                  media={media}
                  mediaType={mediaType}
                  openFocusModeOnCurrentMedia={openFocusModeOnCurrentMedia}
                />
                <RatingBox
                  result={media.result}
                  ratingMap={ratingMap}
                  onChange={(result) => onConfirmResult(media, result)}
                />
              </div>
            );
          })}
        </div>
        <Pagination
          current={pageNum}
          pageSize={pageSize}
          hideOnSinglePage={false}
          showQuickJumper={true}
          showSizeChanger={false}
          total={targetImageArray.length}
          onChange={setPageNum}
          style={{ float: "right" }}
        />
        <div style={{ clear: "both" }}></div>
      </div>
    </div>
  );
};
function MediaBox({ media, mediaType, openFocusModeOnCurrentMedia }) {
  let [url, setURL] = useState("");
  useEffect(() => {
    if (media.assetUrl) {
      if (isAssetLink(media.assetUrl)) {
        getAssetURL(
          getAssetId(media.assetUrl),
          mediaType == "sound" || mediaType == "video"
        ).then((url) => {
          setURL(url);
          media.url = url;
        });
      }
    } else {
      setURL(media.url);
    }
  }, [media.url, media.assetUrl]);
  let onDetail = () => {
    openFocusModeOnCurrentMedia(media);
  };
  switch (mediaType) {
    case "text":
      return (
        <TextBox text={media.text} path={media.path} onDetail={onDetail} />
      );
    case "image":
    case "snapshot":
    case "screenshots":
      return (
        <ImageBox
          image={url}
          path={media.path}
          onDetail={onDetail}
          showTitle={mediaType == "screenshots"}
        />
      );
    case "video":
      return <VideoBox video={url} path={media.path} onDetail={onDetail} />;
    case "audio":
    case "sound":
      return <AudioBox audio={url} path={media.path} onDetail={onDetail} />;
  }
}

const RatingBox = ({ result, ratingMap, onChange }) => {
  const { t } = useTranslation();
  let [tempResult, setTempResult] = useState(null);
  useEffect(() => {
    setTempResult(result);
  }, [result]);
  let mapFilter = (text, node) => {
    let newText = text.replace(/[^\d]/g, "");
    let regexp = new RegExp(`^${newText}.*`);
    let targetText = node.value.replace(/[^\d]/g, "");
    let tempResult = regexp.test(targetText);
    return tempResult;
  };
  let changeTempResult = (value) => {
    setTempResult(value);
  };
  let confirmTempResult = () => {
    onChange(tempResult);
  };
  let isConfirmed = tempResult === result && tempResult && result;
  let treeSelect = (
    <TreeSelect
      treeData={ratingMap}
      treeDefaultExpandAll
      onChange={changeTempResult}
      style={{ width: "100%" }}
      showSearch
      allowClear
      filterTreeNode={mapFilter}
      value={tempResult}
      size="medium"
      virtual={false}
      multiple={true}
    />
  );
  let btnStyle = {
    height: 28,
    padding: "4px 8px",
    fontSize: "12px",
    marginTop: 8,
  };
  let confirmBtns = (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      {!isConfirmed && (
        <Button style={btnStyle} type="primary" onClick={confirmTempResult}>
          {t("Confirm")}
        </Button>
      )}
      {isConfirmed && (
        <Button style={btnStyle} disabled>
          {t("Confirmed")}
        </Button>
      )}
    </div>
  );
  return (
    <div style={{ width: "100%", marginTop: 8 }}>
      {treeSelect}
      {confirmBtns}
    </div>
  );
};
function getImageBaseName(url, path, t) {
  let filename = url.replace(/.*\//, "").replace(/\..*/, "");
  let objectname = path.replace(/.*;/, "").replace(/:::/, ".");
  return objectname + " - " + t(filename);
}
const ImageBox = ({ image, path, onDetail, showTitle }) => {
  let [loadFailed, setLoadFailed] = useState(false);
  let [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    setLoadFailed(false);
    setIsLoading(true);
  }, [image, path]);
  return (
    <div
      style={{
        position: "relative",
        width: 216,
        height: 162,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        cursor: "pointer",
        overflow: "hidden",
      }}
      className="transparent-bg"
      onClick={!loadFailed && !isLoading ? onDetail : null}
    >
      {showTitle && (
        <div
          className="title"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 40,
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)",
            color: "#fff",
            zIndex: 2,
            paddingLeft: 12,
            fontSize: 10,
          }}
        >
          {getImageBaseName(image, path, t)}
        </div>
      )}
      {loadFailed ? (
        <div
          style={{
            flex: "0 1 auto",
            height: "100%",
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg
            width="216"
            height="216"
            viewBox="0 0 216 216"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
          >
            <g clipPath="url(#clip0)">
              <rect width="216" height="216" fill="white" />
              <rect width="480" height="480" fill="#434343" />
              <g clipPath="url(#clip1)">
                <g filter="url(#filter0_d)">
                  <path
                    d="M138.464 81.2877L87.2958 65.6312C85.8694 65.1951 84.3162 65.3441 82.9969 66.0455L17.0811 101.094C14.3339 102.554 13.2946 105.954 14.7553 108.701L83.4155 237.832C84.8762 240.579 88.2757 241.619 91.0229 240.158L190.354 187.342C193.102 185.882 194.141 182.482 192.68 179.735L141.788 84.0196C141.086 82.7004 139.89 81.7238 138.464 81.2877ZM77.2571 136.388C80.6871 134.564 84.9425 135.865 86.7663 139.295C88.59 142.725 87.2891 146.981 83.859 148.804C80.429 150.628 76.1736 149.327 74.3498 145.897C72.526 142.467 73.827 138.212 77.2571 136.388ZM147.46 157.591L90.3444 187.96C89.3045 188.513 88.0948 187.623 88.302 186.478L93.2945 158.5C93.3317 158.29 93.4163 158.091 93.5418 157.918C93.6673 157.746 93.8305 157.604 94.019 157.504C94.2074 157.403 94.4162 157.347 94.6295 157.34C94.8428 157.332 95.055 157.373 95.2501 157.46L105.953 162.201L109.842 140.384C109.879 140.174 109.964 139.975 110.089 139.803C110.215 139.63 110.378 139.488 110.566 139.388C110.755 139.288 110.964 139.232 111.177 139.224C111.39 139.217 111.602 139.258 111.797 139.345L147.342 155.086C148.439 155.538 148.484 157.047 147.46 157.591ZM102.337 107.923L86.8057 78.7128L131.546 92.3914L102.337 107.923Z"
                    fill="#474747"
                  />
                </g>
              </g>
            </g>
            <defs>
              <filter
                id="filter0_d"
                x="-11.8855"
                y="25.6367"
                width="231.207"
                height="245.161"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="12" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow"
                  result="shape"
                />
              </filter>
              <clipPath id="clip0">
                <rect width="216" height="216" fill="white" />
              </clipPath>
              <clipPath id="clip1">
                <rect
                  width="180"
                  height="180"
                  fill="white"
                  transform="translate(-18 107.006) rotate(-28)"
                />
              </clipPath>
            </defs>
          </svg>
          <div
            onClick={() => {
              setLoadFailed(false);
              setIsLoading(true);
            }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 2,
              color: "#fff",
            }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32.9552 4.83795L30.6892 6.60982C27.5994 2.66027 22.7941 0.125 17.3981 0.125C8.08069 0.125 0.539168 7.65848 0.527114 16.9799C0.51506 26.3094 8.07265 33.875 17.3981 33.875C24.6825 33.875 30.8901 29.2545 33.2526 22.7817C33.3128 22.6129 33.2244 22.4241 33.0557 22.3679L30.7776 21.5844C30.6981 21.5571 30.6112 21.5621 30.5354 21.5981C30.4595 21.6342 30.4008 21.6985 30.3718 21.7772C30.2994 21.9781 30.2191 22.179 30.1347 22.3759C29.4396 24.0232 28.4432 25.5018 27.1735 26.7714C25.9141 28.0332 24.423 29.04 22.782 29.7366C21.0825 30.4558 19.2704 30.8214 17.4061 30.8214C15.5378 30.8214 13.7298 30.4558 12.0302 29.7366C10.3876 29.0429 8.89599 28.0358 7.63872 26.7714C6.37591 25.5122 5.37017 24.0193 4.67756 22.3759C3.95836 20.6723 3.59274 18.8643 3.59274 16.996C3.59274 15.1277 3.95836 13.3196 4.67756 11.6161C5.37265 9.96875 6.36908 8.49018 7.63872 7.22054C8.90836 5.95089 10.3869 4.95446 12.0302 4.25536C13.7298 3.53616 15.5418 3.17054 17.4061 3.17054C19.2744 3.17054 21.0825 3.53616 22.782 4.25536C24.4246 4.94902 25.9163 5.95619 27.1735 7.22054C27.5713 7.6183 27.945 8.04018 28.2905 8.48214L25.8718 10.3705C25.8239 10.4076 25.7875 10.4573 25.7666 10.5141C25.7458 10.571 25.7414 10.6325 25.754 10.6917C25.7666 10.7508 25.7957 10.8053 25.8378 10.8487C25.88 10.8921 25.9335 10.9227 25.9923 10.9371L33.0477 12.6647C33.2485 12.7129 33.4454 12.5603 33.4454 12.3554L33.4776 5.08705C33.4735 4.82188 33.1642 4.67321 32.9552 4.83795Z"
                fill="white"
              />
            </svg>
            <div>{t("Reload")}</div>
          </div>
        </div>
      ) : (
        <img
          src={image}
          style={{ flex: "0 1 auto", height: "100%", width: "100%" }}
          onError={() => setLoadFailed(true)}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
};

const TextBox = ({ text, onDetail }) => {
  return (
    <p
      style={{
        width: "100%",
        padding: 32,
        borderRadius: 8,
        backgroundColor: "#f5f5f5",
        margin: 0,
        cursor: "pointer",
      }}
      onClick={onDetail}
    >
      {text}
    </p>
  );
};

const VideoBox = ({ video, path }) => {
  if (!video) return <div style={{ width: 216 }}>{path}</div>;
  return <video src={video} controls style={{ width: 216 }}></video>;
};

const AudioBox = ({ audio, path }) => {
  if (!audio) return <div style={{ width: 216 }}>{path}</div>;
  return <audio src={audio} controls style={{ width: 216 }}></audio>;
};

export default MediaTabRenderer;
