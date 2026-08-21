// <数组&对象练习> 统计各运营商的用户信息
const input = [
  {
    name: "zhang3",
    tel: "13012341234",
  },
  {
    name: "li4",
    tel: "13112341234",
  },
  {
    name: "wang5",
    tel: "13212341234",
  },
  {
    name: "liul6",
    tel: "13312341234",
  },
  {
    name: "yu7",
    tel: "13912341234",
  },
  {
    name: "zhao8",
    tel: "18612341234",
  },
  {
    name: "sun9",
    tel: "18812341234",
  },
];

// 运营商信息
const operators = [
  {
    name: "移动",
    prefixes: ["134", "135", "136", "137", "138", "139", "187", "188"],
  },
  {
    name: "联通",
    prefixes: ["130", "131", "132", "185", "186"],
  },
  {
    name: "电信",
    prefixes: ["133", "180", "181", "189"],
  },
];

const output = [
  {
    name: "移动",
    prefixes: ["134", "135", "136", "137", "138", "139", "187", "188"],
    users: [
      { name: "yu7", tel: "13912341234" },
      { name: "sun9", tel: "18812341234" },
    ],
  },
  {
    name: "联通",
    prefixes: ["130", "131", "132", "185", "186"],
    users: [
      { name: "zhang3", tel: "13012341234" },
      { name: "li4", tel: "13112341234" },
      { name: "wang5", tel: "13212341234" },
      { name: "zhao8", tel: "18612341234" },
    ],
  },
  {
    name: "电信",
    prefixes: ["133", "180", "181", "189"],
    users: [{ name: "liul6", tel: "13312341234" }],
  },
];
// console.log(output);

function getResult(input, operators) {
  return operators.map((o) => ({
    ...o,
    users: input.filter((item) =>
      o.prefixes.includes(item.tel.substring(0, 3))
    ),
  }));
}

console.log(getResult(input, operators));
