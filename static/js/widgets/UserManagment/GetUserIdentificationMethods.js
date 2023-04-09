import { USER_NAME, USER_ID } from "constants/index";

const GetUserIdentificationMethods = (t) => {
  if (!t) {
    return;
  }

  return [
    {
      value: USER_NAME,
      type: "name",
      name: t("User Name"),
      placeholder: "e.g. Robloxianq1l8m4s8m",
    },
    {
      value: USER_ID,
      type: "id",
      name: t("User ID"),
      placeholder: "e.g. 2411491917",
    },
    {
      value: "3",
      type: "openId",
      name: t("User Open ID"),
      placeholder: "e.g. A8AE646FFD13D31EAE830A30EA1EC655",
    },
  ];
};

export default GetUserIdentificationMethods;