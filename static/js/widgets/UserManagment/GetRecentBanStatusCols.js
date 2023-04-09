const GetRecentBanStatusCols = (t) => {
  if (!t) {
    return;
  }
  // "punishedUserId": 2510680918,
  //   "messageToUser": "聊天内容涉黄",
  //   "punishmentTypeDescription": "Luobu Ban",
  //   "punishmentId": 101866513,
  //   "beginDate": "2021-05-15T14:49:04.1570000Z",
  //   "endDate": "2022-05-15T14:49:04.1570000Z"
  return [
    {
      title: t("Punished User Id"),
      dataIndex: "punishedUserId",
      key: "punishedUserId",
    },
    {
      title: t("Message To User"),
      dataIndex: "messageToUser",
      key: "messageToUser",
    },
    {
      title: t("Punishment Type Description"),
      dataIndex: "punishmentTypeDescription",
      key: "punishmentTypeDescription",
    },
    {
      title: t("Punishment Id"),
      dataIndex: "punishmentId",
      key: "punishmentId",
    },
    {
      title: t("Period From"),
      dataIndex: "beginDate",
      key: "beginDate",
    },
    {
      title: t("Period To"),
      dataIndex: "endDate",
      key: "endDate",
    },
  ];
};

export default GetRecentBanStatusCols;
