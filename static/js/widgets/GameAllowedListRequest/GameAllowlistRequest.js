import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOktaAuth } from "@okta/okta-react";
import config from "config";
import { blockLoading } from "helpers/promiseWithBlocking";

import { Form, Row, Col, Button, Input, PageHeader, Typography } from "antd";
import axios from "axios";

const resourceServer = config.resourceServer;

const GameAllowlistRequest = () => {
  const { authState } = useOktaAuth();

  const { t } = useTranslation();

  let [gameIds, setIds] = useState("");
  let [succeedIds, setSucceedIds] = useState([]);
  let ids = gameIds.split(/[,|\n|\s]/).filter((item) => item);
  let failedIds = ids.filter((id) => succeedIds.indexOf(id) == -1);
  let approve = async () => {
    let finishedIds = [];
    try {
      for (let i = 0; i < ids.length; i++) {
        let response = await axios({
          method: "POST",
          url: resourceServer.ApproveGame,
          data: ids[i],
          headers: {
            Authorization: `Bearer ${authState.accessToken.value}`,
            "Content-Type": "Application/json",
          },
        });
        if (!response.status == 200 || !response.data) {
          break;
        }
        finishedIds.push(ids[i]);
      }
      setSucceedIds(finishedIds);
    } catch (e) {
      setSucceedIds(finishedIds);
    }
  };
  let doApprove = () => blockLoading(approve(), t);
  let reject = async () => {
    let finishedIds = [];
    try {
      for (let i = 0; i < ids.length; i++) {
        let response = await axios({
          method: "POST",
          url: resourceServer.RejectGame,
          data: ids[i],
          headers: {
            Authorization: `Bearer ${authState.accessToken.value}`,
            "Content-Type": "Application/json",
          },
        });
        if (!response.status == 200 || !response.data) {
          break;
        }

        finishedIds.push(ids[i]);
      }
      setSucceedIds(finishedIds);
    } catch (e) {
      setSucceedIds(finishedIds);
    }
  };
  let doReject = () => blockLoading(reject(), t);

  return (
    <>
      <Form layout="inline">
        <PageHeader title={t("MASS SET POLICY LABEL")}></PageHeader>

        <Row style={{ width: "100%" }}>
          {t("This page is for setting a policy label on multiple ids")}
        </Row>

        <Row style={{ width: "100%" }}>
          <Col span={20} style={{ marginBottom: 12, marginTop: 24 }}>
            <Form.Item label={t("Universe IDs")} name="ids" required>
              <Input.TextArea
                rows={10}
                onChange={(e) => setIds(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          {t("Note Please enter IDs separated by spaces, commas, or new lines")}
        </Row>

        <Row style={{ width: "100%" }}>
          <Button
            style={{ marginTop: 12, marginRight: 20 }}
            type="primary"
            htmlType="submit"
            onClick={doApprove}
          >
            {t("Add these games into whitelist")}
          </Button>
          <Button
            style={{ marginTop: 12 }}
            type="primary"
            danger
            htmlType="submit"
            onClick={doReject}
          >
            {t("Remove these games from whitelist")}
          </Button>
        </Row>
      </Form>
      <div style={{ marginTop: 20 }}>{t("Submitted GameIds")}</div>
      <div>
        {[...new Set(succeedIds)].map((id) => (
          <span key={id}>
            <Typography.Text code>{id}</Typography.Text>,
          </span>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>{t("Failed or Skipped GameIds")}</div>
      <div>
        {[...new Set(failedIds)].map((id) => (
          <span key={id}>
            <Typography.Text code>{id}</Typography.Text>,
          </span>
        ))}
      </div>
    </>
  );
};

export default GameAllowlistRequest;
