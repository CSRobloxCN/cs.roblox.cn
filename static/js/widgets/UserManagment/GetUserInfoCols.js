const GetUserInfoCols = (t) => {
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
      title: t("User Open ID"),
      dataIndex: "openIds",
      key: "openIds", // both Wechat OpenId and QQ OpenId 
    },
    {
      title: t("User Name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("Display Name"),
      dataIndex: "displayName",
      key: "displayName",
    },
    {
      title: t("last Online Time"),
      dataIndex: "lastOnlineTime",
      key: "lastOnlineTime",
    },
  ];
};

export default GetUserInfoCols;
