import { Tooltip } from "antd";

const GetGameSortCols = (t) => {
  if (!t) {
    return [];
  }
  return [
    {
      title: t("gameId"),
      dataIndex: "universeId",
      key:"universeId"
    },
    {
      title: t("name"),
      dataIndex: "name",
      key:"name"
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      // eslint-disable-next-line react/display-name
      render: description => (
        // eslint-disable-next-line react/react-in-jsx-scope
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
  ];
};

export default GetGameSortCols;
