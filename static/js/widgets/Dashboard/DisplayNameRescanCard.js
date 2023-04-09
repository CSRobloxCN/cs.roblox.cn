import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { useHistory } from "react-router-dom";
import { ModerationEvents } from "constants/index";
import { TicketPoolCard } from "components/TicketPoolCard";

const DisplayNameRescanCard = ({ pool, picker,onTicketQuery }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const generateExtra = () => {
    return (
      <>
        <Button
          type="link"
          onClick={() =>
            history.push(
              `/batch-update?templateType=${ModerationEvents.DisplayNameRescanEvent.name}`
            )
          }
        >
          {t("Locked tickets")}
        </Button>
        {pool.openTicketCount > 0 && (
          <Button type="link" onClick={() => picker(pool)}>
            {t("Pick Tickets")}
          </Button>
        )}
      </>
    );
  };

  return <TicketPoolCard pool={pool} extra={generateExtra()}  onTicketQuery={onTicketQuery}/>;
};

export default DisplayNameRescanCard;
