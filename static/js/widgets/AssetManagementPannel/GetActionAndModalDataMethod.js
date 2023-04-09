const GetActionAndModalDataMethod = (t) => {
  if (!t) {
    return;
  }

  return [
    {
      action: "CreateTickets",
      modalTitle: t("Submit to moderate"),
      modalDescription: t(
        "If submit current asset to moderate, it will be added to whitelist after approval. Do you want to continue?"
      ),
    },
    {
      action: "Rejected",
      modalTitle: t("Reject Asset Update"),
      modalDescription: t(
        "If removing this asset from whitelist, no moderation requires. Do you want to continue?"
      ),
    },
    {
      action: "Approved",
      modalTitle: t("Approve Asset Update"),
      modalDescription: t(
        "If adding this asset into whitelist, no moderation requires. Do you want to continue?"
      ),
    },
  ];
};

export default GetActionAndModalDataMethod;
