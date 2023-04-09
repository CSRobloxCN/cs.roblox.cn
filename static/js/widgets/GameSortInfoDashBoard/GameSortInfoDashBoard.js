import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Col, Input, message, Popconfirm, Row, Select, Table, Typography } from "antd";
import { useOktaAuth } from "@okta/okta-react";
import config from "config";
import styles from "./GameSortInfoDashBoard.module.css";
import { getData } from "../../helpers/httpRequest";
import GetGameSortCols from "./GetGameSortCols";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
const { Group } = Input;
const { Title } = Typography;

const GameSortInfoDashBoard = () => {
  const { t } = useTranslation();

  const columns = GetGameSortCols(t).concat({
    title: t("operation"),
    dataIndex: "operation",
    // eslint-disable-next-line react/display-name
    render: (_, record) =>
      <Popconfirm title={`"Sure to delete? ${record.name}`} onConfirm={() => handleDelete(record.key)}>
        <a>Delete</a>
      </Popconfirm>,
  });
  const { authState } = useOktaAuth();
  let [inputGameId, setInputGameId] = useState("");
  let [sortInfo, setSortInfo] = useState([]);
  let [sortId, setSortId] = useState(null);
  let [displayAddButton, setDisplayAddButton] = useState(false);
  let [addGameInfo, setAddGameInfo] = useState(null);
  let [searchGamePopVisible, setSearchGamePopVisible] = useState(false);
  let [addGameNameComment, setAddGameNameComment] = useState(null);

  function getGameData(gameIds) {
    return axios.get(config.resourceServer.GetRobloxGameInfoWithGameID + gameIds);
  }

  async function postUpdateGameSort(sortId, gameIds) {
    return axios({
      method: "post",
      url: config.resourceServer.UpdateLuobuGameSortInfo,
      data: {
        sortId: sortId,
        universeIds: gameIds,
      },
      headers: {
        Authorization: `Bearer ${authState.accessToken.value}`,
        "Content-Type": "Application/json",
      },
    });

  }

  const getSortIdList = async (sortId, exclusiveStartId) => {
    return await getData(
      config.resourceServer.GetLuobuGameSortInfo,
      { sortId: sortId, exclusiveStartId: exclusiveStartId, sortOrderStr: "Asc" },
      authState.accessToken.value,
    );
  };

  const selectOnChange = async (value) => {
    setSortInfo([]);
    setSortId(value);
    await getSortInfo(value);
  };

  async function getAllGameSortInfo(sortId, beginId) {
    const response = await getSortIdList(sortId, beginId);
    const temBatchSortInfo =
      response &&
      response.data &&
      response.data.data &&
      response.data.data.curatedGameSortEntries;
    if ((!temBatchSortInfo) || temBatchSortInfo.length===0){
      return;
    }
    let gameIdsStr = temBatchSortInfo.map((info) => (info.universeId)).join();
    let gameInfoList = await getGameData(gameIdsStr);
    let merged = [];
    for (let i = 0; i < temBatchSortInfo.length; i++) {
      merged.push({
          ...(gameInfoList.data.data.find((itmInner) => itmInner.id === temBatchSortInfo[i].universeId)),
          ...temBatchSortInfo[i],
        },
      );
    }
    let indexedSortInfoList = merged.map((info) => ({
      ...info,
      key: info.universeId,
    }));
    if (indexedSortInfoList.length >= 100) {
      indexedSortInfoList = indexedSortInfoList
        // eslint-disable-next-line no-unused-vars
        .concat(await getAllGameSortInfo(sortId, indexedSortInfoList.slice(-1)[0].id));
    }
    return indexedSortInfoList;
  }

  const getSortInfo = async (sortId) => {
    const hide = message.loading("loading...", 0);
    sortInfo = await getAllGameSortInfo(sortId, 1);
    hide();
    if ((!sortInfo) || sortInfo.length===0){
      return;
    }
    const indexedSortInfoList = sortInfo.map((info) => ({
      ...info,
      key: info.universeId,
    }));
    setDisplayAddButton(true);
    setSortInfo(indexedSortInfoList);
  };

  const numberRegex = new RegExp(/^(\s*|\d+)$/);
  const handleGameIdInput = (e) => {
    if (!numberRegex.test(e.target.value)) {
      return;
    }
    setInputGameId(e.target.value);
  };

  const handleAddGameToSort = () => {
    if (!sortInfo.some((info) => info.universeId === addGameInfo.universeId)) {
      sortInfo = sortInfo.concat({
        ...addGameInfo,
        universeId: addGameInfo.id,
        key: addGameInfo.universeId,
      });
      setSortInfo(sortInfo);
      message.info(t("game add in to sort: ")+addGameInfo.id);
    }else{
      message.info(t("game already in the sort no need to add: ")+addGameInfo.id);
    }
    setAddGameInfo(null);
    setAddGameNameComment(null);
    setSearchGamePopVisible(false);
    setInputGameId(null);
  };

  const handleDelete = (key) => {
    sortInfo = sortInfo.filter((item) => item.key !== key);
    setSortInfo(sortInfo);
  };

  const handleCancelGameAdd = () => {
    setSearchGamePopVisible(false);
  };

  const onGameSearch = async () => {
    const hide = message.loading("loading...", 0);
    if (!inputGameId){
      return;
    }
    let gameInfo = await getGameData(inputGameId);
    hide();
    if (gameInfo && gameInfo.data
      && gameInfo.data.data
      && gameInfo.data.data[0]) {
      setAddGameNameComment(`GameId: ${gameInfo.data.data[0].id} GameName: ${gameInfo.data.data[0].name} Add game to this sort"`);
      setAddGameInfo({
        ...gameInfo.data.data[0],
        universeId:gameInfo.data.data[0].id,
        key:gameInfo.data.data[0].id
      });
    }
    setSearchGamePopVisible(true);
  };

  const updateGameSort = async ()=>{
    const hide = message.loading("");
    if (!sortInfo || sortInfo.length===0){
      return;
    }
    let gameIds=sortInfo.map(x=>x.universeId);
    const response= await postUpdateGameSort(sortId, gameIds);
    hide();
    if (response.status === 200 && response.data && response.data.data) {
      message.info("successes update the sort");
    }else{
      console.log(response.data);
    }
    return response;
  };

  return (
    <div className={styles.tableWrapper}>
      <Title level={4}>{t("Game Sort Dashboard")}</Title>
      <Card bordered={false}>
        <Row>
          <Col span={8}>
            <Group>
              <Select
                showSearch
                style={{ width: "50%" }}
                placeholder={t("Select a sort type")}
                optionFilterProp="label"
                size="large"
                onChange={selectOnChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={Array.from(config.resourceServer.LuobuGameSortIdList)}
              >
              </Select>
            </Group>

          </Col>
          <Col span={8} >
            <Group>
              <Input size="large"
                     style={{ width: 180 }}
                     disabled={!displayAddButton}
                     onChange={handleGameIdInput} />
              <Popconfirm
                title={addGameNameComment}
                visible={searchGamePopVisible}
                onConfirm={handleAddGameToSort}
                onCancel={handleCancelGameAdd}
              >
                <Button type="primary"
                        size="large"
                        disabled={!displayAddButton}
                        icon={<SearchOutlined />}
                        onClick={onGameSearch}
                >
                  {t("Add to Game Sort")}
                </Button>
              </Popconfirm>
            </Group>
          </Col>
          <Col span={8}>
            <Button type="primary"
                    size="large"
                    style={{float: "right"}}
                    disabled={!displayAddButton}
                    onClick={updateGameSort}
                    danger>
              {t("Upload Sort")}
            </Button>
          </Col>
        </Row>
      </Card>

      {sortInfo && (
          <Table
            className={styles.table}
            bordered
            columns={columns}
            dataSource={sortInfo}
            pagination={false}
          />
      )}

    </div>
  );
};

export default GameSortInfoDashBoard;
