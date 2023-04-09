const REDIRECT_URI = `${window.location.origin}/login/callback`;

const ProductionOkta = {
  OKTA_DOMAIN: "https://luobu.okta.com",
  ISSUER: "https://luobu.okta.com/oauth2/default",
  CLIENT_ID: "0oa1jophxv7V8D6Dd4x7",
  OKTA_TESTING_DISABLEHTTPSCHECK: "false",
  UI_SERVICE: "https://cs.roblox.cn",
  API_GATEWAY: "https://cs.roblox.cn",
};
const TestingOkta = {
  OKTA_DOMAIN: "https://luobu.okta.com",
  ISSUER: "https://luobu.okta.com/oauth2/default",
  CLIENT_ID: "0oa1jophxv7V8D6Dd4x7",
  OKTA_TESTING_DISABLEHTTPSCHECK: "false",
  UI_SERVICE: "https://cs-dev.roblox.cn",
  API_GATEWAY: "https://cs-dev.roblox.cn",
};
const DevelopmentOkta = {
  OKTA_DOMAIN: "https://dev-4124158.okta.com",
  ISSUER: "https://dev-4124158.okta.com/oauth2/default",
  CLIENT_ID: "0oa21z6yh6tuBVEvL5d6",
  OKTA_TESTING_DISABLEHTTPSCHECK: "false",
  UI_SERVICE: process.env.REACT_APP_LOCAL_UISERVICE_PORT
    ? "http://localhost:" + process.env.REACT_APP_LOCAL_UISERVICE_PORT
    : "http://172.20.144.60:9001",
  API_GATEWAY: "https://cs-dev.roblox.cn",
};
const ProductionSortConfig = {
  GAME_SORT_INFO: [
    { label: "迅速崛起", value: 111 },
    { label: "学习与探索", value: 105 },
    {
      label: "角色扮演",
      value: 123,
    },
    { label: "探险奇遇", value: 126 },
    { label: "互动比拼", value: 129 },
    {
      label: "障碍赛跑",
      value: 132,
    },
    { label: "经营管理", value: 135 },
    { label: "养成探索", value: 138 },
    { label: "所有创作", value: 110 },
  ],
};
const DevelopmentSortConfig = {
  GAME_SORT_INFO: [
    { label: "迅速崛起", value: 265 },
    { label: "学习与探索", value: 266 },
    {
      label: "角色扮演",
      value: 267,
    },
    { label: "探险奇遇", value: 268 },
    { label: "互动比拼", value: 269 },
    {
      label: "障碍赛跑",
      value: 270,
    },
    { label: "经营管理", value: 271 },
    { label: "养成探索", value: 272 },
    { label: "所有创作", value: 273 },
  ],
};
const TestingSortConfig = {
  GAME_SORT_INFO: [
    { label: "迅速崛起", value: 265 },
    { label: "学习与探索", value: 266 },
    {
      label: "角色扮演",
      value: 267,
    },
    { label: "探险奇遇", value: 268 },
    { label: "互动比拼", value: 269 },
    {
      label: "障碍赛跑",
      value: 270,
    },
    { label: "经营管理", value: 271 },
    { label: "养成探索", value: 272 },
    { label: "所有创作", value: 273 },
  ],
};
let oktaConfig = null;
let sortConfig;
if (/localhost/i.test(window.location.hostname)) {
  oktaConfig = DevelopmentOkta;
  sortConfig = DevelopmentSortConfig;
} else if (/cs-dev.roblox.cn/i.test(window.location.hostname)) {
  oktaConfig = TestingOkta;
  sortConfig = TestingSortConfig;
} else {
  oktaConfig = ProductionOkta;
  sortConfig = ProductionSortConfig;
}

