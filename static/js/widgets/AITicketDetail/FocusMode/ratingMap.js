import React from "react";

let ratingMap = [
  {
    title: (
      <>
        0.无风险
        <svg className="icon" aria-hidden="true">
          <use href="#icon-circle"></use>
        </svg>
      </>
    ),
    value: "0",
  },
  {
    title: "1.时政相关",
    value: "1",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy3"></use>
            </svg>
            P0
          </>
        ),
        value: "1.0",
      },
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy2"></use>
            </svg>
            P1
          </>
        ),
        value: "1.1",
      },
    ],
  },
  {
    title: "2.淫秽色情",
    value: "2",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy3"></use>
            </svg>
            P0
          </>
        ),
        value: "2.0",
      },
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy4"></use>
            </svg>
            P2
          </>
        ),
        value: "2.2",
      },
    ],
  },
  {
    title: "3.宗教与种族",
    value: "3",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy2"></use>
            </svg>
            P1
          </>
        ),
        value: "3.1",
      },
    ],
  },
  {
    title: "4.违法犯罪",
    value: "4",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy3"></use>
            </svg>
            P0
          </>
        ),
        value: "4.0",
      },
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy2"></use>
            </svg>
            P1
          </>
        ),
        value: "4.1",
      },
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy4"></use>
            </svg>
            P2
          </>
        ),
        value: "4.2",
      },
    ],
  },
  {
    title: "5.血腥暴力",
    value: "5",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy4"></use>
            </svg>
            P2
          </>
        ),
        value: "5.2",
      },
    ],
  },
  {
    title: "6.恐怖与惊吓",
    value: "6",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy4"></use>
            </svg>
            P2
          </>
        ),
        value: "6.2",
      },
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy"></use>
            </svg>
            P3
          </>
        ),
        value: "6.3",
      },
    ],
  },
  {
    title: "7.赌博",
    value: "7",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy4"></use>
            </svg>
            P2
          </>
        ),
        value: "7.2",
      },
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy"></use>
            </svg>
            P3
          </>
        ),
        value: "7.3",
      },
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy1"></use>
            </svg>
            P4
          </>
        ),
        value: "7.4",
      },
    ],
  },
  {
    title: "8.文化与道德",
    value: "8",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy4"></use>
            </svg>
            P2
          </>
        ),
        value: "8.2",
      },
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy"></use>
            </svg>
            P3
          </>
        ),
        value: "8.3",
      },
    ],
  },
  {
    title: "9.侵权",
    value: "9",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy4"></use>
            </svg>
            P2
          </>
        ),
        value: "9.2",
      },
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy"></use>
            </svg>
            P3
          </>
        ),
        value: "9.3",
      },
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy1"></use>
            </svg>
            P4
          </>
        ),
        value: "9.4",
      },
    ],
  },
  {
    title: "10.社交媒体",
    value: "10",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy1"></use>
            </svg>
            P4
          </>
        ),
        value: "10.4",
      },
    ],
  },
  {
    title: "11.翻译",
    value: "11",
    disabled: true,
    children: [
      {
        title: (
          <>
            <svg className="icon" aria-hidden="true">
              <use href="#icon-circle-copy1"></use>
            </svg>
            P4
          </>
        ),
        value: "11.4",
      },
    ],
  },{
    title: (
      <>
        12.审核资源无法加载
      </>
    ),
    value: "12",
  }
];

export { ratingMap };
