const GetAssetIdentificationMethods = (t) => {
  if (!t) {
    return;
  }

  return [
    {
      value: "1",
      type: "Asset",
      name: t("Asset ID"),
      placeholder: t("Enter Asset ID"),
    },
    {
      value: "2",
      type: "Bundle",
      name: t("Bundle ID"),
      placeholder: t("Enter Bundle ID"),
    }
  ];
};

export default GetAssetIdentificationMethods;
