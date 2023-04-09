const GetModeratorInfoMethods = (t) => {
  if (!t) {
    return;
  }

  return [
    {
      value: "1",
      type: "ModeratorIds",
      name: t("Moderator ID"),
      placeholder: "e.g. 123",
    },
    {
      value: "2",
      type: "ModeratorEmails",
      name: t("Moderator Email"),
      placeholder: "e.g. xxx@xxx.com",
    }
  ];
};

export default GetModeratorInfoMethods;
