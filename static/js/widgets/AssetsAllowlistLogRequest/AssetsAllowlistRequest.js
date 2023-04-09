import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import GetAssetTypesTreeData from "./GetAssetTypesTreeData";
import actionMap from "./actionMap";
import { useOktaAuth } from "@okta/okta-react";
import config from "config";
import { postData } from "helpers/httpRequest";
import { blockLoading } from "helpers/promiseWithBlocking";

import {
  Form,
  Row,
  Col,
  Button,
  Input,
  Select,
  message,
  PageHeader,
  Divider,
  TreeSelect,
} from "antd";

const resourceServer = config.resourceServer;

const { Option } = Select;

const AssetsAllowlistRequest = ({ refresh }) => {
  const { authState } = useOktaAuth();

  const [form] = Form.useForm();

  const { t } = useTranslation();
  const assetTypesTreeData = GetAssetTypesTreeData(t);

  let [assetIds, setIds] = useState("");
  let [type, setType] = useState("");
  let [action, setAction] = useState("");
  let [comment, setComment] = useState("");

  let submitRequest = async () => {
    const accessToken = authState.accessToken.value;

    let postObject = {};
    postObject.Type = type;
    postObject.PolicyLabel = "ChinaWhitelist";
    postObject.Action = action;
    postObject.Comment = comment;

    let ids = assetIds.split(/[,|\n|\s]/).filter((item) => item);
    postObject.Ids = ids;

    if (
      postObject.Type == "" ||
      postObject.PolicyLabel == "" ||
      postObject.Comment == "" ||
      postObject.Action == "" ||
      postObject.Ids.length == 0
    ) {
      message.warn(t("Please fill in the required items"));
      return;
    }

    let url = resourceServer["AssetsAllowlist"];
    let response = await postData(url, postObject, accessToken);

    if (response.status !== 200 || (response.data && response.data.error)) {
      message.error(
        t("Handle Asset Status failed") +
          ": " +
          t(response.data.error.description)
      );
      return;
    }

    //clear input
    form.resetFields();
    setIds("");
    setAction("");
    setType("");
    setComment("");
    refresh();
    let responseMessage =
      postObject.Action === "CreateTickets"
        ? t("Successfully Created Asset Tickets") +
          ": " +
          response.data.data.createTicketSuccessCount +
          "/" +
          response.data.data.total
        : t("Successfully Update Asset Status") +
          ": " +
          response.data.data.updateStatusSuccessCount +
          "/" +
          response.data.data.total;

    message.info(responseMessage);
  };
  let doSubmit = () => blockLoading(submitRequest(), t);

  return (
    <>
      <Form form={form} layout="inline">
        <PageHeader title={t("MASS SET POLICY LABEL")}></PageHeader>
        <Divider />

        <Row style={{ width: "100%" }}>
          <Col span={5} style={{ marginBottom: 12 }}>
            <Form.Item label={t("AssetType")} name="idType" required>
              <TreeSelect
                style={{ width: "100%" }}
                treeData={assetTypesTreeData}
                placeholder={t("Please Select AssetType")}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                onChange={setType}
                treeDefaultExpandedKeys={[assetTypesTreeData[0].value]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ width: "100%" }}>
          {t("Note Please enter IDs separated by spaces, commas, or new lines")}
        </Row>

        <Row style={{ width: "100%" }}>
          <Col span={20} style={{ marginBottom: 12, marginTop: 24 }}>
            <Form.Item name="ids" required>
              <Input.TextArea
                rows={10}
                value={assetIds}
                onChange={(e) => setIds(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ width: "100%" }}>
          <Col span={20} style={{ marginBottom: 12, marginTop: 24 }}>
            <Form.Item label={t("Comment")} name="comment" required>
              <Input.TextArea onChange={(e) => setComment(e.target.value)} />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ width: "100%" }}>
          <Col style={{ marginBottom: 4 }}>
            <Form.Item label={t("Select Action")} name="action" required>
              <Select
                dropdownMatchSelectWidth={false}
                style={{ width: "150px" }}
                onChange={setAction}
              >
                {actionMap.map((type) => (
                  <Option value={type} key={type}>
                    {t(type)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ marginBottom: 8 }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={doSubmit}>
                {t("Confirm")}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AssetsAllowlistRequest;
