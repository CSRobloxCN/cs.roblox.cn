let infoMap = {
  PlaceUpdated: {
    ticketId: "ticketId",
    eventType: ["placeUpdatedEvent", "eventType"],
    createdUtc: "createdUtc",
    gameId: ["placeUpdatedEvent", "gameId"],
    placeId: ["placeUpdatedEvent", "placeId"],
    creatorId: ["placeUpdatedEvent", "creatorId"],
    versionNumber: ["placeUpdatedEvent", "versionNumber"],
    status: "status",
    moderatorId: "moderatorId",
  },
  UserInGameAbuseReport: {
    ticketId: "ticketId",
    eventType: ["userInGameAbuseReportEvent", "eventType"],
    createdUtc: "createdUtc",
    placeId: ["userInGameAbuseReportEvent", "placeId"],
    submitterUserId: ["userInGameAbuseReportEvent", "submitterUserId"],
    accusedUserId: ["userInGameAbuseReportEvent", "accusedUserId"],
    versionNumber: ["userInGameAbuseReportEvent", "versionNumber"],
    status: "status",
    category: ["userInGameAbuseReportEvent", "category"],
    moderatorId: "moderatorId",
  },
  PlaceInGameAbuseReport: {
    ticketId: "ticketId",
    eventType: ["placeInGameAbuseReportEvent", "eventType"],
    createdUtc: "createdUtc",
    placeId: ["placeInGameAbuseReportEvent", "placeId"],
    submitterUserId: ["placeInGameAbuseReportEvent", "submitterUserId"],
    versionNumber: ["placeInGameAbuseReportEvent", "versionNumber"],
    status: "status",
    category: ["placeInGameAbuseReportEvent", "category"],
    moderatorId: "moderatorId",
  },
  UserInAppAbuseReport: {
    ticketId: "ticketId",
    eventType: ["userInAppAbuseReportEvent", "eventType"],
    createdUtc: "createdUtc",
    submitterUserId: ["userInAppAbuseReportEvent", "submitterUserId"],
    accusedUserId: ["userInAppAbuseReportEvent", "accusedUserId"],
    status: "status",
    category: ["userInAppAbuseReportEvent", "category"],
    moderatorId: "moderatorId",
  },
  PlaceInAppAbuseReport: {
    ticketId: "ticketId",
    eventType: ["placeInAppAbuseReportEvent", "eventType"],
    createdUtc: "createdUtc",
    placeId: ["placeInAppAbuseReportEvent", "placeId"],
    submitterUserId: ["placeInAppAbuseReportEvent", "submitterUserId"],
    status: "status",
    category: ["placeInAppAbuseReportEvent", "category"],
    moderatorId: "moderatorId",
  },
  DynamicEvent: {
    ticketId: "ticketId",
    eventType: ["dynamicEvent", "templateType"],
    createdUtc: "createdUtc",
    status: "status",
    moderatorId: "moderatorId",
  },
};

let ticketExtraInfoMap = {
  PlaceUpdated: {
    comment: ["placeUpdatedEvent", "comment"],
    chatEntries: ["placeUpdatedEvent", "chatEntries"],
  },
  UserInGameAbuseReport: {
    comment: ["userInGameAbuseReportEvent", "comment"],
    chatEntries: ["userInGameAbuseReportEvent", "chatEntries"],
  },
  PlaceInGameAbuseReport: {
    comment: ["placeInGameAbuseReportEvent", "comment"],
    chatEntries: ["placeInGameAbuseReportEvent", "chatEntries"],
  },
  UserInAppAbuseReport: {
    comment: ["userInAppAbuseReportEvent", "comment"],
    chatEntries: ["userInAppAbuseReportEvent", "chatEntries"],
  },
  PlaceInAppAbuseReport: {
    comment: ["placeInAppAbuseReportEvent", "comment"],
    chatEntries: ["placeInAppAbuseReportEvent", "chatEntries"],
  },
  DynamicEvent: {
    comment: ["dynamicEvent", "comment"],
    chatEntries: ["dynamicEvent", "chatEntries"],
  },
};

let fieldLinkMap = {
  placeId: "https://www.roblox.com/games/",
  creatorId: "https://www.roblox.com/users/",
  submitterUserId: "https://www.roblox.com/users/",
  accusedUserId: "https://www.roblox.com/users/",
  UserId: "https://www.roblox.com/users/",
};

let fieldTimeMap = {
  createdUtc: true,
};
let fieldTranslateMap = {
  eventType: true,
};
let fieldTextMap = {
  comment: true,
};

let fieldListMap = {
  chatEntries: true,
};

let eventTypes = [
  "placeUpdatedEvent",
  "userInGameAbuseReportEvent",
  "placeInGameAbuseReportEvent",
  "userInAppAbuseReportEvent",
  "placeInAppAbuseReportEvent",
  "dynamicEvent",
];

export default {
  fieldLinkMap,
  infoMap,
  fieldTimeMap,
  fieldTranslateMap,
  fieldTextMap,
  fieldListMap,
  ticketExtraInfoMap,
  eventTypes,
};
