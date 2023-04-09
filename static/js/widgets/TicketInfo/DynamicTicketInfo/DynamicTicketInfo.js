import React from "react";
import GameInformationUpdateTicket from "./GameInformationUpdateTicket";
import GameOptInTicket from "./GameOptInTicket";
import DisplayNameRescanTicket from "./DisplayNameRescanTicket";
import DisplayNameChangeTicket from "./DisplayNameChangeTicket";
import AssetStatusUpdate_AvatarTicket from "./AssetStatusUpdate_AvatarTicket";
import AssetStatusUpdate_ToolboxTicket from "./AssetStatusUpdate_ToolboxTicket";
import DisplayNameOnlineRescanTicket from "./DisplayNameOnlineRescanTicket";
import PlaceUpdatedAfterOptInTicket from "./PlaceUpdatedAfterOptInTicket";
import { AITicketDetail } from "widgets/AITicketDetail";

const DynamicTicketInfo = ({ ticket }) => {
  if (ticket.dynamicEvent.templateType == "GameInformationUpdateEvent") {
    return <GameInformationUpdateTicket ticket={ticket} />;
  } else if (ticket.dynamicEvent.templateType == "GameOptInEvent") {
    return <GameOptInTicket ticket={ticket} />;
  } else if (ticket.dynamicEvent.templateType == "PlaceSnapshotEvent") {
    return <AITicketDetail ticket={ticket} />;
  } else if (ticket.dynamicEvent.templateType == "DisplayNameChangeEvent") {
    return <DisplayNameChangeTicket ticket={ticket} />;
  } else if (ticket.dynamicEvent.templateType == "AssetStatusUpdateEvent_Avatar") {
    return <AssetStatusUpdate_AvatarTicket ticket={ticket} />;
  } else if (ticket.dynamicEvent.templateType == "AssetStatusUpdateEvent_Toolbox") {
    return <AssetStatusUpdate_ToolboxTicket ticket={ticket} />;
  } else if (ticket.dynamicEvent.templateType == "DisplayNameRescanEvent") {
    return <DisplayNameRescanTicket ticket={ticket} />;
  } else if (
    ticket.dynamicEvent.templateType == "DisplayNameOnlineRescanEvent"
  ) {
    return <DisplayNameOnlineRescanTicket ticket={ticket} />;
  } else if (
    ticket.dynamicEvent.templateType == "PlaceUpdatedAfterOptInEvent" || ticket.dynamicEvent.templateType == "PlaceUpdatedWhenOptInEvent"
  ) {
    return <PlaceUpdatedAfterOptInTicket ticket={ticket} />;
  }
  return null;
};

export default DynamicTicketInfo;
