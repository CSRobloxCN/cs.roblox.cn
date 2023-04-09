import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import styles from "./Dashboard.module.css";
import { Row, Tabs, Col, Modal } from "antd";
import { useOktaAuth } from "@okta/okta-react";
import config from "config";
import { useHistory } from "react-router-dom";
import { ModeratorAccount } from "context/ModeratorAccount";
import { loading } from "helpers/promiseWithLoading";
import { blockLoading } from "helpers/promiseWithBlocking";
import { ModerationEvents } from "constants/index";
import { getData, postData } from "helpers/httpRequest";
import DisplayNameChangeEventCard from "./DisplayNameChangeEventCard";
import DisplayNameRescanCard from "./DisplayNameRescanCard";
import DisplayNameOnlineRescanCard from "./DisplayNameOnlineRescanCard";
import AssetStatusUpdateEventCard from "./AssetStatusUpdateEventCard";
import AssetStatusUpdateEventToolboxCard from "./AssetStatusUpdateEventToolboxCard";
import { TicketPoolCard } from "components/TicketPoolCard";
import axios from "axios";
import moment from "moment";
import { ObjectsKeyTable } from "components/ObjectsKeyTable";

const { TabPane } = Tabs;

const PoolTypes = {
  Game: "Game",
  User: "User",
  "Display Name": "Display Name",
  "Game Info": "Game Info",
  Asset: "Asset",
};

const DefaultJumper = (data) => "/ticket?ticketId=" + data.ticketId;
const DefaultPicker = config.resourceServer.GetTicketFromPool;

const PoolTypeMap = {
  [ModerationEvents.AssetStatusUpdateEvent_Avatar.name]: PoolTypes["Asset"],
  [ModerationEvents.AssetStatusUpdateEvent_Toolbox.name]: PoolTypes["Asset"],
  [ModerationEvents.GameInformationUpdateEvent.name]: PoolTypes["Game Info"],
  [ModerationEvents.DisplayNameChangeEvent.name]: PoolTypes["Display Name"],
  [ModerationEvents.DisplayNameRescanEvent.name]: PoolTypes["Display Name"],
  [ModerationEvents.DisplayNameOnlineRescanEvent.name]:
    PoolTypes["Display Name"],
  [ModerationEvents.UserInGameAbuseReport.name]: PoolTypes["User"],
  [ModerationEvents.UserInAppAbuseReport.name]: PoolTypes["User"],
  [ModerationEvents.PlaceInGameAbuseReport.name]: PoolTypes["Game"],
  [ModerationEvents.PlaceInAppAbuseReport.name]: PoolTypes["Game"],
  [ModerationEvents.GameOptInEvent.name]: PoolTypes["Game"],
  [ModerationEvents.PlaceSnapshotEvent.name]: PoolTypes["Game"],
  [ModerationEvents.PlaceUpdatedAfterOptInEvent.name]: PoolTypes["Game"],
};

const PoolPickupUrlMap = {
  [ModerationEvents.GameOptInEvent.name]:
    config.resourceServer.GetGameUpdateMostUrgentTicket,
  [ModerationEvents.PlaceUpdatedAfterOptInEvent.name]:
    config.resourceServer.GetGameUpdateMostUrgentTicket,
  [ModerationEvents.DisplayNameChangeEvent.name]:
    config.resourceServer.BatchLockTickets,
  [ModerationEvents.DisplayNameRescanEvent.name]:
    config.resourceServer.BatchLockTickets,
  [ModerationEvents.DisplayNameOnlineRescanEvent.name]:
    config.resourceServer.BatchLockTickets,
  [ModerationEvents.AssetStatusUpdateEvent_Avatar.name]:
    config.resourceServer.BatchLockTickets,
  [ModerationEvents.AssetStatusUpdateEvent_Toolbox.name]:
    config.resourceServer.BatchLockTickets,
};

