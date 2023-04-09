import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "antd";

const { Option } = Select;

const locales = ["en", "zh"];
const languageNames = {
  en: "English",
  zh: "中文",
};

const LocaleSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLocale, setCurrentLocale] = useState(i18n.language);

  const changeLanguage = (value) => {
    setCurrentLocale(value);
    i18n.changeLanguage(value);
  };

  return (
    <Select
      value={currentLocale}
      onChange={changeLanguage}
      dropdownMatchSelectWidth={false}
    >
      {locales.map((locale) => (
        <Option key={locale} value={locale}>
          {languageNames[locale]}
        </Option>
      ))}
    </Select>
  );
};

export default LocaleSwitcher;
