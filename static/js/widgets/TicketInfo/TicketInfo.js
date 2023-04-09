import React from "react";
import ticketInfoMap from "./ticketInfoMap";
import PlaceInAppAbuseReportTicketInfo from "./PlaceInAppAbuseReportTicketInfo";
import PlaceInGameAbuseReportTicketInfo from "./PlaceInGameAbuseReportTicketInfo";
import UserInAppAbuseReportTicketInfo from "./UserInAppAbuseReportTicketInfo";
import UserInGameAbuseReportTicketInfo from "./UserInGameAbuseReportTicketInfo";
import { DynamicTicketInfo } from "./DynamicTicketInfo";
import "./TicketInfo.css";
const eventTypeTemplateMap = {
  userInGameAbuseReportEvent: UserInGameAbuseReportTicketInfo,
  placeInGameAbuseReportEvent: PlaceInGameAbuseReportTicketInfo,
  userInAppAbuseReportEvent: UserInAppAbuseReportTicketInfo,
  placeInAppAbuseReportEvent: PlaceInAppAbuseReportTicketInfo,
  dynamicEvent: DynamicTicketInfo,
};
function TicketInfo({ ticket }) {
  let { eventTypes } = ticketInfoMap;
  let eventType = eventTypes.find((type) => ticket[type]);
  let Template = eventTypeTemplateMap[eventType];
  return <Template ticket={ticket} />;
}
export default TicketInfo;