const PoolRedirectPageMap = {
  [ModerationEvents.GameOptInEvent.name]: DefaultJumper,
  [ModerationEvents.PlaceUpdatedAfterOptInEvent.name]: DefaultJumper,
  [ModerationEvents.DisplayNameChangeEvent.name]: (data) =>
    `/batch-update?templateType=${data.poolName}`,
  [ModerationEvents.DisplayNameRescanEvent.name]: (data) =>
    `/batch-update?templateType=${data.poolName}`,
  [ModerationEvents.DisplayNameOnlineRescanEvent.name]: (data) =>
    `/batch-update?templateType=${data.poolName}`,
  [ModerationEvents.AssetStatusUpdateEvent_Avatar.name]: (data) =>
    `/batch-update?templateType=${data.poolName}`,
  [ModerationEvents.AssetStatusUpdateEvent_Toolbox.name]: (data) =>
    `/batch-update?templateType=${data.poolName}`,
};

const PoolCardMap = {
  [ModerationEvents.DisplayNameChangeEvent.name]: DisplayNameChangeEventCard,
  [ModerationEvents.DisplayNameRescanEvent.name]: DisplayNameRescanCard,
  [ModerationEvents.DisplayNameOnlineRescanEvent
    .name]: DisplayNameOnlineRescanCard,
  [ModerationEvents.AssetStatusUpdateEvent_Avatar
    .name]: AssetStatusUpdateEventCard,
  [ModerationEvents.AssetStatusUpdateEvent_Toolbox
    .name]: AssetStatusUpdateEventToolboxCard,
};

