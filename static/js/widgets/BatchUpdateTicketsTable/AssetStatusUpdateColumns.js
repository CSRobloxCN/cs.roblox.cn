import React from "react";
import { HandleAssetStatus } from "widgets/HandleAssetStatus";
import { useTranslation } from "react-i18next";

const AssetStatusUpdateColumns = (handleAssetStatus) => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("Ticket ID"),
      dataIndex: "ticketId",
      width: "10%",
    },
    {
      title: t("Handle Asset Status"),
      dataIndex: "ticketId",
      width: "300px",
      // eslint-disable-next-line react/display-name
      render: (ticketId, row) => (
        <HandleAssetStatus
          handleAssetStatus={handleAssetStatus}
          ticketId={ticketId}
          row={row}
        />
      ),
    },
  ];

  return columns;
};

export default AssetStatusUpdateColumns;
