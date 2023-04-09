import React from "react";
import { Button, Typography, Badge } from "antd";
import { LinkOut } from "components/LinkOut";
const { Text } = Typography;
import GetActionAndModalDataMethod from "./GetActionAndModalDataMethod";

const GetRecentAssetStatusCols = (
  t,
  AssetStatusUpdateRequest,
  buttonRefArray
) => {
  if (!t) {
    return;
  }

  const getActionAndModalDataMethod = GetActionAndModalDataMethod(t);
  const GetCopyIds = (row) => {
    let idsString = row.id;
    if (row.isBundle) {
      row.bundleItems.forEach((x) => {
        idsString += "," + x.itemTargetId;
      });
    }
    return idsString;
  };

  //   "id": 1501,
  //   "assetType": "Place",
  //   "name": "test",
  //   "creator": "builderman",
  //   "creatorId": 156,
  //   "moderatorComment": "remove from whitelist tony-test002",
  //   "isInWhitelist": false,
  //   "isInReview": false,
  //   "violationType": "Vulgarity and pornograpy"
  return [
    {
      title: `${t("Asset")} / ${t("Bundle ID")}`,
      dataIndex: "id",
      key: "id",
      render: function getId(id, row) {
        return (
          <a href={row.assetUrl} target="_blank" rel="noreferrer">
            {id}
          </a>
        );
      },
    },
    {
      title: t("Asset Type"),
      dataIndex: "assetType",
      key: "assetType",
      render: function getAssetType(assetType, row) {
        return (
          <div>
            {row.isBundle ? (
              <Text>{t("Bundle")}</Text>
            ) : (
              <Text>{t(assetType)}</Text>
            )}
          </div>
        );
      },
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("Creator"),
      dataIndex: "creator",
      key: "creator",
    },
    {
      title: t("Comment"),
      dataIndex: "moderatorComment",
      key: "moderatorComment",
      render: function getComments(moderatorComment, row) {
        return (
          <div>
            {moderatorComment && (
              <div>
                <Text type="secondary">{t("Moderation Comment")}</Text>{" "}
                <Text>{moderatorComment}</Text>
              </div>
            )}
            {!row.isInWhitelist &&
              row.violationType &&
              row.violationType != "None" && (
                <div>
                  <Badge
                    status="error"
                    size="small"
                    text={t(row.violationType)}
                  />
                </div>
              )}
          </div>
        );
      },
    },
    {
      title: t("Whitelist Status"),
      dataIndex: "isInWhitelist",
      key: "isInWhitelist",
      render: function getWhitelistStatus(isInWhitelist, row) {
        return (
          <div>
            {isInWhitelist !== null && (
              <Text>
                {isInWhitelist ? t("inWhitelist") : t("notInWhitelist")}
              </Text>
            )}
            {row.isInReview && (
              <div>
                <Text>{"(" + t("inReview") + ")"}</Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      // isInReview is true =>
      //	"Submit to moderate", "Approve Asset Update" and "Reject Asset Update" will be disable
      // else => 3 buttons above will be enable
      title: t("Status Management"),
      key: "Status Management",
      render: function getStatusManagement(row) {
        return (
          <div>
            <div>
              {
                <div style={{ display: "flex" }}>
                  <Button
                    type="link"
                    block={true}
                    disabled={row.isInReview}
                    onClick={() =>
                      AssetStatusUpdateRequest(
                        row,
                        getActionAndModalDataMethod[0]
                      )
                    }
                  >
                    {t("Submit to moderate")}
                  </Button>
                  <Button
                    type="link"
                    danger
                    block={true}
                    disabled={row.isInReview || !row.isInWhitelist}
                    onClick={() =>
                      AssetStatusUpdateRequest(
                        row,
                        getActionAndModalDataMethod[1]
                      )
                    }
                  >
                    {t("Reject Asset Update")}
                  </Button>
                </div>
              }
            </div>
            <div>
              {
                <div style={{ display: "flex" }}>
                  <Button
                    type="link"
                    block={true}
                    disabled={row.isInReview || row.isInWhitelist}
                    onClick={() =>
                      AssetStatusUpdateRequest(
                        row,
                        getActionAndModalDataMethod[2]
                      )
                    }
                  >
                    {t("Approve Asset Update")}
                  </Button>
                  <Button
                    type="link"
                    block={true}
                    ref={buttonRefArray.current[row.index]}
                    data-clipboard-text={GetCopyIds(row)}
                  >
                    {t("CopyIDs")}
                  </Button>
                </div>
              }
            </div>
          </div>
        );
      },
    },
    {
      title: t("Whitelist Record"),
      key: "Whitelist Record",
      render: function getWhitelistRecord(row) {
        let targetString = row.isBundle ? "Bundle" : "Asset";
        let url = "/asset-whitelist-history?" + targetString + "=" + row.id;
        return (
          <div>
            <LinkOut href={url}>
              <Button>{t("Action History")}</Button>
            </LinkOut>
          </div>
        );
      },
    },
  ];
};

export default GetRecentAssetStatusCols;