export default {
  oidc: {
    clientId: oktaConfig.CLIENT_ID,
    issuer: oktaConfig.ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ["openid", "profile", "email", "groups"],
    pkce: true,
    disableHttpsCheck: oktaConfig.OKTA_TESTING_DISABLEHTTPSCHECK,
  },
  resourceServer: {
    GetTicketByID: `${oktaConfig.UI_SERVICE}/api/ticket/`,
    GetTicketWithActionByID: (ticketId) =>
      `${oktaConfig.UI_SERVICE}/api/ticket/${ticketId}/ticket-with-action`,
    UserInAppAbuseReport: `${oktaConfig.UI_SERVICE}/api/event-with-tickets/user-in-app-abuse-report`,
    UserInGameAbuseReport: `${oktaConfig.UI_SERVICE}/api/event-with-tickets/user-in-game-abuse-report`,
    PlaceInAppAbuseReport: `${oktaConfig.UI_SERVICE}/api/event-with-tickets/place-in-app-abuse-report`,
    PlaceInGameAbuseReport: `${oktaConfig.UI_SERVICE}/api/event-with-tickets/place-in-game-abuse-report`,
    GetTicketHistoryByID: (ticketId) =>
      `${oktaConfig.UI_SERVICE}/api/ticket/${ticketId}/history`,
    GetRobloxUserInfoWithUserID: `${oktaConfig.API_GATEWAY}/proxy/roblox-public/v1/users/`,
    GetRobloxGameInfoWithGameID: `${oktaConfig.UI_SERVICE}/api/get-game-info-by-universe-id?universeIds=`,
    GetGameIDWithPlaceID: `${oktaConfig.UI_SERVICE}/api/get-game-info-by-place-id?placeIds=`,
    GetTicketPoolsWithPriority: `${oktaConfig.UI_SERVICE}/api/ticket-pools-with-priorities`,
    GetTicketFromPool: `${oktaConfig.UI_SERVICE}/api/ticket-pool/most-urgent-ticket`,
    SubmitTicketResult: `${oktaConfig.UI_SERVICE}/api/ticket/submit-result`,
    GetModeratorHistoryByID: `${oktaConfig.UI_SERVICE}/api/moderator/history`,
    GetModeratorLockedTicketsByID: `${oktaConfig.UI_SERVICE}/api/moderator/locked-tickets`,
    BatchUpdateTicketsStatus: `${oktaConfig.UI_SERVICE}/api/ticket/batch-update-status`,
    GetModeratorIntID: `${oktaConfig.UI_SERVICE}/api/moderator`,
    CreateModeratorWithEmail: `${oktaConfig.UI_SERVICE}/api/moderator`,
    AssetsAllowlist: `${oktaConfig.UI_SERVICE}/api/toolbox/allowlist`,
    AllowlistUpdateHistory: `${oktaConfig.UI_SERVICE}/api/toolbox/allowlist-update-history`,
    GetLuobuGameStatusMetrics: `${oktaConfig.UI_SERVICE}/api/luobu-game-metrics`,
    GetLuobuGameStatusHistoryByGameId: (gameId) =>
      `${oktaConfig.UI_SERVICE}/api/luobu-game-whiteList-status-histories/${gameId}`,
    GetLuobuGamesStatusHistories: `${oktaConfig.UI_SERVICE}/api/luobu-game-whiteList-status-histories`,
    GetUserInfo: `${oktaConfig.UI_SERVICE}/api/user/info`,
    MultiGetByUserId: `${oktaConfig.UI_SERVICE}/api/user/multi-get-by-user-id`,
    BanUser: `${oktaConfig.UI_SERVICE}/api/user/ban`,
    UnbanUser: `${oktaConfig.UI_SERVICE}/api/user/unban`,
    UpdateUserDisplayName: `${oktaConfig.UI_SERVICE}/api/user/change-user-display-name`,
    GetActionHistoryByUserId: `${oktaConfig.UI_SERVICE}/api/user/get-ban-user-history-by-userId`,
    GetRecentBanStatusByUserId: `${oktaConfig.UI_SERVICE}/api/user/get-worst-unacknowledged-punishment-operation`,
    GetUserPresenceByIds: `${oktaConfig.UI_SERVICE}/api/user/get-user-presence-by-ids`,
    GetUserManagementActionHistory: `${oktaConfig.UI_SERVICE}/api/user/get-user-management-action-history`,
    GetGameIdList: `${oktaConfig.UI_SERVICE}/api/luobu-game-whiteList-status/gameIds`,
    GetLuobuGameSortInfo: `${oktaConfig.UI_SERVICE}/api/luobu-sort-info`,
    UpdateLuobuGameSortInfo: `${oktaConfig.UI_SERVICE}/api/luobu-sort-info`,
    LuobuGameSortIdList: sortConfig.GAME_SORT_INFO,
    GetDeveloperEmail: (gameId) =>
      `${oktaConfig.UI_SERVICE}/api/developer-email?gameId=${gameId}`,
    GetGameIcon: (universeIds) =>
      `${oktaConfig.UI_SERVICE}/api/get-game-icon?universeIds=${universeIds}`,
    BatchLockTickets: `${oktaConfig.UI_SERVICE}/api/ticket-pool/batch-lock`,
    GetBatchLockedTickets: `${oktaConfig.UI_SERVICE}/api/tickets`,
    BatchSubmitTickets: `${oktaConfig.UI_SERVICE}/api/tickets/submit-batch`,
    GetPlaceSnapshotResult: (Id) =>
      `${oktaConfig.UI_SERVICE}/api/place-snapshot-result/${Id}`,
    SavePlaceSnapshotResult: `${oktaConfig.UI_SERVICE}/api/place-snapshot-result`,
    GetAsset: (assetId) =>
      `${oktaConfig.UI_SERVICE}/api/get-asset?assetId=${assetId}`,
    GetUserInAppAbuseReport: `${oktaConfig.UI_SERVICE}/api/event/user-in-app-abuse-report`,
    GetUserInGameAbuseReport: `${oktaConfig.UI_SERVICE}/api/event/user-in-game-abuse-report`,
    GetPlaceInAppAbuseReport: `${oktaConfig.UI_SERVICE}/api/event/place-in-app-abuse-report`,
    GetPlaceInGameAbuseReport: `${oktaConfig.UI_SERVICE}/api/event/place-in-game-abuse-report`,
    ApproveGame: `${oktaConfig.UI_SERVICE}/api/allowlist/approve-game`,
    RejectGame: `${oktaConfig.UI_SERVICE}/api/allowlist/reject-game`,
    CloseGame: `${oktaConfig.UI_SERVICE}/api/allowlist/close-game`,
    GetPlacesUnderGameId: `${oktaConfig.UI_SERVICE}/api/place-updated/get-places-version-numbers-by-game-id`,
    GetGameUpdateRecordByTicketId: `${oktaConfig.UI_SERVICE}/api/place-updated/get-records-by-ticket-id`,
    GetGameUpdateMostUrgentTicket: `${oktaConfig.UI_SERVICE}/api/place-updated/most-urgent-ticket`,
    GameUpdateRecordResultBatchSubmit: `${oktaConfig.UI_SERVICE}/api/place-updated/submit-batch`,
    GetModeratorTicketReviewData: `${oktaConfig.UI_SERVICE}/api/moderators/moderator-ticket-review-statistics`,
    GetModeratorSubmittedTicketData: `${oktaConfig.UI_SERVICE}/api/moderators/submitted-ticket-info`,
    GetModeratorReopenedTicketData: `${oktaConfig.UI_SERVICE}/api/moderators/reopened-ticket-info`,
    GetPlaceVersionPolicyLabels: `${oktaConfig.UI_SERVICE}/api/place-updated/get-whitelist-status`,
    GetAssetDashboard: `${oktaConfig.UI_SERVICE}/api/toolbox/asset-dashboard`,
    GetTicketsByTemplateIdsAndStatusPaged:`${oktaConfig.UI_SERVICE}/api/tickets/get-ticket-by-templatetype-status`,
  },
};
