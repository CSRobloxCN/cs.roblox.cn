import React from "react";
import config from "config";
import { useTranslation } from "react-i18next";
import { Table, Button, PageHeader, Divider, Typography, message } from "antd";
import { CSVLink } from "react-csv";
import { postData } from "helpers/httpRequest";
import { useOktaAuth } from "@okta/okta-react";
import { blockLoading } from "helpers/promiseWithBlocking";

const { Text } = Typography;
const resourceServer = config.resourceServer;

const MIN_DATE_STRING = "0001-01-01T00:00:00";

const AssetsAllowlistLogTable = ({
  logs,
  total,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const { authState } = useOktaAuth();
  const { t } = useTranslation();

  const nullComponent = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Text>/</Text>
    </div>
  );

  const headers = [
    { label: t("Asset ID"), key: "assetId" },
    { label: t("Submitted Time"), key: "submittedUtc" }, //get from UiService
    {
      label: t("WhitelistUpdateResult(nonticket action)"),
      key: "updateWhitelistStatus",
    },
    // Below are information of Ticket related
    { label: t("ModeratorTicketActionType"), key: "moderatorActionType" },
    { label: t("ticektId"), key: "ticketId" },
    { label: t("Action Date"), key: "actionUtc" },
    { label: t("Comment"), key: "ticketComment" },
    { label: t("Moderator Email"), key: "moderatorEmail" },
  ];

  const getCsvReport = (row) => {
    if (row == null) return;
    let csvReport = {
      filename: "AssetUpdateHistory.csv",
      headers: headers,
      data: getExportData(row),
    };
    return csvReport;
  };

  const getExportData = (log) => {
    if (log == null) return null;
    let exportDataList = log.exportDataList;
    if (exportDataList == null || exportDataList.length == 0) return null;
    const exportDataResult = [];
    exportDataList.map((exportData) => {
      exportDataResult.push({
        assetId: exportData.assetId ? exportData.assetId : null,
        moderatorActionType: exportData.moderatorActionType
          ? exportData.moderatorActionType
          : null,
        updateWhitelistStatus: exportData.updateWhitelistStatus
          ? exportData.updateWhitelistStatus
          : null,
        actionUtc:
          exportData.actionUtc && exportData.actionUtc != MIN_DATE_STRING
            ? exportData.actionUtc
            : null,
        submittedUtc: log.createdUtc ? log.createdUtc : null,
        ticketId: exportData.ticketId ? exportData.ticketId : null,
        ticketComment: exportData.moderatorComment
          ? exportData.moderatorComment
          : null,
        moderatorEmail: exportData.moderatorEmail
          ? exportData.moderatorEmail
          : null,
      });
    });
    return exportDataResult;
  };

  const buildCenterComponents = (first, second, third) => {
    return (
      <div>
        {first && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {first}
          </div>
        )}
        {second && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {second}
          </div>
        )}
        {third && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {third}
          </div>
        )}
      </div>
    );
  };
  var columns = [
    {
      title: "首次提交时间",
      key: "createdUtc",
      dataIndex: "createdUtc",
      width: "10%",
      render: function getDateTimeString(createdUtc) {
        return buildCenterComponents(
          <Text>{new Date(createdUtc).toLocaleDateString()}</Text>,
          <Text>{new Date(createdUtc).toLocaleTimeString()}</Text>
        );
      },
    },
    {
      title: "提交数量",
      key: "submittedCount",
      dataIndex: "submittedCount",
      width: "10%",
      render: function submittedCountColumn(submittedCount, record) {
        return buildCenterComponents(
          <Text>{t(record.action)}</Text>,
          <Text>{submittedCount + " x " + t(record.assetType)}</Text>
        );
      },
    },
    {
      title: "操作员",
      key: "operator",
      dataIndex: "operatorEmail",
      width: "10%",
      render: function OperatorResult(operatorEmail) {
        return operatorEmail ? operatorEmail : nullComponent;
      },
    },
    {
      title: "备注",
      key: "comment",
      dataIndex: "comment",
      width: "10%",
      render: (text) => t(text),
    },
    {
      title: "生成工单结果",
      key: "createTicketResult",
      dataIndex: ["createdTicketCount"],
      width: "10%",
      render: function createTicketResult(createdTicketCount, record) {
        let failureTicketCount = record.totalTicketsCount - createdTicketCount;
        return createdTicketCount
          ? buildCenterComponents(
              <Text>{t("success") + ": " + createdTicketCount}</Text>,
              <Text type={failureTicketCount != 0 ? "danger" : "default"}>
                {t("failure") + ": " + failureTicketCount}
              </Text>
            )
          : nullComponent;
      },
    },
    {
      title: "工单审核结果",
      key: "ticketModerateCount",
      dataIndex: "totalTicketsCount",
      width: "10%",
      render: function ticketModerateResult(totalTicketsCount, record) {
        return totalTicketsCount
          ? buildCenterComponents(
              <Text>{t("pass") + ": " + record.successTicketCount}</Text>,
              <Text>{t("negative") + ": " + record.rejectTicketCount}</Text>,
              <Text>
                {t("Ignore Asset Update") + ": " + record.ignoreTicketCount}
              </Text>
            )
          : nullComponent;
      },
    },
    {
      title: "白名单处理结果",
      key: "updateSuccessCount",
      dataIndex: "updateSuccessCount",
      width: "10%",
      render: function whitelistUpdateResult(updateSuccessCount, record) {
        //only show this column if action is "Approved" or "Rejected"
        return record.action !== "CreateTickets" && updateSuccessCount >= 0
          ? buildCenterComponents(
              <Text>{t("success") + ": " + updateSuccessCount}</Text>,
              <div>
                <Text
                  type={record.updateFailureCount > 0 ? "danger" : "default"}
                >
                  {t("failure") + ": " + record.updateFailureCount}
                </Text>
                <Button
                  disabled={shouldDisabled(record)}
                  type="link"
                  onClick={() => doSubmit(record)}
                >
                  {t("resubmit")}
                </Button>
              </div>
            )
          : nullComponent;
      },
    },
    {
      title: t("Export Result"),
      key: "Export Result",
      dataIndex: "outputResult",
      width: "10%",
      // eslint-disable-next-line react/display-name
      render: (key, row) => {
        let csvReport = getCsvReport(row);
        return (
          csvReport.data &&
          buildCenterComponents(
            <Button size="small">
              <CSVLink {...csvReport}>{t("Export Result")}</CSVLink>
            </Button>
          )
        );
      },
    },
  ];

  const shouldDisabled = (record) => {
    let failActions = record.exportDataList.filter(
      (item) => item.updateWhitelistStatus === "Fail"
    );
    return failActions.length == 0;
  };

  const submitRequest = async (record) => {
    //ids, type, policyLabel, action
    const accessToken = authState.accessToken.value;
    let postObject = {};
    postObject.Type = record.assetType;
    postObject.PolicyLabel = record.policyLabel; //"ChinaWhitelist";
    postObject.Action = record.action;
    postObject.Ids = record.exportDataList
      .filter((item) => item.updateWhitelistStatus == "Fail")
      .map((item) => item.assetId);
    if (
      postObject.Type == "" ||
      postObject.PolicyLabel == "" ||
      postObject.Comment == "" ||
      postObject.Action == "" ||
      postObject.Ids.length == 0
    ) {
      message.warn(t("Cannot resubmit with invalid request"));
      return;
    }

    let url = resourceServer["AssetsAllowlist"];
    var response = await postData(url, postObject, accessToken);

    if (response.status !== 200 || (response.data && response.data.error)) {
      message.error(
        t("Handle Asset Status failed") +
          ": " +
          t(response.data.error.description)
      );
      return;
    }

    message.info(
      t("Successfully Update Asset Status") +
        ": " +
        response.data.data.updateStatusSuccessCount +
        "/" +
        response.data.data.total
    );
  };
  let doSubmit = (record) => blockLoading(submitRequest(record), t);

  return (
    <>
      <PageHeader title={"提交记录"}></PageHeader>
      <Divider />
      <Table
        key="AssetsAllowlistLogTable"
        dataSource={logs}
        columns={columns}
        size="small"
        pagination={{
          total: total,
          current: currentPage,
          position: ["bottomRight"],
          pageSize: pageSize,
          onChange: onPageChange,
          hideOnSinglePage: true,
          showSizeChanger: false,
        }}
        scroll={{ y: 700 }}
      />
    </>
  );
};

export default AssetsAllowlistLogTable;
