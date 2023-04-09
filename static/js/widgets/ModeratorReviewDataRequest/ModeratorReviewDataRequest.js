import React, { useState, useContext } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useTranslation } from "react-i18next";
import config from "config";
import axios from "axios";
import moment from "moment";

import { loading } from "helpers/promiseWithLoading";
import { TimeRangePicker } from "components/TimeRangePicker";
import { ModeratorAccount } from "context/ModeratorAccount";
import ModeratorReviewDataList from "./ModeratorReviewDataList";
import styles from "./ModeratorReviewDataRequest.module.css";

import GetModeratorInfoMethods from "./GetModeratorInfoMethods";

import { Layout, Row, Col, Input, Select, Card, message } from "antd";

const { Content } = Layout;
const { Search, Group } = Input;
const { Option } = Select;

const resourceServer = config.resourceServer;

const ModeratorReviewDataRequest = () => {
  const { authState } = useOktaAuth();
  const { t } = useTranslation();
  const pageSize = 20;

  let userInfo = useContext(ModeratorAccount);
  let [moderatorIds, setModeratorIds] = useState(null);
  let [moderatorEmails, setModeratorEmails] = useState(null);
  // The SQL running on Airflow is one hour later than the current time. 
  // Therefore, the default value of the time range is set to be one hour later than the current time to align with
  // the data
  // The default time of the start of the time range, the current time - 1 hour - one day and stripes the minutes and seconds
  const DEFAULT_STARTTIME = moment().subtract(1, "hours").subtract(1,"days").startOf("hour").toISOString();
  // The default time of the end of the time range, the current time - 1 hour and stripes the minutes and seconds
  const DEFAULT_ENDTIME = moment().subtract(1, "hours").startOf("hour").toISOString();
  let [timeRange, setTimeRange] = useState([DEFAULT_STARTTIME,DEFAULT_ENDTIME]);
  // This is the data returned by moderation service
  let [moderatorData, setModeratorData] = useState([]);

  let [total, setTotal] = useState(null);
  let [currentPage, setPage] = useState(1);
  let [defaultSearchValue, setDefaultSearchValue] = useState("");

  const moderatorInfoMethods = GetModeratorInfoMethods(t);
  const [infoType, setInfoType] = useState(moderatorInfoMethods[0].value);

  if (!userInfo) return null;

  let onPageChange = (newPage) => {
    setPage(newPage);
    const accessToken = authState.accessToken.value;
    loading(
      getData(
        accessToken,
        moderatorIds,
        moderatorEmails,
        timeRange,
        newPage,
        pageSize
      ).then(requestCallback)
    );
  };

  const handleOnSelect = (value) => {
    if (!value) return;
    setInfoType(value);
    setModeratorEmails(null);
    setModeratorIds(null);
    setDefaultSearchValue("");
  };

  const handleOnChange = (e) => {
    var value = e.target.value;
    // This is to remove all whitespace that are mis-typed by the moderator
    value = value.replace(/\s/g, "");
    // This is to remove tab in the string
    value = value.replace(/\t/g, "");
    // This is to make sure that if moderatorID/moderatorEmail is empty string,
    // it is set to be null, instead of [null]/['']
    value = value ? [value] : null;
    if (infoType && infoType == moderatorInfoMethods[0].value) {
      setModeratorEmails(null);
      setModeratorIds(value);
    }
    if (infoType && infoType == moderatorInfoMethods[1].value) {
      setModeratorIds(null);
      setModeratorEmails(value);
    }
    setDefaultSearchValue(value);
  };

  let onTimeRangeChange = (moments) => {
    setTimeRange(moments);
  };

  let onSearch = () => {
    const accessToken = authState.accessToken.value;
    setPage(1);
    loading(
      getData(
        accessToken,
        moderatorIds,
        moderatorEmails,
        timeRange,
        currentPage,
        pageSize
      ).then(requestCallback)
    );
  };

  function requestCallback(res) {
    if (res.status == 200) {
      if (res.data.error) {
        message.error(res.data.error.description);
        return;
      }
      setModeratorData(res.data.data.items);
      setTotal(res.data.data.total);
    } else {
      message.error("Request Failed");
    }
  }
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
          <Row>
            <Col span={12}>
              <Group>
                <label>{t("Time Range (The smallest unit is hour)")} : </label>
                <TimeRangePicker 
                onChange={onTimeRangeChange}
                stripHour={true}
                defaultValue = {timeRange}
                />
              </Group>
            </Col>
            <Col span={12}>
              <Group>
                <Select
                  size="large"
                  defaultValue={moderatorInfoMethods[0].value}
                  onSelect={handleOnSelect}
                >
                  {moderatorInfoMethods.map((method) => (
                    <Option key={method.value} value={method.value}>
                      {method.name}
                    </Option>
                  ))}
                </Select>
                <Search
                  style={{ width: "50%" }}
                  placeholder={
                    moderatorInfoMethods.find(
                      (method) => method.value === infoType
                    ).placeholder
                  }
                  value={defaultSearchValue}
                  allowClear
                  enterButton={<span>{t("Search")}</span>}
                  size="large"
                  onSearch={onSearch}
                  // This is to change the default value for the interconversion of ModeratorEmail and ModeratorId
                  onChange={handleOnChange}
                />
              </Group>
            </Col>
          </Row>
        </Card>
        <ModeratorReviewDataList
          dataList={moderatorData}
          total={total}
          currentPage={currentPage}
          onPageChange={onPageChange}
          startTime={timeRange ? timeRange[0] : null}
          endTime={timeRange ? timeRange[1] : null}
          pageSize={pageSize}
        />
      </Content>
    </Layout>
  );
};

function getData(accessToken, moderatorIds, moderatorEmails, timeRange, page, pageSize) {
  let data = {
    ModeratorIds: moderatorIds,
    ModeratorEmails: moderatorEmails,
    PageNum: page,
    PageSize: pageSize,
  };
  let url = resourceServer.GetModeratorTicketReviewData;
  // This is to make sure that server will not reponse 400 bad request
  // if UI Service receive the null value of startTime, it can not be converted into system.DateTime
  if (timeRange) {
    data["startTime"] = timeRange[0];
    data["endTime"] = timeRange[1];
  }
  return axios({
    method: "post",
    url,
    data: data,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export default ModeratorReviewDataRequest;
