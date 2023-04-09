import React from "react";
import GameTicketResultSubmitter from "./GameTicketResultSubmitter";
import UserTicketResultSubmitter from "./UserTicketResultSubmitter";
import DisplayNameChangeResultSubmitter from "./DisplayNameChangeResultSubmitter";
import AssetStatusUpdateResultSubmitter from "./AssetStatusUpdateResultSubmitter";
import ticketTypeMap from "./TicketTypeMap";
import { readData } from "utils";
import { DynamicEvent } from "constants/index.js";

let submitters = {
  GameTicketResultSubmitter,
  UserTicketResultSubmitter,
  DisplayNameChangeResultSubmitter,
  AssetStatusUpdateResultSubmitter,
};
const ResultSubmitter = ({ ticketData, onTicketChange, doWhitelistAction }) => {
  if (!ticketData) {
    return null;
  }

  const { eventType } = ticketData;

  // dynamic events
  if (eventType === DynamicEvent) {
    const { dynamicEvent } = ticketData;
    const templateType = dynamicEvent && dynamicEvent.templateType;
    const CurrentSubmitter = submitters[ticketTypeMap[templateType].submitter];
    if (!dynamicEvent.dataString) return null;
    return (
      <CurrentSubmitter
        ticketId={ticketData.ticketId}
        dataString={ticketData.dynamicEvent.dataString}
        onTicketChange={onTicketChange}
        doWhitelistAction={doWhitelistAction}
      />
    );
  } else {
    const CurrentSubmitter = submitters[ticketTypeMap[eventType].submitter];
    const placeId = readData(ticketData, ticketTypeMap[eventType].placeId);
    return (
      <CurrentSubmitter
        ticketId={ticketData.ticketId}
        onTicketChange={onTicketChange}
        placeId={placeId}
      />
    );
  }
};
export default ResultSubmitter;
