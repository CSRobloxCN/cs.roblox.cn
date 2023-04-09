import React from "react";
import { Card, Col, Row, Statistic, Typography, Button } from "antd";
import { useTranslation } from "react-i18next";
import { TicketPriority } from "constants/index";
import { SearchOutlined } from "@ant-design/icons";
const { Text } = Typography;

const TicketPoolCard = ({ pool, picker, extra, onTicketQuery }) => {
  const { t } = useTranslation();
  let showTicketQuery = pool.poolId > 6 && pool.poolId != 13;
  return (
    <>
      <Col key={pool.poolId}>
        <Card
          key={pool.poolId}
          title={
            <>
              <span>{t(pool.poolName)}</span>{" "}
              {pool.priority === TicketPriority.high && (
                <Text type="danger">{t("High Priority")}</Text>
              )}
            </>
          }
          extra={
            extra ||
            (pool.openTicketCount > 0 ? (
              <Button
                key="ticketPoolButton"
                type="link"
                onClick={() => picker(pool)}
              >
                {t("Pick a Ticket")}
              </Button>
            ) : null)
          }
        >
          <Row>
            <Col span={12}>
              <Statistic
                title={t("Opened Ticket Count")}
                value={pool.openTicketCount}
                valueStyle={{ color: "#d4380d" }}
              />
              {pool.openTicketCount > 0 && showTicketQuery && (
                <SearchOutlined
                  onClick={() => onTicketQuery(pool.poolId, "Open")}
                />
              )}
            </Col>
            <Col span={12}>
              <Statistic
                title={t("Locked Ticket Count")}
                value={pool.lockedTicketCount}
                valueStyle={{ color: "#52c41a" }}
              />
              {pool.lockedTicketCount > 0 && showTicketQuery && (
                <SearchOutlined
                  onClick={() => onTicketQuery(pool.poolId, "Locked")}
                />
              )}
            </Col>
            <Col span={12}>
              <Statistic
                title={t("Finished Ticket Count")}
                value={pool.finishedTicketCount}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title={t("Closed Ticket Count")}
                value={pool.closedTicketCount}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
};

export default TicketPoolCard;
