import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOktaAuth } from "@okta/okta-react";
import config from "config";
import { blockLoading } from "helpers/promiseWithBlocking";

import { Form, Row, Col, Button, Input, PageHeader, Typography } from "antd";
import axios from "axios";

const resourceServer = config.resourceServer;

const GameAllowlistRequest = () => {
  const { authState } = useOktaAuth();

  const { t } = useTranslation();

  let [gameIds, setIds] = useState("");
  let [gameData, setGameData] = useState([]);
  let ids = gameIds.split(/[,|\n|\s]/).filter((item) => item);
  let query = async () => {
    let data = [];
    for (let i = 0; i < ids.length; i++) {
      let places = await getPlacesUnderGame(
        ids[i],
        authState.accessToken.value
      );
      let gameInfo = await getGameData(ids[i]);
      let gameData = {
        gameId: ids[i],
        places,
        gameInfo,
      };
      data.push(gameData);
      for (let j = 0; j < places.length; j++) {
        let response = await axios({
          method: "GET",
          url: resourceServer.GetPlaceVersionPolicyLabels,
          params: {
            placeId: places[j].id,
            policyLabel: "ChinaWhitelist",
            status: "Approved",
            pageSize: 10,
          },
          headers: {
            Authorization: `Bearer ${authState.accessToken.value}`,
          },
        });
        if (response.status == 200 && response.data && response.data.data) {
          places[j].approvedVersionNumbers =
            response.data.data.body.versionNumbers;
        }
      }
      setGameData(data.map((v) => v));
    }
  };
  let doQurey = () => blockLoading(query(), t);

  return (
    <div style={{ padding: 24 }}>
      <Form layout="inline">
        <PageHeader title={t("MASS QUERY PLACE VERSION DATA")}></PageHeader>

        <Row style={{ width: "100%" }}>
          <Col span={20} style={{ marginBottom: 12, marginTop: 24 }}>
            <Form.Item label={t("Universe IDs")} name="ids" required>
              <Input.TextArea
                rows={10}
                onChange={(e) => setIds(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ width: "100%" }}>
          {t("Note Please enter IDs separated by spaces, commas, or new lines")}
        </Row>

        <Row style={{ width: "100%" }}>
          <Button
            style={{ marginTop: 12, marginRight: 20 }}
            type="primary"
            htmlType="submit"
            onClick={doQurey}
          >
            {t("Query")}
          </Button>
        </Row>
      </Form>
      <div>
        {gameData.map((game) => {
          return (
            <div
              key={game.gameId}
              style={{
                marginTop: 24,
                padding: 12,
                backgroundColor: "#fff",
                fontSize: 12,
                lineHeight:"2"
              }}
            >
              <div>
                <InfoSpan name={t("Game Name")} value={game.gameInfo?.name} />
                <InfoSpan name={t("Game ID")} value={game.gameId} />
              </div>
              {game.places &&
                game.places.map((place) => {
                  return (
                    <div key={place.id}>
                      <InfoSpan name={t("placeId")} value={place.id} />
                      <InfoSpan name={t("Place Name")} value={place.name} />
                      <InfoSpan
                        name={t("Latest Published Version")}
                        value={place.versionNumber}
                      />
                      <InfoSpan
                        name={t("Approved Versions")}
                        value={place.approvedVersionNumbers.map((n) => {
                          return (
                            <span key={n}>
                              <Typography.Text code>{n}</Typography.Text>,
                            </span>
                          );
                        })}
                      />
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
function getPlacesUnderGame(gameId, accessToken) {
  return axios({
    method: "get",
    url: config.resourceServer.GetPlacesUnderGameId,
    params: {
      gameId,
    },
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((res) => {
    if (res.status == 200 && res.data && res.data.data) {
      return res.data.data;
    }
  });
}
function getGameData(gameId) {
  return axios
    .get(config.resourceServer.GetRobloxGameInfoWithGameID + gameId)
    .then((res) => {
      if (res.status == 200) {
        return res.data.data[0];
      }
    });
}
function InfoSpan({ name, value }) {
  return (
    <>
      <span style={{ color: "#8C8C8C" }}>{name}: </span>
      <span style={{ marginRight: 16 }}>{value}</span>
    </>
  );
}
export default GameAllowlistRequest;
