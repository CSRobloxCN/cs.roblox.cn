import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Select } from "antd";

const { Option } = Select;

const BanUser = ({ handleBanUser, userId, size }) => {
  const { t } = useTranslation();
  const [banLength, setBanLength] = useState();

  const handleOnClick = () => {
    handleBanUser({ banLength, userId });
  };

  return (
    <span>
      <Button onClick={handleOnClick} type="primary" size={size} danger>
        {t("Ban User For")}
      </Button>
      <Select onChange={setBanLength} size={size} style={{ width: "100px" }}>
        <Option value={0}>{t("Warning")}</Option>
        <Option value={1 * 24 * 60 * 60}>{t("1 day")}</Option>
        <Option value={3 * 24 * 60 * 60}>{t("3 days")}</Option>
        <Option value={7 * 24 * 60 * 60}>{t("7 days")}</Option>
        <Option value={14 * 24 * 60 * 60}>{t("14 days")}</Option>
      </Select>
    </span>
  );
};

export default BanUser;
