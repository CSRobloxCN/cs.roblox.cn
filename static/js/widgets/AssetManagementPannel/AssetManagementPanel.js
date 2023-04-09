import React, { useState, useRef, createRef, useEffect } from "react";
import Clipboard from "clipboard";
import { useTranslation } from "react-i18next";
import GetRecentAssetStatusCols from "./GetRecentAssetStatusCols";
import {
  Layout,
  Typography,
  Row,
  Col,
  Input,
  Select,
  Card,
  Table,
  Modal,
  message,
} from "antd";
import { useOktaAuth } from "@okta/okta-react";
import config from "config";
import GetAssetIdentificationMethods from "./GetAssetIdentificationMethods";
import { postData } from "helpers/httpRequest";
import { loading } from "helpers/promiseWithLoading";

const { Content } = Layout;
const { Title } = Typography;
const { Search, Group } = Input;
const { Option } = Select;
const resourceServer = config.resourceServer;

// This Panel is to search and manage asset/bundle status
// User can do following actions in this Panel:
// 	1. Submit assets/bundles to moderator(Create Tickets)
//  2. Add/Remove assets/bundles into/from whitelist
//  3. Search all updateWhitelistHistory related to one asset/bundle
const AssetManagementPanel = () => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  const assetIdentificationMethods = GetAssetIdentificationMethods(t);

  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState(
    assetIdentificationMethods[0].type
  );
  const [recentAssetDashboardData, setRecentAssetDashboardData] = useState([]);
  const [ids, setIds] = useState([]);
  const [type, setType] = useState("");
  const [action, setAction] = useState("");

  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lineTabData, setLineTabData] = useState({});

  let buttonRefArray = useRef([]);

  useEffect(() => {
    let clipboardArray = buttonRefArray.current.map((buttonRef) => {
      let clipboardObject;
      if (buttonRef.current) {
        clipboardObject = new Clipboard(buttonRef.current);
        clipboardObject.on("success", function () {
          message.success(t("ID are copied to clipboard"));
        });
        return clipboardObject;
      }
    });
    return () => {
      clipboardArray.forEach((clipboard) => {
        clipboard.destroy();
      });
    };
  }, [buttonRefArray.current]);

  // submitRequest method will be trigger after the Modal is clicked "OK". It will do 2 operations:
  // 	1. SubmitRequest to UiService Endpoint api/toolbox/allowlist to do actions on assets
  // 	2. Once the request is finished(either success or fail), print message and close Modal
  const submitRequest = async () => {
    const accessToken = authState.accessToken.value;
    let postObject = {
      Ids: ids,
      Type: type,
      PolicyLabel: "ChinaWhitelist",
      Action: action,
    };

    let isRequestValid =
      postObject.Type &&
      postObject.PolicyLabel &&
      postObject &&
      postObject.Action &&
      postObject.Ids.length > 0;
    if (!isRequestValid) {
      message.warn(t("Please fill in the required items"));
      setIsModalOpen(false);
      return;
    }
    try {
      let url = resourceServer["AssetsAllowlist"];
      var response = await postData(url, postObject, accessToken);

      if (response.status !== 200 || (response.data && response.data.error)) {
        message.error(
          t("Handle Asset Status failed") +
            ": " +
            t(response.data.error.description)
        );
        setIsModalOpen(false);
        return;
      }

      let data = response.data.data;
      let responseMessage =
        postObject.Action === "CreateTickets"
          ? `${t("Successfully Created Asset Tickets")}: ${
              data.createTicketSuccessCount
            }/${data.total}`
          : `${t("Successfully Update Asset Status")}: ${
              data.updateStatusSuccessCount
            }/${data.total}`;
      setIsModalOpen(false);
      message.info(responseMessage);
    } catch (e) {
      setIsModalOpen(false);
      message.error(t("Handle Asset Status failed") + ": " + e);
    }
  };

  // Everytime user click "Submit to moderate", "Reject Asset Update" or "Approve Asset Update",
  //	program will call AssetStatusUpdateRequest and do following operations:
  //		1. Set Action; 2. Set Ids and type; 3. Open Modal
  const AssetStatusUpdateRequest = (row, actionAndModalItem) => {
    // Set Action
    setAction(actionAndModalItem.action);

    // Set Ids
    setIds([row.id]);

    // Set type
    setType(row.isBundle ? assetIdentificationMethods[1].type : row.assetType);

    // Open Modal
    setModalTitle(actionAndModalItem.modalTitle);
    setModalDescription(actionAndModalItem.modalDescription);
    setIsModalOpen(true);
  };

  const recentAssetStatusCols = GetRecentAssetStatusCols(
    t,
    AssetStatusUpdateRequest,
    buttonRefArray
  );

  const handleOnChange = (e) => {
    var value = e.target.value;
    setInput(value);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalDescription("");
  };

  const onSearch = async (value) => {
    if (!value) return;
    let inputArray = input.split(/[,|\n|\s]/).filter((item) => item);
    if (inputArray.length > 5) {
      message.warn(t("Search Input exceed limitation"));
      return;
    }

    setRecentAssetDashboardData([]);
    const accessToken = authState.accessToken.value;

    let url = resourceServer["GetAssetDashboard"];

    let postObject = { ids: inputArray, inputType: inputType };

    let isBundle = inputType == assetIdentificationMethods[1].type;
    let isRequestValid =
      postObject.inputType && postObject.ids && postObject.ids.length != 0;
    if (!isRequestValid) {
      message.warn(t("Please fill in the required items"));
      return;
    }

    loading(
      postData(url, postObject, accessToken).then((res) => {
        if (res.status == 200 && res.data) {
          if (res.data.error) {
            message.error(t(res.data.error.description));
            return;
          }
          const { assetDashboardModelList } = res.data.data;
          const recentAssetDashboardData = assetDashboardModelList.map(
            (assetDashboardModel, index) => {
              return {
                index: index,
                isBundle: isBundle,
                assetUrl: isBundle
                  ? `https://www.roblox.com/bundles/${assetDashboardModel.id}`
                  : `https://www.roblox.com/catalog/${assetDashboardModel.id}`,
                ...assetDashboardModel,
              };
            }
          );
          buttonRefArray.current = recentAssetDashboardData.map(
            (item) => (buttonRefArray.current[item.index] = createRef())
          );
          setRecentAssetDashboardData(recentAssetDashboardData);
        } else {
          message.error(t("Request Failed"));
        }
      })
    );
  };

  const onExpand = async (expanded, record) => {
    if (!expanded) return;
    let url = resourceServer["GetAssetDashboard"];
	//only itemType == 0 means the item is asset
    let assetIds = record.bundleItems
      .filter((item) => item.itemType == 0)
      .map((item) => item.itemTargetId);
    let postObject = {
      ids: assetIds,
      inputType: assetIdentificationMethods[0].type,
    };
    const accessToken = authState.accessToken.value;

    loading(
      postData(url, postObject, accessToken).then((res) => {
        if (res.status == 200 && res.data) {
          if (res.data.error) {
            message.error(res.data.error.description);
            return;
          }
          const { assetDashboardModelList } = res.data.data;
          const asssetFromBundleData = assetDashboardModelList.map(
            (assetDashboardModel) => {
              return {
                assetUrl: `https://www.roblox.com/catalog/${assetDashboardModel.id}`,
                ...assetDashboardModel,
              };
            }
          );
          setLineTabData({
            [record.id]: asssetFromBundleData,
            ...lineTabData,
          });
        } else {
          message.error(t("Request Failed"));
        }
      })
    );
  };

  const expandedRowRender = (record) => {
    const columns = recentAssetStatusCols;
    return (
      <Table
        columns={columns}
        dataSource={lineTabData[record.id]}
        pagination={false}
        rowKey={(record) => record.id}
      ></Table>
    );
  };

  const handleOnSelect = (type) => {
    if (!type) return;
    setInput("");
    setInputType(type);
  };
  return (
    <Layout>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Modal
          title={t(modalTitle)}
          visible={isModalOpen}
          onOk={() => submitRequest()}
          onCancel={() => closeModal()}
        >
          <p>{t(modalDescription)}</p>
        </Modal>
        <Card bordered={false}>
          <Title level={4}>{t("Search Asset Status")}</Title>
          <Row>
            <Col span={12}>
              <Group>
                <Select
                  size="large"
                  defaultValue={assetIdentificationMethods[0].type}
                  onSelect={handleOnSelect}
                >
                  {assetIdentificationMethods.map((method) => (
                    <Option key={method.value} value={method.type}>
                      {method.name}
                    </Option>
                  ))}
                </Select>
                <Search
                  style={{ width: "50%" }}
                  placeholder={
                    assetIdentificationMethods.find(
                      (method) => method.type === inputType
                    ).placeholder
                  }
                  value={input}
                  allowClear
                  enterButton={<span>{t("Search")}</span>}
                  size="large"
                  onSearch={onSearch}
                  onChange={handleOnChange}
                />
              </Group>
            </Col>
          </Row>
        </Card>

        {recentAssetDashboardData && (
          <Card bordered={false}>
            <Row>
              <Col span={24}>
                <Table
                  dataSource={recentAssetDashboardData}
                  columns={recentAssetStatusCols}
                  rowExpandable={(record) => record.isBundle}
                  onExpand={(expanded, record) => onExpand(expanded, record)}
                  expandable={{ expandedRowRender }}
                  pagination={false}
                  rowKey={(record) => record.id}
                  bordered
                />
              </Col>
            </Row>
          </Card>
        )}
      </Content>
    </Layout>
  );
};

export default AssetManagementPanel;
