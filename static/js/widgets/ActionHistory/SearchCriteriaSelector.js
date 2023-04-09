import React, { useState } from "react";
import { Row, Col, Input, Select, Button } from "antd";
import GetActionHistoryTypes from "./GetActionHistoryTypes";
const { Option } = Select;

const SearchCriteriaSelector = ({ t, search, handleSearchParamsChange }) => {
  const actionTypes = GetActionHistoryTypes(t);
  const [actionType, setActionType] = useState(actionTypes[0]);
  const [criteria, setCriteria] = useState([]);
  const [searchParams, setSearchParams] = useState({});

  const getActionTypeChildren = () =>
    actionTypes.map((type, index) => (
      <Option key={index} value={type.value}>
        {type.label}
      </Option>
    ));

  const getCriteriaChildren = () =>
    actionType.children.map((item, index) => (
      <Option key={index} value={item.value}>
        {item.label}
      </Option>
    ));

  const handleOnChange = (cri, e) => {
    const value = e && e.target ? e.target.value : e;
    const newParams = {
      ...searchParams,
      [cri]: value,
    };
    if (handleSearchParamsChange) {
      handleSearchParamsChange(newParams);
    }
    setSearchParams(newParams);
  };

  const getInputChildren = () =>
    criteria.map((cri, index) => {
      const child = actionType.children.find((item) => item.value == cri);
      const addon = child && child.label;
      const example = child && child.example;
      const element = child && child.element;

      return (
        <Col span={6} key={index}>
          {element && element === "input" && (
            <Input
              addonBefore={addon}
              onChange={(e) => handleOnChange(cri, e)}
              value={searchParams[cri]}
              placeholder={example}
            />
          )}
          {element && element === "select" && (
            <Select
              style={{ width: "100%" }}
              placeholder={example}
              onChange={(e) => handleOnChange(cri, e)}
            >
              {child.options.map((option, index) => (
                <Option key={index} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          )}
        </Col>
      );
    });

  const handleCriteriaChange = (value) => {
    var difference = criteria.filter((x) => value.indexOf(x) === -1);
    if (difference && difference[0] && searchParams[difference[0]]) {
      delete searchParams[difference[0]];
    }
    setCriteria(value);
  };

  const handleActionTypeChange = (value) => {
    setCriteria([]);
    setActionType(actionTypes.find((type) => type.value === value));
  };

  const handleSearch = () => {
    search(searchParams);
  };

  return (
    <>
      <Row gutter={[10, 10]}>
        <Col span={6}>
          <Select
            style={{ width: "100%" }}
            defaultValue="userManagement"
            onChange={handleActionTypeChange}
          >
            {getActionTypeChildren()}
          </Select>
        </Col>
        <Col span={18}>
          <Select
            mode="tags"
            style={{ width: "100%" }}
            onChange={handleCriteriaChange}
            placeholder={t("Select search criteria")}
            autoClearSearchValue
            value={criteria}
          >
            {getCriteriaChildren()}
          </Select>
        </Col>
      </Row>
      <Row>
        <Input.Group>
          <Row gutter={8}>{getInputChildren()}</Row>
        </Input.Group>
      </Row>
      <Row style={{ marginTop: "10px" }}>
        <Button type="primary" onClick={handleSearch}>
          {t("Search")}
        </Button>
      </Row>
    </>
  );
};

export default SearchCriteriaSelector;
