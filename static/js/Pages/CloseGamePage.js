import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOktaAuth } from "@okta/okta-react";
import config from "config";
import { blockLoading } from "helpers/promiseWithBlocking";

import {
  Form,
  Row,
  Col,
  Button,
  Input,
  PageHeader,
  Popconfirm,
  message,
} from "antd";
import axios from "axios";

const resourceServer = config.resourceServer;

const CloseGamePage = () => {
  const { authState } = useOktaAuth();

  const { t } = useTranslation();

  let [placeId, setId] = useState("");
  let close = async () => {
    let response = await axios({
      method: "POST",
      url: resourceServer.CloseGame,
      data: placeId.replace(/[\n|\s]/g, ""),
      headers: {
        Authorization: `Bearer ${authState.accessToken.value}`,
        "Content-Type": "Application/json",
      },
    });
    if (!response.status == 200 || !response.data) {
      message.error(t("Failed to close this place's game servers"));
    } else {
      message.info(t("Succeeded to close this place's game servers"));
    }
  };
  let doClose = () => blockLoading(close(), t);

  return (
    <div style={{ padding: 24 }}>
      <Form layout="inline">
        <PageHeader
          title={t("Close One Place's Game Servers In Luobu")}
        ></PageHeader>

        <Row style={{ width: "100%" }}>
          <Col span={20} style={{ marginBottom: 12, marginTop: 24 }}>
            <Form.Item label={t("PlaceID")} name="id" required>
              <Input
                onChange={(e) => setId(e.target.value)}
                style={{ width: 300 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ width: "100%" }}>
          <Popconfirm
            title={t("Are you sure to close this place's servers?")}
            onConfirm={doClose}
            okText={t("Yes")}
            cancelText={t("No")}
          >
            <Button
              style={{ marginTop: 12, marginRight: 20 }}
              type="primary"
              danger
              htmlType="submit"
            >
              {t("Close Game")}
            </Button>
          </Popconfirm>
        </Row>
      </Form>
    </div>
  );
};
export default CloseGamePage;
