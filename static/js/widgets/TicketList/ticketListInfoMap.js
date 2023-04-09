let ticketListInfoMap = {
  PlaceUpdated: {
    eventType: ["eventType"],
    gameId: ["gameId"],
    placeId: ["placeId"],
    creatorId: ["creatorId"],
    versionNumber: ["versionNumber"],
  },
  UserInGameAbuseReport: {
    eventType: ["eventType"],
    // gameId: ["gameId"],
    placeId: ["placeId"],
    submitterUserId: ["submitterUserId"],
    accusedUserId: ["accusedUserId"],
    // versionNumber: ["versionNumber"],
    category: ["category"],
    comment: ["comment"],
    // chatEntries: ["chatEntries"],
  },
  PlaceInGameAbuseReport: {
    eventType: ["eventType"],
    // gameId: ["gameId"],
    placeId: ["placeId"],
    submitterUserId: ["submitterUserId"],
    // versionNumber: ["versionNumber"],
    category: ["category"],
    comment: ["comment"],
    // chatEntries: ["chatEntries"],
  },
  UserInAppAbuseReport: {
    eventType: ["eventType"],
    submitterUserId: ["submitterUserId"],
    accusedUserId: ["accusedUserId"],
    category: ["category"],
    comment: ["comment"],
  },
  PlaceInAppAbuseReport: {
    eventType: ["eventType"],
    // gameId: ["gameId"],
    placeId: ["placeId"],
    submitterUserId: ["submitterUserId"],
    category: ["category"],
    comment: ["comment"],
  },
};

let fieldTranslateMap = {
  eventType: true,
};

export { ticketListInfoMap, fieldTranslateMap };
