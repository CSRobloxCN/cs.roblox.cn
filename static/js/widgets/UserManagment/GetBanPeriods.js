const GetBanPeriods = (t) => {
  if (!t) {
    return;
  }

  return [
    { value: 0, name: "" },
    { value: 1, name: t("1 day") },
    { value: 3, name: t("3 days") },
    { value: 7, name: t("7 days") },
    { value: 14, name: t("14 days") },
    { value: 30, name: t("30 days") },
    { value: 365, name: t("One year") },
    { value: "custom", name: t("Custom") },
  ];
};

export default GetBanPeriods;
