import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
// import useTranslation from "hooks/useTranslation";
import queryMap from "./queryMap";
import {
  Input,
  Select,
  Form,
  Row,
  Col,
  Button,
  DatePicker,
} from "antd";

const { Option } = Select;
const types = Object.keys(queryMap);

const TicketQueryInput = ({ onChange }) => {
  const { t } = useTranslation();
  let [queryObject, setQueryObject] = useState({
    eventType: types[0],
    desc: "false",
  });
  let currentQueryMap = queryMap[queryObject.eventType];
  let onFormValueChange = useCallback(
    (allValues) => {
      setQueryObject(Object.assign({}, allValues));
      onChange(allValues);
    },
    [setQueryObject]
  );
  return (
    <>
      <Form
        initialValues={queryObject}
        onFinish={onFormValueChange}
        layout="inline"
      >
        <Row gutter={24} style={{ width: "100%" }}>
          <Col style={{ marginBottom: 12 }}>
            <Form.Item label={t("eventType")} name="eventType" required>
              <Select dropdownMatchSelectWidth={false}>
                {types.map((type) => (
                  <Option value={type} key={type}>
                    {t(type)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {currentQueryMap &&
            Object.keys(currentQueryMap).map((key) => {
              if (currentQueryMap[key] == "string input") {
                return (
                  <Col span={6} style={{ marginBottom: 12 }} key={key}>
                    <Form.Item label={t(key)} name={key}>
                      <Input />
                    </Form.Item>
                  </Col>
                );
              }
              if (currentQueryMap[key] == "timestamp") {
                return (
                  <Col span={6} style={{ marginBottom: 12 }} key={key}>
                    <Form.Item label={t(key)} name={key}>
                      <DatePicker showTime={true} />
                    </Form.Item>
                  </Col>
                );
              }
              if (currentQueryMap[key] instanceof Array) {
                return (
                  <Col span={6} style={{ marginBottom: 12 }} key={key}>
                    <Form.Item label={t(key)} name={key}>
                      <Select dropdownMatchSelectWidth={false}>
                        {currentQueryMap[key].map((value) => (
                          <Option value={value} key={value}>
                            {t(key + value)}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                );
              }
            })}
        </Row>
        <Row style={{ width: "100%" }}>
          <Button type="primary" htmlType="submit">
            {t("Search")}
          </Button>
        </Row>
      </Form>
    </>
  );
};

export default TicketQueryInput;
