const GetActionHistoryCols = (t) => {
  if (!t) {
    return;
  }

  return [
    {
      title: t("User ID"),
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("User Name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("User Display Name"),
      dataIndex: "displayName",
      key: "displayName",
    },
    {
      title: t("Action Type"),
      dataIndex: "actionType",
      key: "actionType",
    },
    {
      title: t("Action Date"),
      dataIndex: "createdUtc",
      key: "createdUtc",
    },
    {
      title: t("Moderator Email"),
      dataIndex: "moderatorEmail",
      key: "moderatorEmail",
    },
    {
      title: t("Period From"),
      dataIndex: "periodFrom",
      key: "periodFrom",
    },
    {
      title: t("Period To"),
      dataIndex: "periodTo",
      key: "periodTo",
    },
    {
      title: t("Internal Comment"),
      dataIndex: "internalComment",
      key: "internalComment",
    },
  ];
};

export default GetActionHistoryCols;
