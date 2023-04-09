const GetActionHistoryTypes = (t) => {
  if (!t) {
    return [];
  }

  return [
    {
      value: "userManagement",
      label: t("User Management"),
      children: [
        {
          value: "id",
          label: t("User ID"),
          example: "e.g. 2328636299",
          element: "input", // indicates using the Input element for user input
        },
        {
          value: "name",
          label: t("User Name"),
          example: "e.g. Robloxianf8h4n2e5d",
          element: "input",
        },
        {
          value: "moderatorEmail",
          label: t("Moderator Email"),
          example: "e.g. rwang@cn.roblox.com",
          element: "input",
        },
        {
          value: "actionType",
          label: t("Action Type"),
          example: t("Select Ban/Unban"),
          element: "select", // indicates using the Select element for user input
          options: [
            {
              value: "Ban",
              label: t("Ban User"),
              default: true, // default selected item
            },
            {
              value: "Unban",
              label: t("Unban User"),
            },
          ],
        },
      ],
    },
  ];
};

export default GetActionHistoryTypes;
