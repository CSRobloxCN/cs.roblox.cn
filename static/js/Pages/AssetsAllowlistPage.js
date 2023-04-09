import React, { useEffect, useState } from "react";
import config from "config";
import { getData } from "helpers/httpRequest";
import { useOktaAuth } from "@okta/okta-react";

import { Card, message } from "antd";
import { AssetsAllowlistRequest } from "widgets/AssetsAllowlistRequest";

import { AssetsAllowlistLogTable } from "widgets/AssetsAllowlistLogTable";

const resourceServer = config.resourceServer;

const pageSize = 10;

const AssetsAllowlistPage = () => {
  const { authState } = useOktaAuth();
  const [logs, setLogs] = useState([]);
  let [total, setTotal] = useState(0);
  let [page, setPage] = useState(1);

  const refresh = async () => {
    const accessToken = authState.accessToken.value;
    let url = resourceServer["AllowlistUpdateHistory"];

    let queryData = { pageNum: page, pageSize: pageSize };
    let res = await getData(url, queryData, accessToken);
    if (res.status == 200) {
      if (res.data.error) {
        message.error(res.data.error.description);
        return;
      }
      setLogs(res.data.data.items);
      setTotal(res.data.data.total);
    } else {
      message.error("Request Failed");
    }
  };

  let onPageChange = async (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    refresh();
  }, [page]);

  return (
    <div style={{padding:24}}>
      <Card>
        <AssetsAllowlistRequest refresh={refresh} />
      </Card>
      <Card>
        <AssetsAllowlistLogTable
          logs={logs}
          total={total}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={onPageChange}
        />
      </Card>
    </div>
  );
};

export default AssetsAllowlistPage;
