const PlaceUpdated = "PlaceUpdated";
const DynamicEvent = "DynamicEvent";
const DisplayNameChangeEvent = "DisplayNameChangeEvent";
const AssetStatusUpdateEvent_Avatar = "AssetStatusUpdateEvent_Avatar";
const AssetStatusUpdateEvent_Toolbox = "AssetStatusUpdateEvent_Toolbox";
const USER_NAME = "1";
const USER_ID = "2";
const Results = {
  None: "None",
  WarnUser: "WarnUser",
  BanUser: "BanUser",
  RemoveGameFromWhitelist: "RemoveGameFromWhitelist",
  AddGameToWhitelist: "AddGameToWhitelist",
  Reopen: "Reopen",
  Close: "Close",
  ChangeDisplayName: "ChangeDisplayName",
  ApproveUpdateAssetStatus: "ApproveUpdateAssetStatus",
  RejectUpdateAssetStatus: "RejectUpdateAssetStatus",
};
const DisplayNameTicketExpirationDay = 7;

const ModerationEvents = {
  PlaceUpdated: { value: 1, name: "PlaceUpdated" },
  PlaceInGameAbuseReport: { value: 2, name: "PlaceInGameAbuseReport" },
  UserInGameAbuseReport: { value: 3, name: "UserInGameAbuseReport" },
  UserInAppAbuseReport: { value: 4, name: "UserInAppAbuseReport" },
  DynamicEvent: { value: 6, name: "DynamicEvent" },
  DisplayNameChangeEvent: { value: 7, name: "DisplayNameChangeEvent" },
  GameOptInEvent: { value: 9, name: "GameOptInEvent" },
  DisplayNameRescanEvent: { value: 10, name: "DisplayNameRescanEvent" },
  PlaceSnapshotEvent: { value: 11, name: "PlaceSnapshotEvent" },
  GameInformationUpdateEvent: { value: 12, name: "GameInformationUpdateEvent" },
  PlaceInAppAbuseReport: { value: 13, name: "PlaceInAppAbuseReport" },
  DisplayNameOnlineRescanEvent: {
    value: 14,
    name: "DisplayNameOnlineRescanEvent",
  },
  PlaceUpdatedWhenOptInEvent:{
    value: 15,
    name: "PlaceUpdatedWhenOptInEvent",
  },
  PlaceUpdatedAfterOptInEvent:{
    value: 16,
    name: "PlaceUpdatedAfterOptInEvent",
  },
  AssetStatusUpdateEvent_Avatar: {
    value: 17,
    name: "AssetStatusUpdateEvent_Avatar",
  },
  AssetStatusUpdateEvent_Toolbox: {
    value: 18,
    name: "AssetStatusUpdateEvent_Toolbox",
  },

};

const TicketPriority = {
  normal: 1,
  high: 2,
};

export {
  PlaceUpdated,
  DynamicEvent,
  DisplayNameChangeEvent,
  AssetStatusUpdateEvent_Avatar,
  AssetStatusUpdateEvent_Toolbox,
  USER_NAME,
  USER_ID,
  Results,
  ModerationEvents,
  DisplayNameTicketExpirationDay,
  TicketPriority,
};
