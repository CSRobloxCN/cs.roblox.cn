import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";

const ObjectsKeyTable = ({ datas, pagination }) => {
  console.log(datas);
  if (!datas || !datas.length) return null;
  const { t } = useTranslation();
  let columns = [];
  Object.keys(datas[0]).forEach((key) => {
    columns.push({
      title: t(key),
      key,
      dataIndex: key,
    });
  });
  return (
    <Table
      dataSource={datas}
      rowKey={Object.keys(datas[0])[0]}
      columns={columns}
      pagination={pagination}
      bordered
      tableLayout="fixed"
    />
  );
};
export default ObjectsKeyTable;