const MergedPools = {
  [ModerationEvents.GameOptInEvent.name]: {
    [ModerationEvents.GameOptInEvent.name]: true,
    [ModerationEvents.PlaceUpdatedWhenOptInEvent.name]: true,
  },
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { authState } = useOktaAuth();
  const history = useHistory();

  const [poolList, setPoolList] = useState(null);
  const [ticketListTotal, setTicketListTotal] = useState(0);
  const [showTicketListModal, setShowTicketListModal] = useState(false);
  const [ticketList, setTicketList] = useState([]);
  const [queryPoolId, setQueryPoolId] = useState();
  const [queryStatus, setQueryStatus] = useState();
  const userInfo = useContext(ModeratorAccount);
  // const tableColumns = [
  //   {
  //     title: t("Data"),
  //     render: function r(record, _, index) {
  //

  //       return (

  //       );
  //     },
  //     key: "ticketId",
  //   },
  // ];
  useEffect(() => {
    const accessToken = authState.accessToken.value;

    loading(
      getData(
        config.resourceServer.GetTicketPoolsWithPriority,
        null,
        accessToken
      ).then((res) => {
        if (res.status == 200) {
          const pools = [
            ...res.data.data.highPriorityTickets,
            ...res.data.data.normalPriorityTickets,
          ];

          // merge the pools
          pools.forEach((pool) => {
            pool.type = PoolTypeMap[pool.poolName];
            pool.pickupUrl = PoolPickupUrlMap[pool.poolName] || DefaultPicker;
            const mergeRules = MergedPools[pool.poolName];
            if (mergeRules) {
              let mergePools = pools.filter((p) => mergeRules[p.poolName]);
              const newPool = mergePools.reduce((pre, cur) => {
                return {
                  closedTicketCount:
                    pre.closedTicketCount + cur.closedTicketCount,
                  finishedTicketCount:
                    pre.finishedTicketCount + cur.finishedTicketCount,
                  lockedTicketCount:
                    pre.lockedTicketCount + cur.lockedTicketCount,
                  openTicketCount: pre.openTicketCount + cur.openTicketCount,
                  poolId: pool.poolId,
                  poolName: pool.poolName,
                  priority: Math.max(pre.priority, cur.priority),
                };
              });
              pool.closedTicketCount = newPool.closedTicketCount;
              pool.finishedTicketCount = newPool.finishedTicketCount;
              pool.lockedTicketCount = newPool.lockedTicketCount;
              pool.openTicketCount = newPool.openTicketCount;
              pool.priority = newPool.priority;
            }
            pool.jumper = PoolRedirectPageMap[pool.poolName] || DefaultJumper;
            pool.card = PoolCardMap[pool.poolName] || TicketPoolCard;
          });

          let categorizedPools = [];
          Object.keys(PoolTypes).forEach((type) => {
            let filteredPools = pools.filter((pool) => pool.type === type);
            let category = {
              tab: type,
              key: type,
              value: type,
              data: filteredPools,
            };
            categorizedPools.push(category);
          });

          // Group the pools based on pool name, so ticket pools with the same
          // group name will be attached together
          // using the const keyword here because groupedPools won't be reassigned
          const groupedPools = categorizedPools.map((pools) => {
            let groupedData = pools.data.reduce((prev, curr) => {
              prev[curr.poolName] = prev[curr.poolName] || [];
              prev[curr.poolName].push(curr);
              return prev;
            }, Object.create(null));
            return { ...pools, groupedData };
          });

          setPoolList(groupedPools);
        }
      })
    );
  }, [userInfo]);

  if (!userInfo) return null;
  const pickTicketFromPool = async (poolData) => {
    if (poolData.openTicketCount > 0) {
      const response = await postData(
        poolData.pickupUrl || config.resourceServer.GetTicketFromPool,
        { ticketPoolId: poolData.poolId, priority: poolData.priority },
        authState.accessToken.value
      );
      if (response.status === 200 && response.data && response.data.data) {
        history.push(
          poolData.jumper({
            ticketId:
              response.data.data.ticketId ||
              (response.data.data.ticketIds && response.data.data.ticketIds[0]),
            poolName: poolData.poolName,
          })
        );
      }
    }
  };

  let pickTicketFromPoolWithBlockLoading = (poolData) =>
    blockLoading(pickTicketFromPool(poolData), t);

  let changePage = (pageNum) => {
    onTicketQuery(queryPoolId, queryStatus, pageNum);
  };
  let onTicketQuery = (poolId, status, pageNum = 1) => {
    setShowTicketListModal(true);
    setQueryPoolId(poolId);
    setQueryStatus(status);
    axios({
      method: "post",
      url: config.resourceServer.GetTicketsByTemplateIdsAndStatusPaged,
      data: {
        templateTypes: [poolId],
        status,
        desc: false,
        pageNum: pageNum,
        pageSize: 10,
      },
      headers: { Authorization: `Bearer ${authState.accessToken.value}` },
    }).then((res) => {
      if (res.status == 200 && res.data && !res.data.error) {
        setTicketList(res.data.data.itemList);
        setTicketListTotal(res.data.data.total);
      }
    });
  };
  let renderTickets = ticketList
    ?.map((ticket) => {
      let data = JSON.parse(ticket.dynamicEvent.dataString);
      if (typeof data == "object") {
        data.ticketId = ticket.ticketId;
        data.createdUtc = moment
          .utc(ticket.createdUtc)
          .toDate()
          .toLocaleString();
        data.moderatorId = ticket.moderatorId;
        return data;
      }
      return null;
    })
    .filter((v) => v);
  let closeModal = () => {
    setShowTicketListModal(false);
    setTicketList([]);
    setTicketListTotal(0);
  };
  return (
    <div className={styles.dashboard}>
      {poolList && (
        <Tabs defaultActiveKey={poolList[0].key}>
          {poolList.map((poolTab) => {
            return (
              <TabPane tab={t(poolTab.value)} key={poolTab.key}>
                <Row style={{ margin: 0 }} gutter={[20, 20]}>
                  {Object.keys(poolTab.groupedData).map((group) => {
                    const pools = poolTab.groupedData[group];

                    return (
                      <Col key={group}>
                        <Row>
                          {pools.map((pool) => {
                            const Card = pool.card;
                            return (
                              <Card
                                pool={pool}
                                picker={pickTicketFromPoolWithBlockLoading}
                                key={pool.poolName + Math.random()}
                                onTicketQuery={onTicketQuery}
                              />
                            );
                          })}
                        </Row>
                      </Col>
                    );
                  })}
                </Row>
              </TabPane>
            );
          })}
        </Tabs>
      )}
      <Modal
        visible={showTicketListModal}
        onCancel={closeModal}
        onOk={closeModal}
        width="90%"
        destroyOnClose={true}
      >
        <ObjectsKeyTable
          datas={renderTickets}
          pagination={{
            pageSize: 10,
            total: ticketListTotal,
            onChange: changePage,
          }}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
