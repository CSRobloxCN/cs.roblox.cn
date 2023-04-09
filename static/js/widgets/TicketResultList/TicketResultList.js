import React from "react";
import { useTranslation } from "react-i18next";
// import useTranslation from "hooks/useTranslation";
import { List, Comment, Descriptions } from "antd";
import moment from "moment";

const TicketResultList = ({ results }) => {
  const { t } = useTranslation();
  results = uniqBy(results, JSON.stringify);
  return (
    <>
      <Descriptions bordered title={t("Ticket Result List")} size="small" />
      <List
        bordered
        dataSource={results}
        renderItem={(item) => {
          return (
            <List.Item>
              <Comment
                author={`${t("Moderator ID")}: ${item.moderatorId}, ${t(
                  "Action Type"
                )}: ${t(item.actionType)}`}
                content={<p>{item.comment}</p>}
                datetime={moment.utc(item.createdUtc).toDate().toLocaleString()}
              />
            </List.Item>
          );
        }}
      />
    </>
  );
};
function uniqBy(a, key) {
  var seen = {};
  return a.filter(function (item) {
    var k = key(item);
    return seen[k] ? false : (seen[k] = true);
  });
}
export default TicketResultList;
