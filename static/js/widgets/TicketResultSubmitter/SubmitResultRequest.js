import axios from "axios";
import config from "config";

const Results = {
  None: "None",
  WarnUser: "WarnUser",
  BanUser: "BanUser",
  RemoveGameFromWhitelist: "RemoveGameFromWhitelist",
  AddGameToWhitelist: "AddGameToWhitelist",
  Reopen: "Reopen",
  ChangeDisplayName: "ChangeDisplayName",
};

function submitResult(
  { ticketId, result, comment, actionLength },
  accessToken,
  additionalData
) {
  let data = {
    ticketId,
    result,
    comment,
    actionLength,
  };
  if (additionalData) {
    data = Object.assign({}, data, additionalData);
  }
  return axios({
    method: "POST",
    url: config.resourceServer.SubmitTicketResult,
    data: data,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export { Results, submitResult };
