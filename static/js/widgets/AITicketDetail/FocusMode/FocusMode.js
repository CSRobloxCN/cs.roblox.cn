import React, { useEffect, useRef, useState } from "react";
import { getAssetId, getAssetURL, isAssetLink } from "helpers/rbxAssetIdParser";
import { Progress, Menu, Tag, Input, Button } from "antd";
import { useTranslation } from "react-i18next";
import { ratingMap } from "./ratingMap";

// import { useTranslation } from "react-i18next";
const submitterWidth = 304;
const overviewSize = [256, 192];
const FocusMode = ({
  visible,
  onChange,
  media,
  count,
  close,
  onMoveForward,
  onMoveBackward,
}) => {
  const { t } = useTranslation();
  let [windowWidth, setWindowWidth] = useState(0);
  let [windowHeight, setWindowHeight] = useState(0);
  let [selections, setSelections] = useState([]);
  let [filterText, setFilterText] = useState("");
  let [emptyStateOpenedKeys, setEmptyStateOpenedKeys] = useState([]);
  let [focusedMenuItem, setFocusedMenuItem] = useState(null);
  let [position, setPositon] = useState({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    imageWidth: 1,
    imageHeight: 1,
    view: [0, 0, 0, 0],
  });
  let [tempUrl, setTempUrl] = useState("");
  let [confirmBtnFocused, setConfirmBtnFocused] = useState(false);
  let inputRef = useRef();
  let confirmBtn = useRef();
  let focusOnInput = () => {
    inputRef.current?.focus();
  };
  useEffect(() => {
    setTempUrl("");
    if (media?.assetUrl && !media?.url) {
      if (isAssetLink(media.assetUrl)) {
        getAssetURL(
          getAssetId(media.assetUrl),
          media.type == "sound" || media.type == "video"
        ).then((url) => {
          media.url = url;
          setTempUrl(url);
        });
      }
    }
    if (media?.result) {
      setSelections(media.result);
    }
  }, [media]);
  useEffect(() => {
    setWindowWidth(window.document.documentElement.offsetWidth);
    setWindowHeight(window.document.documentElement.offsetHeight);
    focusOnInput();
    if (confirmBtnFocused) {
      confirmBtn.current?.focus();
    }
  });

  if (!media || !visible || !count) return null;
  let removeSelection = (e) => {
    setSelections(selections.filter((s) => s != e));
  };
  let addSelection = (e) => {
    setSelections(selections.concat([e]));
  };
  let mediaValue = media.url || tempUrl || media.text;
  let overviewRatio = 0;
  let menuMap = ratingMap
    .map((subMenu) => {
      if (!subMenu.children) {
        if (testRegexp(subMenu.value, filterText)) {
          return subMenu;
        }
      } else {
        let subMenuTemp = Object.assign({}, subMenu, {
          children: subMenu.children
            .map((item) => {
              if (testRegexp(item.value, filterText)) {
                return item;
              }
            })
            .filter((v) => v),
        });
        if (subMenuTemp.children.length) {
          return subMenuTemp;
        }
      }
    })
    .filter((v) => v);
  let tryConfirmFilterText = () => {
    let key;
    if (focusedMenuItem) {
      key = focusedMenuItem.value;
    }
    if (!key) {
      return;
    }
    if (selections.indexOf(key) != -1) {
      removeSelection(key);
      return;
    }
    addSelection(key);
  };

  let openedKeys = filterText
    ? menuMap
        .filter((subMenu) => subMenu.children)
        .map((subMenu) => subMenu.value)
    : emptyStateOpenedKeys;
  if (position) {
    overviewRatio = Math.min(
      overviewSize[1] / position.imageHeight,
      overviewSize[0] / position.imageWidth
    );
  }
  let onConfirm = () => {
    console.log(selections);
    if (!selections || !selections.length) return;
    media.result = selections.map((v) => v);
    setSelections([]);
    setFilterText("");
    if (focusedMenuItem) {
      focusedMenuItem.focused = false;
    }
    setFocusedMenuItem(null);
    setConfirmBtnFocused(false);
    setEmptyStateOpenedKeys([]);
    onChange(media);
  };
  let moveNext = () => {
    setSelections([]);
    setFilterText("");
    if (focusedMenuItem) {
      focusedMenuItem.focused = false;
    }
    setFocusedMenuItem(null);
    setConfirmBtnFocused(false);
    setEmptyStateOpenedKeys([]);
    onMoveForward();
  };
  let movePrev = () => {
    setSelections([]);
    setFilterText("");
    if (focusedMenuItem) {
      focusedMenuItem.focused = false;
    }
    setFocusedMenuItem(null);
    setConfirmBtnFocused(false);
    setEmptyStateOpenedKeys([]);
    onMoveBackward();
  };
  let selectMenuItemWithOffset = (offset) => {
    if (focusedMenuItem) {
      let cate = parseInt(focusedMenuItem.value.split(".")[0]);
      let subMenu = menuMap.find((subMenu) => subMenu.value == cate);
      if (subMenu?.children) {
        let index = subMenu.children.findIndex((v) => v == focusedMenuItem);
        let nextMenuItem = subMenu.children[index + offset];
        if (!nextMenuItem) {
          let subMenuIndex = menuMap.indexOf(subMenu);
          let nextIndex = subMenuIndex + offset;
          if (menuMap[nextIndex]) {
            setEmptyStateOpenedKeys(
              emptyStateOpenedKeys
                .filter((v) => v != subMenu.value)
                .concat([menuMap[nextIndex].value])
            );
            if (!menuMap[nextIndex].children) {
              nextMenuItem = menuMap[nextIndex];
            } else {
              nextMenuItem =
                menuMap[nextIndex].children[
                  offset > 0 ? 0 : menuMap[nextIndex].children.length - 1
                ];
            }
          }
        }
        if (nextMenuItem) {
          focusedMenuItem.focused = false;
          nextMenuItem.focused = true;
          setFocusedMenuItem(nextMenuItem);
        } else {
          focusedMenuItem.focused = false;
          return offset;
        }
      } else {
        let nextMenuItem;
        let subMenuIndex = menuMap.indexOf(subMenu);
        let nextIndex = subMenuIndex + offset;
        if (menuMap[nextIndex]) {
          setEmptyStateOpenedKeys(
            emptyStateOpenedKeys
              .filter((v) => v != subMenu.value)
              .concat([menuMap[nextIndex].value])
          );
          if (!menuMap[nextIndex].children) {
            nextMenuItem = menuMap[nextIndex];
          } else {
            nextMenuItem = menuMap[nextIndex].children[0];
          }
        }
        if (nextMenuItem) {
          focusedMenuItem.focused = false;
          nextMenuItem.focused = true;
          setFocusedMenuItem(nextMenuItem);
        } else {
          focusedMenuItem.focused = false;
          return offset;
        }
      }
    } else {
      if (!menuMap || !menuMap[0]) return 0;
      let nextMenuItem;
      if (offset > 0) {
        nextMenuItem = menuMap[0].children
          ? menuMap[0].children[0]
          : menuMap[0];
      } else {
        nextMenuItem = menuMap[menuMap.length - 1].children
          ? menuMap[menuMap.length - 1].children[
              menuMap[menuMap.length - 1].children.length - 1
            ]
          : menuMap[menuMap.length - 1];
        setEmptyStateOpenedKeys(
          emptyStateOpenedKeys.concat([menuMap[menuMap.length - 1].value])
        );
      }

      nextMenuItem.focused = true;
      setFocusedMenuItem(nextMenuItem);
    }
  };
  let selectNextMenuItem = () => {
    if (confirmBtnFocused) {
      return;
    }
    if (selectMenuItemWithOffset(1) == 1) {
      setFocusedMenuItem(null);
      setConfirmBtnFocused(true);
    } else {
      setConfirmBtnFocused(false);
    }
  };
  let selectPreviousMenuItem = () => {
    selectMenuItemWithOffset(-1);
    setConfirmBtnFocused(false);
  };
  let onKeyboard = (e) => {
    switch (e.key) {
      case "ArrowDown":
        selectNextMenuItem();
        break;
      case "ArrowUp":
        selectPreviousMenuItem();
        break;
      case "ArrowRight":
        moveNext();
        break;
      case "ArrowLeft":
        movePrev();
        break;
    }
  };
  let preventArrowMove = (e) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "ArrowRight":
      case "ArrowLeft":
        e.preventDefault();
        break;
    }
  };
  return (
    <div
      style={{
        width: windowWidth,
        height: windowHeight,
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "row",
      }}
      onMouseUp={focusOnInput}
      onKeyDown={onKeyboard}
    >
      <div
        className="image-viewer"
        style={{
          width: windowWidth - submitterWidth,
          height: windowHeight,
          position: "relative",
          backgroundColor: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Media
          value={mediaValue}
          type={media.type}
          width={windowWidth - submitterWidth}
          height={windowHeight}
          onChange={setPositon}
        />
        <div
          onClick={movePrev}
          style={{
            position: "absolute",
            top: "50%",
            left: 27,
            marginTop: -21,
            width: 42,
            height: 42,
            cursor: "pointer",
          }}
        >
          <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 0C9.40313 0 0 9.40313 0 21C0 32.5969 9.40313 42 21 42C32.5969 42 42 32.5969 42 21C42 9.40313 32.5969 0 21 0ZM25.875 14.8547C25.875 15.3328 25.6453 15.7875 25.2562 16.0687L18.4406 21L25.2562 25.9313C25.6453 26.2125 25.875 26.6625 25.875 27.1453V29.3438C25.875 29.6484 25.5281 29.8266 25.2797 29.6484L13.7484 21.3047C13.7005 21.2702 13.6615 21.2247 13.6346 21.1722C13.6077 21.1196 13.5936 21.0614 13.5936 21.0023C13.5936 20.9433 13.6077 20.8851 13.6346 20.8325C13.6615 20.7799 13.7005 20.7345 13.7484 20.7L25.2797 12.3563C25.3357 12.3156 25.4019 12.2912 25.471 12.2858C25.54 12.2805 25.6092 12.2943 25.6709 12.3259C25.7325 12.3574 25.7842 12.4054 25.8202 12.4646C25.8563 12.5237 25.8752 12.5917 25.875 12.6609V14.8547Z"
              fill="white"
            />
          </svg>
        </div>
        <div
          onClick={moveNext}
          style={{
            position: "absolute",
            top: "50%",
            right: 27,
            marginTop: -21,
            width: 42,
            height: 42,
            transform: "rotate(180deg)",
            cursor: "pointer",
          }}
        >
          <svg
            width="42"
            height="42"
            viewBox="0 0 42 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 0C9.40313 0 0 9.40313 0 21C0 32.5969 9.40313 42 21 42C32.5969 42 42 32.5969 42 21C42 9.40313 32.5969 0 21 0ZM25.875 14.8547C25.875 15.3328 25.6453 15.7875 25.2562 16.0687L18.4406 21L25.2562 25.9313C25.6453 26.2125 25.875 26.6625 25.875 27.1453V29.3438C25.875 29.6484 25.5281 29.8266 25.2797 29.6484L13.7484 21.3047C13.7005 21.2702 13.6615 21.2247 13.6346 21.1722C13.6077 21.1196 13.5936 21.0614 13.5936 21.0023C13.5936 20.9433 13.6077 20.8851 13.6346 20.8325C13.6615 20.7799 13.7005 20.7345 13.7484 20.7L25.2797 12.3563C25.3357 12.3156 25.4019 12.2912 25.471 12.2858C25.54 12.2805 25.6092 12.2943 25.6709 12.3259C25.7325 12.3574 25.7842 12.4054 25.8202 12.4646C25.8563 12.5237 25.8752 12.5917 25.875 12.6609V14.8547Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
      <div
        className="result-submitter"
        style={{
          width: submitterWidth,
          height: windowHeight,
          color: "white",
          position: "relative",
          paddingBottom: 80,
          backgroundColor: "#000",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            padding: 24,
          }}
        >
          <div
            className="progress"
            style={{
              display: "flex",
              flexDirection: "row",
              height: 30,
              lineHeight: "30px",
              alignItems: "center",
            }}
          >
            <div
              className="close"
              onClick={close}
              style={{
                cursor: "pointer",
                marginRight: 20,
                fontSize: 20,
                textAlign: "center",
              }}
            >
              ×
            </div>
            <Progress
              percent={
                (count[media.type]?.confirmed / count[media.type]?.total) * 100
              }
              showInfo={false}
              style={{
                height: 30,
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            />
            <span style={{ marginLeft: 20 }}>
              {count[media.type]?.confirmed + "/" + count[media.type]?.total}
            </span>
          </div>
          {(media.type == "image" || media.type == "screenshots") && (
            <div
              className="overview"
              style={{
                width: overviewSize[0],
                height: overviewSize[1],
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#111",
              }}
            >
              <div
                className="path"
                style={{
                  position: "absolute",
                  padding: 10,
                  top: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                  pointerEvents: "none",
                  zIndex: 2,
                  background:
                    "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)",
                }}
              >
                {getImageBaseName(media.url, media.path, t)}
              </div>
              {position && (
                <img
                  src={mediaValue}
                  style={{
                    position: "absolute",
                    top:
                      (overviewSize[1] - overviewRatio * position.imageHeight) /
                      2,
                    left:
                      (overviewSize[0] - overviewRatio * position.imageWidth) /
                      2,
                    width: overviewRatio * position.imageWidth,
                    height: overviewRatio * position.imageHeight,
                  }}
                />
              )}
              {position && (
                <div
                  className="frame"
                  style={{
                    position: "absolute",
                    top:
                      position.view[1] * overviewRatio * position.imageHeight +
                      (overviewSize[1] - overviewRatio * position.imageHeight) /
                        2,
                    left:
                      position.view[0] * overviewRatio * position.imageWidth +
                      (overviewSize[0] - overviewRatio * position.imageWidth) /
                        2,
                    width:
                      (position.view[2] - position.view[0]) *
                      overviewRatio *
                      position.imageWidth,
                    height:
                      (position.view[3] - position.view[1]) *
                      overviewRatio *
                      position.imageHeight,
                    border: "2px solid #fff",
                  }}
                ></div>
              )}
            </div>
          )}
          <div className="selections" style={{ margin: "16px 0" }}>
            {selections.map((s) => {
              return (
                <Tag
                  key={s}
                  closable
                  onClose={() => removeSelection(s)}
                  color="rgba(153,153,153,0.4)"
                >
                  {parseMenuValue(s, ratingMap)}
                </Tag>
              );
            })}
          </div>
          <div className="multi-input">
            <Input
              style={{
                width: "100%",
                backgroundColor: "transparent",
                color: "#fff",
              }}
              onChange={(e) => setFilterText(e.target.value)}
              onPressEnter={tryConfirmFilterText}
              ref={inputRef}
              value={filterText}
              onKeyDown={preventArrowMove}
            ></Input>
          </div>
          <div className="options"></div>
          <Menu
            mode="inline"
            theme="dark"
            multiple={true}
            onSelect={(e) => setSelections(e.selectedKeys)}
            onDeselect={(e) => setSelections(e.selectedKeys)}
            selectedKeys={selections}
            openKeys={openedKeys}
            onOpenChange={setEmptyStateOpenedKeys}
          >
            {menuMap.map((subMenu) => {
              if (subMenu.children) {
                return (
                  <Menu.SubMenu key={subMenu.value} title={subMenu.title}>
                    {subMenu.children.map((subMenuItem) => {
                      return (
                        <Menu.Item
                          key={subMenuItem.value}
                          style={
                            subMenuItem.focused
                              ? {
                                  backgroundColor: "rgba(153, 153, 153, 0.2)",
                                  color: "#fff",
                                }
                              : {}
                          }
                        >
                          <input
                            readOnly
                            type="checkbox"
                            style={{ width: 20, pointerEvents: "none" }}
                            checked={
                              selections.indexOf(subMenuItem.value) != -1
                            }
                          />
                          {subMenuItem.title}
                        </Menu.Item>
                      );
                    })}
                  </Menu.SubMenu>
                );
              } else {
                return (
                  <Menu.Item
                    key={subMenu.value}
                    style={
                      subMenu.focused
                        ? {
                            backgroundColor: "rgba(153, 153, 153, 0.2)",
                            color: "#fff",
                          }
                        : {}
                    }
                  >
                    <input
                      readOnly
                      type="checkbox"
                      style={{ width: 20, pointerEvents: "none" }}
                      checked={selections.indexOf(subMenu.value) != -1}
                    />
                    {subMenu.title}
                  </Menu.Item>
                );
              }
            })}
          </Menu>
        </div>
        <div
          style={{
            width: "100%",
            height: 80,
            padding: 24,
            position: "absolute",
            bottom: 0,
            left: 0,
            backgroundColor: "#000",
          }}
        >
          <Button
            className="confirm-btn"
            onClick={onConfirm}
            type="primary"
            ref={confirmBtn}
            disabled={
              arrayCompare(media.result, selections) || !selections.length
            }
            style={{ width: "100%" }}
          >
            {t("Confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
};
function Media({ value, type, width, height, onChange }) {
  switch (type) {
    case "text":
      return (
        <p
          style={{
            color: "#fff",
            padding: "128px 64px",
            width,
            height,
            fontSize: 24,
          }}
        >
          {value}
        </p>
      );
    case "sound":
      return (
        <audio
          src={value}
          style={{ width: width - 48 * 2, margin: "0 48px" }}
          controls
        ></audio>
      );
    case "video":
      return <video src={value} style={{ width, height }} controls></video>;
    case "image":
    case "screenshots":
      return (
        <ScalableImage
          src={value}
          width={width}
          height={height}
          onChange={onChange}
        ></ScalableImage>
      );
  }
  return null;
}
function ScalableImage({ src, width, height, onChange }) {
  let [loadFailed, setLoadFailed] = useState(false);
  let [offsetX, setOffsetX] = useState(0);
  let [offsetY, setOffsetY] = useState(0);
  let [scale, setScale] = useState(1);
  let [imageWidth, setImageWidth] = useState(0);
  let [imageHeight, setImageHeight] = useState(0);
  let [clickPosition, setClickPosition] = useState([0, 0]);
  let [isDragging, setIsDragging] = useState(false);
  let [imageSrc, setImageSrc] = useState(null);
  const { t } = useTranslation();
  let imageDom = useRef();
  let onImageLoad = (e) => {
    setImageWidth(e.target.naturalWidth);
    setImageHeight(e.target.naturalHeight);
    setOffsetX((width - e.target.naturalWidth) / 2);
    setOffsetY((height - e.target.naturalHeight) / 2);
    onSizeChange();
    console.log("load");
  };
  let onWheel = (e) => {
    let newScale = scale;
    if (e.deltaY > 0) {
      newScale = scale * 0.8;
    } else {
      newScale = scale / 0.8;
    }
    let sizeDiff = [
      (newScale - scale) * imageWidth,
      (newScale - scale) * imageHeight,
    ];
    let cursorPositionRatioX =
      (clickPosition[0] - offsetX) / imageWidth / scale;
    let cursorPositionRatioY =
      (clickPosition[1] - offsetY) / imageHeight / scale;
    setScale(newScale);
    setOffsetX(offsetX - sizeDiff[0] * cursorPositionRatioX);
    setOffsetY(offsetY - sizeDiff[1] * cursorPositionRatioY);
    onSizeChange();
  };
  let onMouseDown = () => {
    setIsDragging(true);
  };
  let onMouseUp = () => {
    setIsDragging(false);
  };
  let onMouseMove = (e) => {
    if (!isDragging) {
      setClickPosition([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
      return;
    }
    let diff = [e.movementX, e.movementY];
    setOffsetX(offsetX + diff[0]);
    setOffsetY(offsetY + diff[1]);
    setClickPosition([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
    onSizeChange();
  };
  let onSizeChange = () => {
    let viewX1 = offsetX > 0 ? 0 : -offsetX;
    let viewX2 =
      width - offsetX < 0 ? 0 : Math.min(width - offsetX, imageWidth * scale);
    let viewY1 = offsetY > 0 ? 0 : -offsetY;
    let viewY2 =
      height - offsetY < 0
        ? 0
        : Math.min(height - offsetY, imageHeight * scale);
    let currentWidth = imageWidth * scale;
    let currentHeight = imageHeight * scale;
    onChange({
      offsetX,
      offsetY,
      scale,
      imageWidth,
      imageHeight,
      view: [
        viewX1 / currentWidth,
        viewY1 / currentHeight,
        viewX2 / currentWidth,
        viewY2 / currentHeight,
      ],
    });
  };
  useEffect(() => {
    setOffsetX((width - (imageDom.current?.naturalWidth || 100)) / 2);
    setOffsetY((height - (imageDom.current?.naturalHeight || 100)) / 2);
    setScale(1);
    setImageWidth(imageDom.current?.naturalWidth || 100);
    setImageHeight(imageDom.current?.naturalHeight || 100);
    setImageSrc(src);
    setLoadFailed(false);
  }, [src]);
  return (
    <div
      className="image-container"
      style={{ width: width, height: height, position: "relative" }}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div
        style={{
          position: "absolute",
          top: offsetY,
          left: offsetX,
          width: imageWidth * scale,
          height: imageHeight * scale,
          pointerEvents: "none",
        }}
        className="transparent-bg"
      ></div>
      {loadFailed ? (
        <div
          onClick={() => {
            setLoadFailed(false);
          }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            position: "absolute",
            top: offsetY,
            left: offsetX,
            width: imageWidth * scale,
            height: imageHeight * scale,
            cursor: "pointer",
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
              fill="black"
            />
          </svg>
          <div>{t("Reload")}</div>
        </div>
      ) : (
        <img
          src={imageSrc}
          onLoad={onImageLoad}
          ref={imageDom}
          style={{
            position: "absolute",
            top: offsetY,
            left: offsetX,
            width: imageWidth * scale,
            height: imageHeight * scale,
            pointerEvents: "none",
          }}
          title="Preview"
          onError={() => setLoadFailed(true)}
        ></img>
      )}
    </div>
  );
}
function testRegexp(text, filter) {
  if (!filter) return true;
  let newText = filter.replace(/\D/g, "");
  if (!newText) return false;
  let regexp = new RegExp(`^${newText}.*`);
  let targetText = text.replace(/\D/g, "");
  return regexp.test(targetText);
}
function parseMenuValue(value, ratingMap) {
  let levels = value.split(".");
  let name = ratingMap[levels[0]].title;
  if (levels[1]) {
    let pLevel = ratingMap[levels[0]].children.filter(
      (v) => v.value == value
    )[0]?.title;
    return (
      <span>
        {name}
        {pLevel}
      </span>
    );
  }
  return name;
}

function arrayCompare(_arr1, _arr2) {
  if (
    !Array.isArray(_arr1) ||
    !Array.isArray(_arr2) ||
    _arr1.length !== _arr2.length
  ) {
    return false;
  }

  // .concat() to not mutate arguments
  const arr1 = _arr1.concat().sort();
  const arr2 = _arr2.concat().sort();

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function getImageBaseName(url, path, t) {
  let filename = url.replace(/.*\//, "").replace(/\..*/, "");
  let objectname = path.replace(/.*;/, "").replace(/:::/, ".");
  return objectname + " - " + t(filename);
}

export default FocusMode;
