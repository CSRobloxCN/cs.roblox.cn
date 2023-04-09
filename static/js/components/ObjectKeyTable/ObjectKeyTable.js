import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "antd";

const ObjectKeyTable = ({ data,hideHeader }) => {
  const { t } = useTranslation();
  let columns = [];
  Object.keys(data).forEach((key) => {
    columns.push({
      title: t(key),
      key,
      dataIndex: key,
    });
  });
  return (
    <Table
      dataSource={[data]}
      rowKey={Object.keys(data)[0]}
      columns={columns}
      pagination={false}
      bordered
      showHeader={!hideHeader}
    />
  );
};
export default ObjectKeyTable;
