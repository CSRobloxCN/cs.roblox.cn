import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./UserManagement.module.css";
import {
  Layout,
  Typography,
  Row,
  Col,
  Input,
  Select,
  Card,
  Table,
  Button,
  message,
  Popconfirm,
  Skeleton,
} from "antd";
import { useOktaAuth } from "@okta/okta-react";
import { ModeratorAccount } from "context/ModeratorAccount";
import GetActionHistoryCols from "./GetActionHistoryCols";
import GetUserInfoCols from "./GetUserInfoCols";
import GetUserIdentificationMethods from "./GetUserIdentificationMethods";
import GetBanPeriods from "./GetBanPeriods";
import { postData, getData } from "helpers/httpRequest";
import BanData from "./BanReasons";
import config from "config";
import GetRecentBanStatusCols from "./GetRecentBanStatusCols";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search, Group } = Input;
const { Option } = Select;
const { BanReasons, NoteToUsers } = BanData;

const UserManagement = () => {
  const { t } = useTranslation();
  const banPeriods = GetBanPeriods(t);
  const banReasons = BanReasons;
  const [idType, setIdType] = useState("1");
  const [userDataSource, setUserDataSource] = useState([]);
  const [user, setUser] = useState({ id: null });
  const [input, setInput] = useState("");
  const [banReason, setBanReason] = useState("GeneralAbuse");
  const [noteToUser, setNoteToUser] = useState("");
  const [banPeriod, setBanPeriod] = useState({
    periodFrom: null,
    periodTo: null,
    days: 0,
    banLengthInSeconds: 0,
  });
  const [actionHistory, setActionHistory] = useState([]);
  const [recentBanStatus, setRecentBanStatus] = useState([]);
  const [customBanPeriod, setCustomBanPeriod] = useState();
  const [internalComment, setInternalComment] = useState();
  const { authState } = useOktaAuth();
  const moderatorInfo = useContext(ModeratorAccount);

  if (!moderatorInfo) return <Skeleton active />;

  const userIdentificationMethods = GetUserIdentificationMethods(t);
  const userInfoCols = GetUserInfoCols(t);
  const actionHistoryCols = GetActionHistoryCols(t);
  const recentBanStatusCols = GetRecentBanStatusCols(t);

  const handleOnChange = (e) => {
    var value = e.target.value;
    setInput(value);
  };

  const onSearch = async (value) => {
    if (!value) return;
    setUserDataSource([]);
    setRecentBanStatus([]);

    var selectedMethod = userIdentificationMethods.find(
      (method) => method.value === idType
    );
    var type = selectedMethod && selectedMethod.type;
    var requestBody = {
      idType,
      ...(type === "name" && { name: value }),
      ...(type === "id" && { id: value }),
      ...(type === "openId" && { openId: value }),
    };

    const hide = message.loading("loading...", 0);
    var response = await postData(
      config.resourceServer.GetUserInfo,
      requestBody,
      authState.accessToken.value
    );
    hide();

    if (response.data && response.data.error) {
      // handle error here
      message.error(response.data.error.description);
      return;
    }
    const { data } = response && response.data;
    const userData = {
      ...data,
      key: data.id,
    };
    if (data.id) {
      let banStatusData = await getRecentBanStatus(userData.id);
      let lastOnlineInfo = await getUserLastOnlineTime(userData.id);
      if (banStatusData) {
        setRecentBanStatus([banStatusData]);
      }
      if (lastOnlineInfo) {
        userData.lastOnlineTime = lastOnlineInfo;
      }
    }

    setUserDataSource([userData]);
    setUser(userData);
  };

  const handleOnSelect = (value) => {
    if (!value) return;
    setInput("");
    setIdType(value);
  };

  const handleOnSelectBanPeriod = (value) => {
    const now = new Date();

    if (value !== "custom") {
      const end = now.addDays(value);
      setBanPeriod({
        periodFrom: now.toISOString(),
        periodTo: end.toISOString(),
        days: value,
        banLengthInSeconds: (end - now) / 1000,
      });
    } else {
      setBanPeriod({
        ...banPeriod,
        days: "custom",
      });
    }
  };

  const handleOnCustomBanPeriod = (e) => {
    const value = e.target.value;
    const now = new Date();

    if (/^\d*$/.test(value)) {
      setCustomBanPeriod(value);
      setBanPeriod({
        ...banPeriod,
        periodFrom: now.toISOString(),
        periodTo: now.addSeconds(parseInt(value)).toISOString(),
        banLengthInSeconds: value,
      });
    }
  };

  const handleOnInternalComment = (e) => {
    const value = e.target.value;
    setInternalComment(value);
  };

  const handleOnSelectBanReason = (value) => {
    setBanReason(value);
  };

  const handleBan = async () => {
    if (banPeriod.days === 0 || !noteToUser) {
      return;
    }
    const now = new Date();
    const end = now.addDays(banPeriod.days);
    const requestBody = {
      id: user && user.id,
      periodFrom: banPeriod.periodFrom,
      periodTo: banPeriod.periodTo,
      banLength: customBanPeriod
        ? parseInt(customBanPeriod)
        : (end - now) / 1000,
      noteToUser:t(noteToUser),
      banReason,
      actionType: "Ban",
      internalComment,
    };

    if (!requestBody.id) {
      return;
    }

    const hide = message.loading("loading...", 0);
    const response = await postData(
      config.resourceServer.BanUser,
      requestBody,
      authState.accessToken.value
    );
    hide();
    const responseData = response && response.data;
    const { error, data } = responseData;

    if (error) {
      message.error(t("Ban user failed") + error.description);
      return;
    }
    if (data && data.head && data.head.result !== 0) {
      message.error(t("Ban user failed") + data.head.retErrMsg);
      return;
    }
    message.success(t("Ban user successful"));
  };

  function refreshDisplayName() {
    const userData = {
      ...userDataSource[0],
      key: userDataSource[0].id,
    };
    setUserDataSource([userData]);
    setUser(userData);
  }

  const handleChangeDisplayName = async () => {
    // UpdateUserDisplayName
    const requestBody = {
      UserId: user && user.id,
      CurrentDisplayName: user.displayName,
      NewDisplayName: user.name,
      RecordHistory: true,
    };
    if (!requestBody.UserId) {
      return;
    }
    if (requestBody.CurrentDisplayName === requestBody.NewDisplayName) {
      message.error(
        t("user display name already set as user name:") +
          requestBody.CurrentDisplayName
      );
      return;
    }
    const hide = message.loading("loading...", 0);
    const response = await postData(
      config.resourceServer.UpdateUserDisplayName,
      requestBody,
      authState.accessToken.value
    );
    hide();
    const responseData = response && response.data;
    const { error, data } = responseData;

    if (error) {
      message.error(t("Change user display name failed") + error.description);
      return;
    }
    if (data && data.head && data.head.result !== 0) {
      message.error(t("Change user display name failed") + data.head.retErrMsg);
      return;
    }
    message.success(t("Change user display name successful"));
    userDataSource[0].displayName = user.name;
    refreshDisplayName();
  };

  const handleUnBan = async () => {
    const requestBody = {
      id: user && user.id,
      actionType: "Unban",
    };
    if (!requestBody.id) {
      return;
    }
    const hide = message.loading("loading...", 0);
    const response = await postData(
      config.resourceServer.UnbanUser,
      requestBody,
      authState.accessToken.value
    );
    hide();
    const responseData = response && response.data;
    const { error, data } = responseData;

    if (error) {
      message.error(t("Unban user failed") + error.description);
      return;
    }
    if (data && data.head && data.head.result !== 0) {
      message.error(t("Unban user failed") + data.head.retErrMsg);
      return;
    }
    message.success(t("Unban user successful"));
  };

  const getActionHistory = async () => {
    if (!user.id) {
      return;
    }
    const hide = message.loading("loading...", 0);
    const response = await getData(
      config.resourceServer.GetActionHistoryByUserId,
      { id: user.id },
      authState.accessToken.value
    );
    hide();
    const actionHistory =
      response &&
      response.data &&
      response.data.data &&
      response.data.data.items;

    const indexedActionHistory = actionHistory.map((action) => ({
      ...action,
      key: action.guId,
    }));

    setActionHistory(indexedActionHistory);
  };

  const getRecentBanStatus = async (id) => {
    if (!id) {
      return;
    }
    const response = await getData(
      config.resourceServer.GetRecentBanStatusByUserId,
      { userId: id },
      authState.accessToken.value
    );
    const recentBanStatus = response && response.data && response.data.data;
    if (recentBanStatus && recentBanStatus.punishmentId) {
      const banStatusData = {
        ...recentBanStatus,
        key: recentBanStatus.punishmentId,
      };
      const endDate = new Date(banStatusData.endDate);
      banStatusData.endDate = endDate.toLocaleString();
      const beginDate = new Date(banStatusData.beginDate);
      banStatusData.beginDate = beginDate.toLocaleString();
      return banStatusData;
    }
  };

  const getUserLastOnlineTime = async (uid) => {
    if (!uid) {
      return;
    }
    const response = await getData(
      config.resourceServer.GetUserPresenceByIds,
      { userIdsStr: uid },
      authState.accessToken.value
    );
    const recentStatus = response && response.data && response.data.data;
    if (recentStatus && recentStatus[0] && recentStatus[0].userId) {
      const latestStatusData = {
        ...recentStatus[0],
        key: recentStatus[0].userId,
      };
      const endDate = new Date(latestStatusData.lastOnline);
      return endDate.toLocaleString();
    }
  };
  return (
    <Layout>
      <Content
        className={styles.siteLayoutContent}
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Card bordered={false}>
          <Title level={4}>{t("Search user")}</Title>
          <Row>
            <Col span={12}>
              <Group>
                <Select
                  size="large"
                  defaultValue={userIdentificationMethods[0].value}
                  onSelect={handleOnSelect}
                >
                  {userIdentificationMethods.map((method) => (
                    <Option key={method.value} value={method.value}>
                      {method.name}
                    </Option>
                  ))}
                </Select>
                <Search
                  style={{ width: "50%" }}
                  placeholder={
                    userIdentificationMethods.find(
                      (method) => method.value === idType
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

        <Card bordered={false}>
          <Title level={4}>{t("Search Result")}</Title>
          <Row>
            <Col span={24}>
              <Table
                dataSource={userDataSource}
                columns={userInfoCols}
                pagination={false}
                bordered
              />
            </Col>
          </Row>
        </Card>

        {user.id && (
          <Card bordered={false}>
            <Title level={4}>{`${t("Get recent ban status for user")}`}</Title>
            <Row>
              <Col span={24}>
                <Table
                  dataSource={recentBanStatus}
                  columns={recentBanStatusCols}
                  pagination={false}
                  bordered
                />
              </Col>
            </Row>
          </Card>
        )}

        <Card bordered={false}>
          <Title level={4}>{t("Change User Display Name")}</Title>
          <Row>
            <Col span={12}>
              <Popconfirm
                placement="top"
                title={`${t("You are going to change user display name")}: ${
                  user && user.displayName
                }  ->  ${user.name}`}
                onConfirm={handleChangeDisplayName}
                okText={t("Confirm")}
                cancelText={t("Cancel")}
              >
                <Button type="primary">{t("Change User Display Name")}</Button>
              </Popconfirm>
            </Col>
          </Row>
        </Card>

        <Card bordered={false}>
          <Title level={4}>{t("Ban User")}</Title>
          <Row>
            <Col span={12}>
              <Row gutter={[10, 10]}>
                <Col>
                  {banPeriod.days === "custom" ? (
                    <Input
                      placeholder={t("Enter custom ban period")}
                      value={customBanPeriod}
                      onChange={handleOnCustomBanPeriod}
                      suffix={t("seconds")}
                    />
                  ) : (
                    <Select
                      style={{ width: 90 }}
                      defaultValue={
                        banPeriods.find((period) => period.value === 0).value
                      }
                      onChange={handleOnSelectBanPeriod}
                    >
                      {banPeriods.map((day, index) => (
                        <Option key={index} value={day.value}>
                          {day.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Col>
                <Col>
                  <Select
                    style={{ width: 200 }}
                    defaultValue={banReason}
                    onChange={handleOnSelectBanReason}
                  >
                    {Object.keys(banReasons).map((key) => {
                      return (
                        <Select.OptGroup label={t(key)} key={key}>
                          {banReasons[key].map((reason) => (
                            <Option key={reason} value={reason}>
                              {t(reason)}
                            </Option>
                          ))}
                        </Select.OptGroup>
                      );
                    })}
                  </Select>
                </Col>
                <Col>
                  {t("Note to user") + " : "}
                  <Select
                    style={{ width: 200 }}
                    defaultValue={noteToUser}
                    onChange={setNoteToUser}
                  >
                    {NoteToUsers.map((note) => (
                      <Option key={note} value={note}>
                        {t(note)}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col>
                  <Input
                    placeholder={t("Enter Internal Comment")}
                    value={internalComment}
                    onChange={handleOnInternalComment}
                  />
                </Col>
                <Col>
                  <Popconfirm
                    placement="top"
                    title={`${t("You are going to ban user")} ${
                      user && user.name
                    }`}
                    onConfirm={handleBan}
                    okText={t("Confirm")}
                    cancelText={t("Cancel")}
                  >
                    <Button type="primary" danger>
                      {t("Ban User")}
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            </Col>
          </Row>
          {user &&
            !user.isBanned &&
            banPeriod.days !== 0 &&
            banPeriod.periodFrom &&
            banPeriod.periodTo && (
              <>
                <Row>
                  <Text>{`${t("User Name")}: ${user.name}`}</Text>
                </Row>
                <Row>
                  <Text>
                    <Text>{`${t("Ban period")}: `}</Text>
                    <Text mark>{banPeriod.periodFrom}</Text> -{" "}
                    <Text mark>{banPeriod.periodTo}</Text>
                  </Text>
                </Row>
              </>
            )}
        </Card>

        <Card bordered={false}>
          <Title level={4}>{t("Unban User")}</Title>
          <Row>
            <Col span={12}>
              <Popconfirm
                placement="top"
                title={`${t("You are going to unban user")}: ${
                  user && user.name
                }`}
                onConfirm={handleUnBan}
                okText={t("Confirm")}
                cancelText={t("Cancel")}
              >
                <Button type="primary">{t("Unban User")}</Button>
              </Popconfirm>
            </Col>
          </Row>
        </Card>

        {user.id && (
          <Card bordered={false}>
            <Title level={4}>{`${t("Ban/Unban action history for user")}: ${
              user.name
            }`}</Title>
            <Row style={{ marginBottom: "15px" }}>
              <Button type="primary" onClick={getActionHistory}>
                {t("Get history")}
              </Button>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  dataSource={actionHistory}
                  columns={actionHistoryCols}
                  pagination={false}
                  bordered
                  scroll={{ y: 240 }}
                />
              </Col>
            </Row>
          </Card>
        )}
      </Content>
    </Layout>
  );
};

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.addSeconds = function (seconds) {
  var date = new Date(this.valueOf());
  date.setSeconds(date.getSeconds() + seconds);
  return date;
};

export default UserManagement;
