const GetAssetTypesTreeData = (t) => {
  if (!t) {
    return;
  }

  return [
    {
      title: t("Toolbox Asset"),
      value: "ToolboxAsset",
      disabled: true,
      children: [
        {
          title: t("Image"),
          value: "Image",
        },
        {
          title: t("Audio"),
          value: "Audio",
        },
        {
          title: t("Mesh"),
          value: "Mesh",
          children: [
            {
              title: t("MeshPart"),
              value: "MeshPart",
            },
          ],
        },
        {
          title: t("Model"),
          value: "Model",
        },
        {
          title: t("Decal"),
          value: "Decal",
        },
        {
          title: t("Plugin"),
          value: "Video",
        },
      ],
    },
    {
      title: t("Bundle"),
      value: "Bundle",
    },
    {
      title: t("Avatar"),
      value: "Avatar",
      children: [
        {
          title: t("Package"),
          value: "Package",
        },
        {
          title: t("Animation"),
          value: "Animation",
          children: [
            {
              title: t("Climb Animation"),
              value: "ClimbAnimation",
            },
            {
              title: t("Death Animation"),
              value: "DeathAnimation",
            },
            {
              title: t("Fall Animation"),
              value: "FallAnimation",
            },
            {
              title: t("Idle Animation"),
              value: "IdleAnimation",
            },
            {
              title: t("Jump Animation"),
              value: "JumpAnimation",
            },
            {
              title: t("Run Animation"),
              value: "RunAnimation",
            },
            {
              title: t("Swim Animation"),
              value: "SwimAnimation",
            },
            {
              title: t("Walk Animation"),
              value: "WalkAnimation",
            },
            {
              title: t("Pose Animation"),
              value: "PoseAnimation",
            },
            {
              title: t("Emote Animation"),
              value: "EmoteAnimation",
            },
          ],
        },
        {
          title: t("Clothing"),
          value: "Clothing",
          disabled: true,
          children: [
            {
              title: t("T-Shirt"),
              value: "TShirt",
            },
            {
              title: t("Shirt"),
              value: "Shirt",
            },
            {
              title: t("Pants"),
              value: "Pants",
            },
          ],
        },
        {
          title: t("Body parts"),
          value: "Body parts",
          disabled: true,
          children: [
            {
              title: t("Head"),
              value: "Head",
            },
            {
              title: t("Face"),
              value: "Face",
            },
            {
              title: t("Arms"),
              value: "Arms",
              children: [
                {
                  title: t("Left Arm"),
                  value: "LeftArm",
                },
                {
                  title: t("Right Arm"),
                  value: "RightArm",
                },
              ],
            },
            {
              title: t("Legs"),
              value: "Legs",
              children: [
                {
                  title: t("Left Leg"),
                  value: "LeftLeg",
                },
                {
                  title: t("Right Leg"),
                  value: "RightLeg",
                },
              ],
            },
            {
              title: t("Torso"),
              value: "Torso",
            },
          ],
        },
        {
          title: t("Accessory"),
          value: "Accessory",
          disabled: true,
          children: [
            {
              title: t("Hat"),
              value: "Hat",
            },
            {
              title: t("Gear"),
              value: "Gear",
            },
            {
              title: t("Hair Accessory"),
              value: "HairAccessory",
            },
            {
              title: t("Face Accessory"),
              value: "FaceAccessory",
            },
            {
              title: t("Neck Accessory"),
              value: "NeckAccessory",
            },
            {
              title: t("Shoulder Accessory"),
              value: "ShoulderAccessory",
            },
            {
              title: t("Front Accessory"),
              value: "FrontAccessory",
            },
            {
              title: t("Back Accessory"),
              value: "BackAccessory",
            },
            {
              title: t("Waist Accessory"),
              value: "WaistAccessory",
            },
            {
              title: t("T-Shirt Accessory"),
              value: "TShirtAccessory",
            },
            {
              title: t("Shirt Accessory"),
              value: "ShirtAccessory",
            },
            {
              title: t("Pants Accessory"),
              value: "PantsAccessory",
            },
            {
              title: t("Jacket Accessory"),
              value: "JacketAccessory",
            },
            {
              title: t("Sweater Accessory"),
              value: "SweaterAccessory",
            },
            {
              title: t("Shorts Accessory"),
              value: "ShortsAccessory",
            },
            {
              title: t("Left Shoe Accessory"),
              value: "LeftShoeAccessory",
            },
            {
              title: t("Right Shoe Accessory"),
              value: "RightShoeAccessory",
            },
            {
              title: t("Dress Skirt Accessory"),
              value: "DressSkirtAccessory",
            },
          ],
        },
      ],
    },
  ];
};

export default GetAssetTypesTreeData;
