import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Select, Input, Space, Row, Col, Descriptions } from "antd";
import violationTypeMap from "./violationTypeMap";

const { Option } = Select;

import { Results } from "constants/index";

const HandleAssetStatus = ({ handleAssetStatus, ticketId, row }) => {
  const { t } = useTranslation();
  const [comment, setComment] = useState();
  const [violationType, setViolationType] = useState();

  const handleOnClick = (result, assetId) => {
    handleAssetStatus({ ticketId, assetId, result, violationType, comment });
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Space>
            <Descriptions title="">
              <Descriptions.Item label={t("Asset ID")}>
                <a href={row.assetUrl} target="_blank" rel="noreferrer">
                  {row.assetId}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label={t("Asset Type")}>
                {t(row.assetType)}
              </Descriptions.Item>
              <Descriptions.Item label={t("Comment")}>
                {row.comment}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Space>
            {t("Handle Whitelist Comment")}：
            <Input
              placeholder={t("comment placeholder")}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: "300px" }}
            />
          </Space>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Space>
            <Button
              onClick={() =>
                handleOnClick(Results.ApproveUpdateAssetStatus, row.assetId)
              }
              type="primary"
              size="small"
            >
              {t("Approve Asset Update")}
            </Button>
            <span>
              <Button
                onClick={() =>
                  handleOnClick(Results.RejectUpdateAssetStatus, row.assetId)
                }
                danger
                size="small"
              >
                {t("Reject Asset Update")}
              </Button>
              <Select
                placeholder={t("set violationType placeholder")}
                dropdownMatchSelectWidth={true}
                onChange={setViolationType}
              >
                {violationTypeMap.map((type) => (
                  <Option value={type} key={type}>
                    {t(type)}
                  </Option>
                ))}
              </Select>
            </span>
            <Button
              onClick={() => handleOnClick(Results.None, row.assetId)}
              type="normal"
              size="small"
            >
              {t("Ignore Asset Update")}
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default HandleAssetStatus;
