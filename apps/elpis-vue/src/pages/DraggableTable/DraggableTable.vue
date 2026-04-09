<script setup>
import {
  h,
  ref,
  reactive
} from 'vue';
import XEUtils from 'xe-utils';
import { Checkbox } from 'ant-design-vue';
import {
  PieChartOutlined,
  MailOutlined,
  YoutubeOutlined
} from '@ant-design/icons-vue';

const gridRef = ref();

// 格式化金额
const formatAmount = ({
  cellValue
}) => {
  if (cellValue) {
    return `￥${XEUtils.commafy(cellValue, { digits: 2 })}`;
  }
  return '';
};

// 合并大类单元格
function spanMethod({
  row,
  $rowIndex,
  column,
  data
}) {
  if (
    column.property ===
    'bigClass'
  ) {
    const prevRow =
      data[$rowIndex - 1];
    let nextRow =
      data[$rowIndex + 1];

    if (
      prevRow &&
      prevRow.bigClass ===
        row.bigClass
    ) {
      return {
        rowspan: 0,
        colspan: 0
      };
    } else {
      let countRowspan = 1;
      while (
        nextRow &&
        nextRow.bigClass ===
          row.bigClass
      ) {
        countRowspan++;
        nextRow =
          data[
            $rowIndex +
              countRowspan
          ];
      }
      if (countRowspan > 1) {
        return {
          rowspan:
            countRowspan,
          colspan: 1
        };
      }
    }
  }
}

// 表格数据
const gridOptions = reactive({
  columns: [],
  data: [],
  'span-method': spanMethod,
  border: true,
  loading: false,
  height: '100%'
  // columns: [
  //   {
  //     title: '区域',
  //     align: 'center',
  //     field: 'area',
  //     children: [
  //       { field: 'bigClass', title: '大类', align: 'center',  },
  //       { field: 'mediumClass', title: '中类', align: 'center',  },
  //     ]
  //   },
  //   {
  //     title: '华南',
  //     align: 'center',
  //     field: 'huanan',
  //     children: [
  //       { field: 'huanan.salesVolume', title: '销售单数', align: 'center',  width: 100, },
  //       { field: 'huanan.totalSales', title: '总销售额', align: 'center',  width: 100, formatter: formatAmount },
  //       { field: 'huanan.refundAmount', title: '退款金额', align: 'center', width: 100, formatter: formatAmount },
  //       { field: 'huanan.associatedPurchaseRate', title: '连带率', align: 'center',  width: 100,  },
  //     ]
  //   },
  //   {
  //     title: '华东',
  //     align: 'center',
  //     field: 'huadong',
  //     children: [
  //       { field: 'huadong.salesVolume', title: '销售单数', align: 'center',  width: 100,  },
  //       { field: 'huadong.totalSales', title: '总销售额', align: 'center',  width: 100, formatter: formatAmount },
  //       { field: 'huadong.refundAmount', title: '退款金额', align: 'center', width: 100, formatter: formatAmount },
  //       { field: 'huadong.associatedPurchaseRate', title: '连带率', align: 'center',  width: 100,  },
  //     ]
  //   },
  //   {
  //     title: '华北',
  //     align: 'center',
  //     field: 'huabei',
  //     children: [
  //       { field: 'huabei.salesVolume', title: '销售单数', align: 'center',  width: 100,  },
  //       { field: 'huabei.totalSales', title: '总销售额', align: 'center',  width: 100, formatter: formatAmount },
  //       { field: 'huabei.refundAmount', title: '退款金额', align: 'center', width: 100, formatter: formatAmount },
  //       { field: 'huabei.associatedPurchaseRate', title: '连带率', align: 'center',  width: 100,  },
  //     ]
  //   }
  // ],
});

async function init() {
  setTimeout(async () => {
    //   gridOptions.columns =  [
    //   {
    //     title: '区域',
    //     align: 'center',
    //     field: 'area',
    //     children: [
    //       { field: 'bigClass', title: '大类', align: 'center',  },
    //       { field: 'mediumClass', title: '中类', align: 'center',  },
    //     ]
    //   },
    //   {
    //     title: '华南',
    //     align: 'center',
    //     field: 'huanan',
    //     children: [
    //       { field: 'huanan.salesVolume', title: '销售单数', align: 'center',  width: 100, },
    //       { field: 'huanan.totalSales', title: '总销售额', align: 'center',  width: 100, formatter: formatAmount },
    //       { field: 'huanan.refundAmount', title: '退款金额', align: 'center', width: 100, formatter: formatAmount },
    //       { field: 'huanan.associatedPurchaseRate', title: '连带率', align: 'center',  width: 100,  },
    //     ]
    //   },
    //   {
    //     title: '华东',
    //     align: 'center',
    //     field: 'huadong',
    //     children: [
    //       { field: 'huadong.salesVolume', title: '销售单数', align: 'center',  width: 100,  },
    //       { field: 'huadong.totalSales', title: '总销售额', align: 'center',  width: 100, formatter: formatAmount },
    //       { field: 'huadong.refundAmount', title: '退款金额', align: 'center', width: 100, formatter: formatAmount },
    //       { field: 'huadong.associatedPurchaseRate', title: '连带率', align: 'center',  width: 100,  },
    //     ]
    //   },
    //   {
    //     title: '华北',
    //     align: 'center',
    //     field: 'huabei',
    //     children: [
    //       { field: 'huabei.salesVolume', title: '销售单数', align: 'center',  width: 100,  },
    //       { field: 'huabei.totalSales', title: '总销售额', align: 'center',  width: 100, formatter: formatAmount },
    //       { field: 'huabei.refundAmount', title: '退款金额', align: 'center', width: 100, formatter: formatAmount },
    //       { field: 'huabei.associatedPurchaseRate', title: '连带率', align: 'center',  width: 100,  },
    //     ]
    //   }
    // ]

    gridOptions.data =
      handleGoodsList(
        await getGoodsList()
      );
  }, 1000);
}

init();

const selectedKeys = ref([]);
const openKeys = ref([]);
const checked = ref(false);
function onUpdateChecked(e) {
  checked.value = e;
}

const checked1 = ref(false);
function onUpdateChecked1(e) {
  checked1.value = e;
}

const checked2 = ref(true);
function onUpdateChecked2(e) {
  checked2.value = e;
}

// 左侧菜单
const menus = ref([
  {
    icon: null,
    key: 'grp',
    label: '维度',
    type: 'group',
    children: [
      {
        children: undefined,
        icon: () =>
          h(YoutubeOutlined),
        key: 'area',
        label: '区域',
        type: undefined,
        draggable: 'true',
        'data-id': 'area',
        _children: [
          {
            key: 'huanan',
            label: '华南'
          },
          {
            key: 'huabei',
            label: '华北'
          },
          {
            key: 'huadong',
            label: '华东'
          }
        ]
      },
      {
        children: undefined,
        icon: () =>
          h(PieChartOutlined),
        key: '13',
        label: '门店',
        type: undefined,
        _children: [],
        disabled: true
      },
      {
        children: undefined,
        icon: () =>
          h(MailOutlined),
        key: '商品',
        label: '商品',
        type: undefined,
        _children: [],
        disabled: true
      },
      {
        children: undefined,
        icon: () => h('div'),
        key: '商品品牌',
        label: '商品品牌',
        type: undefined,
        _children: [],
        disabled: true
      },
      {
        children: undefined,
        icon: () => h('div'),
        key: 'bigClass',
        label: '大类',
        type: undefined,
        draggable: 'true',
        'data-id': 'bigClass',
        _children: [
          {
            key: 'xiezi',
            label: '鞋子'
          },
          {
            key: 'maozi',
            label: '帽子'
          },
          {
            key: 'chenyi',
            label: '衬衣'
          }
        ]
      },
      {
        children: undefined,
        icon: () => h('div'),
        key: 'mediumClass',
        label: '中类',
        type: undefined,
        draggable: 'true',
        'data-id':
          'mediumClass',
        _children: [
          {
            key: 'gaogenxie',
            label: '高跟鞋',
            parent: 'xiezi'
          },
          {
            key: 'xiuxianxie',
            label: '休闲鞋',
            parent: 'xiezi'
          },
          {
            key: 'pingdixie',
            label: '平底鞋',
            parent: 'xiezi'
          },

          {
            key: 'shougongmao',
            label: '手工帽',
            parent: 'maozi'
          },
          {
            key: 'damao',
            label: '大帽',
            parent: 'maozi'
          },

          {
            key: 'xiuxianchenyi',
            label: '休闲衬衣',
            parent: 'chenyi'
          },
          {
            key: 'shagnwuchenyi',
            label: '商务衬衣',
            parent: 'chenyi'
          },
          {
            key: 'baidachenyi',
            label: '百搭衬衣',
            parent: 'chenyi'
          }
        ]
      },
      {
        children: undefined,
        icon: () => h('div'),
        key: '商品分组',
        label: '商品分组',
        type: undefined,
        _children: [],
        disabled: true
      }
    ]
  },
  {
    icon: null,
    key: 'grp',
    label: '度量(表头字段)',
    type: 'group',
    children: [
      {
        children: undefined,
        icon: () =>
          h(Checkbox, {
            checked: checked,
            'onUpdate:checked':
              onUpdateChecked
          }),
        key: '基本信息',
        label: '基本信息',
        type: undefined,
        disabled: true
      },
      {
        children: undefined,
        icon: () =>
          h(Checkbox, {
            checked: checked2,
            'onUpdate:checked':
              onUpdateChecked2
          }),
        key: '消费信息',
        label: '消费信息',
        type: undefined,
        disabled: true
      },
      {
        children: undefined,
        icon: () =>
          h(Checkbox, {
            checked: checked1,
            'onUpdate:checked':
              onUpdateChecked1
          }),
        key: '销售信息',
        label: '销售信息',
        type: undefined,
        disabled: true
      },
      {
        children: undefined,
        icon: () => h('div'),
        key: 'salesVolume',
        label: '销售单数',
        type: undefined,
        draggable: 'true',
        'data-id':
          'salesVolume'
      },
      {
        children: undefined,
        icon: () => h('div'),
        key: 'totalSales',
        label: '总销售额',
        type: undefined,
        draggable: 'true',
        'data-id':
          'totalSales'
      },
      {
        children: undefined,
        icon: () => h('div'),
        key: 'refundAmount',
        label: '退款金额',
        type: undefined,
        draggable: 'true',
        'data-id':
          'refundAmount'
      },
      {
        children: undefined,
        icon: () => h('div'),
        key: 'associatedPurchaseRate',
        label: '连带率',
        type: undefined,
        draggable: 'true',
        'data-id':
          'associatedPurchaseRate'
      },
      {
        children: undefined,
        icon: () => h('div'),
        key: '总体折扣',
        label: '总体折扣',
        type: undefined,
        disabled: true
      },
      {
        children: undefined,
        icon: () => h('div'),
        key: '优惠券核销金额',
        label:
          '优惠券核销金额',
        type: undefined,
        disabled: true
      }
    ]
  }
]);

// 记录拖动的元素
let drag = '';
function handleDragStart(e) {
  drag = e.target.dataset.id;
}

// 行维度数组
const rowList = ref([]);
// 列维度数组
const colList = ref([]);
// 表头
const headerList = ref([]);

function updateSelectStyle() {
  selectedKeys.value = [
    ...rowList.value.map(
      item => item.key
    ),
    ...colList.value.map(
      item => item.key
    ),
    ...headerList.value.map(
      item => item.key
    )
  ];
}

// 移出行维度
function handleCloseRow(
  item
) {
  rowList.value =
    rowList.value.filter(
      it =>
        it['data-id'] !==
        item['data-id']
    );

  updateSelectStyle();
  handleData();
}
// 移出列维度
function handleCloseCol(
  item
) {
  colList.value =
    colList.value.filter(
      it =>
        it['data-id'] !==
        item['data-id']
    );
  updateSelectStyle();
  handleData();
}
// 移出表头
function handleCloseHeader(
  item
) {
  headerList.value =
    headerList.value.filter(
      it =>
        it['data-id'] !==
        item['data-id']
    );
  updateSelectStyle();
  handleData();
}

// 添加到行维度
function handleRowDrop() {
  if (
    drag === 'bigClass' &&
    rowList.value.every(
      item =>
        item['data-id'] !==
        'bigClass'
    )
  ) {
    const result = menus.value
      .map(item => [
        ...item.children
      ])
      .flat(Infinity)
      .find(
        item =>
          item['data-id'] ===
          'bigClass'
      );
    rowList.value.push(
      result
    );
  } else if (
    drag === 'mediumClass' &&
    rowList.value.every(
      item =>
        item['data-id'] !==
        'mediumClass'
    )
  ) {
    const result = menus.value
      .map(item => [
        ...item.children
      ])
      .flat(Infinity)
      .find(
        item =>
          item['data-id'] ===
          'mediumClass'
      );
    rowList.value.push(
      result
    );
  }
  updateSelectStyle();
  handleData();
}
// 添加到列维度
function handleColDrop() {
  if (
    drag === 'area' &&
    colList.value.every(
      item =>
        item['data-id'] !==
        'area'
    )
  ) {
    const result = menus.value
      .map(item => [
        ...item.children
      ])
      .flat(Infinity)
      .find(
        item =>
          item['data-id'] ===
          'area'
      );
    colList.value.push(
      result
    );
  }
  updateSelectStyle();
  handleData();
}
// 添加到表头
function handleHeaderDrop() {
  //
  if (
    drag === 'salesVolume' &&
    headerList.value.every(
      item =>
        item['data-id'] !==
        'salesVolume'
    )
  ) {
    const result = menus.value
      .map(item => [
        ...item.children
      ])
      .flat(Infinity)
      .find(
        item =>
          item['data-id'] ===
          'salesVolume'
      );
    headerList.value.push(
      result
    );
  }
  // 总销售额
  else if (
    drag === 'totalSales' &&
    headerList.value.every(
      item =>
        item['data-id'] !==
        'totalSales'
    )
  ) {
    const result = menus.value
      .map(item => [
        ...item.children
      ])
      .flat(Infinity)
      .find(
        item =>
          item['data-id'] ===
          'totalSales'
      );
    headerList.value.push(
      result
    );
  }
  // 退款金额
  else if (
    drag === 'refundAmount' &&
    headerList.value.every(
      item =>
        item['data-id'] !==
        'refundAmount'
    )
  ) {
    const result = menus.value
      .map(item => [
        ...item.children
      ])
      .flat(Infinity)
      .find(
        item =>
          item['data-id'] ===
          'refundAmount'
      );
    headerList.value.push(
      result
    );
  }
  // 连带率
  else if (
    drag ===
      'associatedPurchaseRate' &&
    headerList.value.every(
      item =>
        item['data-id'] !==
        'associatedPurchaseRate'
    )
  ) {
    const result = menus.value
      .map(item => [
        ...item.children
      ])
      .flat(Infinity)
      .find(
        item =>
          item['data-id'] ===
          'associatedPurchaseRate'
      );
    headerList.value.push(
      result
    );
  }
  updateSelectStyle();
  handleData();
}

// 获取后端的数据
function getGoodsList() {
  const goodsList = [
    // 商品
    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '鞋子', // 所属大类
      mediumClass: '高跟鞋', // 所属中类
      area: '华南' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '鞋子', // 所属大类
      mediumClass: '高跟鞋', // 所属中类
      area: '华东' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '鞋子', // 所属大类
      mediumClass: '高跟鞋', // 所属中类
      area: '华北' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '鞋子', // 所属大类
      mediumClass: '休闲鞋', // 所属中类
      area: '华南' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '鞋子', // 所属大类
      mediumClass: '休闲鞋', // 所属中类
      area: '华东' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '鞋子', // 所属大类
      mediumClass: '休闲鞋', // 所属中类
      area: '华北' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '鞋子', // 所属大类
      mediumClass: '平底鞋', // 所属中类
      area: '华南' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '鞋子', // 所属大类
      mediumClass: '平底鞋', // 所属中类
      area: '华东' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '鞋子', // 所属大类
      mediumClass: '平底鞋', // 所属中类
      area: '华北' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '帽子', // 所属大类
      mediumClass: '大帽', // 所属中类
      area: '华南' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '帽子', // 所属大类
      mediumClass: '大帽', // 所属中类
      area: '华东' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '帽子', // 所属大类
      mediumClass: '大帽', // 所属中类
      area: '华北' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '帽子', // 所属大类
      mediumClass: '手工帽', // 所属中类
      area: '华南' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '帽子', // 所属大类
      mediumClass: '手工帽', // 所属中类
      area: '华东' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '帽子', // 所属大类
      mediumClass: '手工帽', // 所属中类
      area: '华北' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '衬衣', // 所属大类
      mediumClass: '休闲衬衣', // 所属中类
      area: '华南' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '衬衣', // 所属大类
      mediumClass: '休闲衬衣', // 所属中类
      area: '华东' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '衬衣', // 所属大类
      mediumClass: '休闲衬衣', // 所属中类
      area: '华北' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '衬衣', // 所属大类
      mediumClass: '商务衬衣', // 所属中类
      area: '华南' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '衬衣', // 所属大类
      mediumClass: '商务衬衣', // 所属中类
      area: '华东' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '衬衣', // 所属大类
      mediumClass: '商务衬衣', // 所属中类
      area: '华北' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '衬衣', // 所属大类
      mediumClass: '百搭衬衣', // 所属中类
      area: '华南' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '衬衣', // 所属大类
      mediumClass: '百搭衬衣', // 所属中类
      area: '华东' // 所属区域
    },

    {
      salesVolume:
        Math.floor(
          Math.random() * 100
        ) + 1, // 销售单数
      totalSales:
        Math.floor(
          Math.random() * 100
        ) + 1, // 总销售额
      refundAmount:
        Math.floor(
          Math.random() * 100
        ) + 1, // 退款金额
      associatedPurchaseRate:
        (
          Math.random() * 2
        ).toFixed(1), // 连带率
      bigClass: '衬衣', // 所属大类
      mediumClass: '百搭衬衣', // 所属中类
      area: '华北' // 所属区域
    }
  ];
  return new Promise(
    (resolve, reject) => {
      setTimeout(() => {
        resolve(goodsList);
      }, 200);
    }
  );
}

// 处理数据  监听用户不需要用watch
async function handleData() {
  console.clear();
  console.log(
    'rowList',
    rowList.value
  );
  console.log(
    'colList',
    colList.value
  );
  console.log(
    'headerList',
    headerList.value
  );
  console.log(
    'if',
    rowList.value.length &&
      colList.value.length &
        headerList.value
          .length
  );

  // 情况1 行 列 表头 都存在 才渲染表格
  if (
    rowList.value.length &&
    colList.value.length &&
    headerList.value.length
  ) {
    // 处理colmuns   开始 ---
    let cols = [];

    // 列维度只有 一个 先不考虑多个
    colList.value.forEach(
      item => {
        cols = item._children;
      }
    );

    const tmpCol = cols.map(
      item => {
        const children =
          headerList.value.map(
            ite => {
              return {
                field: `${item.key}.${ite.key}`,
                title:
                  ite.label,
                align:
                  'center'
                // width: 100,
                // formatter:
              };
            }
          );
        return {
          title: item.label,
          align: 'center',
          // ... 其他表格支持的属性
          field: item.key,
          children: children
        };
      }
    );

    tmpCol.unshift({
      title: '区域',
      align: 'center',
      field: 'area',
      children:
        rowList.value.map(
          item => {
            return {
              ...item,
              title:
                item.label,
              align: 'center',
              width: 100,
              // ... 其他表格支持的属性
              field: item.key
            };
          }
        )
    });

    console.log(
      'tmpCol',
      tmpCol
    );

    gridOptions.columns =
      tmpCol;
    // 处理colmuns   结束 ---

    // 处理行数据  开始 ---

    // 处理行数据  结束 ---

    if (
      rowList.value.length ===
        1 &&
      rowList.value[0][
        'data-id'
      ] === 'bigClass'
    ) {
      gridOptions.data =
        handleGoodsList(
          await getGoodsList()
        ).filter(
          item =>
            item.mediumClass ===
              '中类-合计' ||
            item.mediumClass ===
              ''
        );
    } else if (
      rowList.value.length ===
        1 &&
      rowList.value[0][
        'data-id'
      ] === 'mediumClass'
    ) {
      gridOptions.data =
        handleGoodsList(
          await getGoodsList()
        ).filter(
          item =>
            item.bigClass !==
            '大类-合计'
        );
    } else {
      gridOptions.data =
        handleGoodsList(
          await getGoodsList()
        );
    }
  }

  // 情况2
  // else if () {

  // }
  else {
    gridOptions.data = [];
    gridOptions.columns = [];
  }
}

function handleGoodsList(
  goodsList
) {
  // 先确定行属性  ： 中类 和 大类

  // 对后端数组 进行去重复

  const mediumClass = [
    ...new Set(
      goodsList.map(
        item =>
          item.mediumClass
      )
    )
  ].map(item =>
    goodsList.find(
      it =>
        it.mediumClass ===
        item
    )
  );

  let result =
    mediumClass.map(row => {
      // 确定列属性
      // {
      //    huanan: {
      //      salesVolume: '',
      //      totalSales: '',
      //      refundAmount: '',
      //      associatedPurchaseRate: '',
      //    },
      //    huanan: {
      //      salesVolume: '',
      //      totalSales: '',
      //      refundAmount: '',
      //      associatedPurchaseRate: '',
      //    },
      //    huanan: {
      //      salesVolume: '',
      //      totalSales: '',
      //      refundAmount: '',
      //      associatedPurchaseRate: '',
      //    }
      // }
      return {
        bigClass:
          row.bigClass,
        mediumClass:
          row.mediumClass,
        huanan: goodsList
          .filter(
            item =>
              item.area ===
                '华南' &&
              item.mediumClass ===
                row.mediumClass
          )
          .reduce(
            (prev, curr) => {
              prev[
                'salesVolume'
              ] =
                curr.salesVolume;
              prev[
                'totalSales'
              ] =
                curr.totalSales;
              prev[
                'refundAmount'
              ] =
                curr.refundAmount;
              prev[
                'associatedPurchaseRate'
              ] =
                curr.associatedPurchaseRate;
              return prev;
            },
            {}
          ),
        huabei: goodsList
          .filter(
            item =>
              item.area ===
                '华北' &&
              item.mediumClass ===
                row.mediumClass
          )
          .reduce(
            (prev, curr) => {
              prev[
                'salesVolume'
              ] =
                curr.salesVolume;
              prev[
                'totalSales'
              ] =
                curr.totalSales;
              prev[
                'refundAmount'
              ] =
                curr.refundAmount;
              prev[
                'associatedPurchaseRate'
              ] =
                curr.associatedPurchaseRate;
              return prev;
            },
            {}
          ),
        huadong: goodsList
          .filter(
            item =>
              item.area ===
                '华东' &&
              item.mediumClass ===
                row.mediumClass
          )
          .reduce(
            (prev, curr) => {
              prev[
                'salesVolume'
              ] =
                curr.salesVolume;
              prev[
                'totalSales'
              ] =
                curr.totalSales;
              prev[
                'refundAmount'
              ] =
                curr.refundAmount;
              prev[
                'associatedPurchaseRate'
              ] =
                curr.associatedPurchaseRate;
              return prev;
            },
            {}
          )
      };
    });

  //  添加  中类合计
  result = [
    ...new Set(
      result.map(
        item => item.bigClass
      )
    )
  ]
    .map(bigClass => {
      const tmp = [
        ...result.filter(
          item =>
            item.bigClass ===
            bigClass
        )
      ];
      const last = tmp.reduce(
        (prev, curr) => {
          prev[
            'mediumClass'
          ] = '中类-合计';
          prev['bigClass'] =
            curr.bigClass;
          // 3个区域 循环 处理   目前先写死
          prev['huadong'] = {
            ...curr.huadong,
            salesVolume:
              Number(
                curr?.huadong
                  ?.salesVolume
              ) +
              Number(
                prev?.huadong
                  ?.salesVolume ||
                  0
              ),
            totalSales:
              Number(
                curr?.huadong
                  ?.totalSales
              ) +
              Number(
                prev?.huadong
                  ?.totalSales ||
                  0
              ),
            refundAmount:
              Number(
                curr?.huadong
                  ?.refundAmount
              ) +
              Number(
                prev?.huadong
                  ?.refundAmount ||
                  0
              ),
            associatedPurchaseRate:
              (
                Math.random() *
                2
              ).toFixed(1) // 连带率
          };

          prev['huabei'] = {
            ...curr.huabei,
            salesVolume:
              Number(
                curr.huabei
                  .salesVolume
              ) +
              Number(
                prev?.huabei
                  ?.salesVolume ||
                  0
              ),
            totalSales:
              Number(
                curr.huabei
                  .totalSales
              ) +
              Number(
                prev?.huabei
                  ?.totalSales ||
                  0
              ),
            refundAmount:
              Number(
                curr.huabei
                  .refundAmount
              ) +
              Number(
                prev?.huabei
                  ?.refundAmount ||
                  0
              ),
            associatedPurchaseRate:
              (
                Math.random() *
                2
              ).toFixed(1) // 连带率
          };

          prev['huanan'] = {
            ...curr.huanan,
            salesVolume:
              Number(
                curr.huanan
                  .salesVolume
              ) +
              Number(
                prev?.huanan
                  ?.salesVolume ||
                  0
              ),
            totalSales:
              Number(
                curr.huanan
                  .totalSales
              ) +
              Number(
                prev?.huanan
                  ?.totalSales ||
                  0
              ),
            refundAmount:
              Number(
                curr.huanan
                  .refundAmount
              ) +
              Number(
                prev?.huanan
                  ?.refundAmount ||
                  0
              ),
            associatedPurchaseRate:
              (
                Math.random() *
                2
              ).toFixed(1) // 连带率
          };
          return prev;
        },
        {}
      );

      return [...tmp, last];
    })
    .flat(Infinity);

  // 添加  大类 合计

  const bigClassLast = result
    .filter(
      item =>
        item.mediumClass ===
        '中类-合计'
    )
    .reduce((prev, curr) => {
      prev['bigClass'] =
        '大类-合计';
      prev['mediumClass'] =
        '';
      // 3个区域 循环 处理   目前先写死
      prev['huadong'] = {
        ...curr.huadong,
        salesVolume:
          Number(
            curr?.huadong
              ?.salesVolume
          ) +
          Number(
            prev?.huadong
              ?.salesVolume ||
              0
          ),
        totalSales:
          Number(
            curr?.huadong
              ?.totalSales
          ) +
          Number(
            prev?.huadong
              ?.totalSales ||
              0
          ),
        refundAmount:
          Number(
            curr?.huadong
              ?.refundAmount
          ) +
          Number(
            prev?.huadong
              ?.refundAmount ||
              0
          ),
        associatedPurchaseRate:
          (
            Math.random() * 2
          ).toFixed(1) // 连带率
      };

      prev['huabei'] = {
        ...curr.huabei,
        salesVolume:
          Number(
            curr.huabei
              .salesVolume
          ) +
          Number(
            prev?.huabei
              ?.salesVolume ||
              0
          ),
        totalSales:
          Number(
            curr.huabei
              .totalSales
          ) +
          Number(
            prev?.huabei
              ?.totalSales ||
              0
          ),
        refundAmount:
          Number(
            curr.huabei
              .refundAmount
          ) +
          Number(
            prev?.huabei
              ?.refundAmount ||
              0
          ),
        associatedPurchaseRate:
          (
            Math.random() * 2
          ).toFixed(1) // 连带率
      };

      prev['huanan'] = {
        ...curr.huanan,
        salesVolume:
          Number(
            curr.huanan
              .salesVolume
          ) +
          Number(
            prev?.huanan
              ?.salesVolume ||
              0
          ),
        totalSales:
          Number(
            curr.huanan
              .totalSales
          ) +
          Number(
            prev?.huanan
              ?.totalSales ||
              0
          ),
        refundAmount:
          Number(
            curr.huanan
              .refundAmount
          ) +
          Number(
            prev?.huanan
              ?.refundAmount ||
              0
          ),
        associatedPurchaseRate:
          (
            Math.random() * 2
          ).toFixed(1) // 连带率
      };
      return prev;
    }, {});

  return [
    ...result,
    bigClassLast
  ];
}
</script>

<template>
  <div
    class="demo-page-wrapper"
  >
    <div class="main">
      <div class="menu">
        <a-menu
          id="dddddd"
          v-model:openKeys="
            openKeys
          "
          v-model:selectedKeys="
            selectedKeys
          "
          mode="inline"
          multiple
          :items="menus"
          @dragstart="
            handleDragStart
          "
        >
        </a-menu>
      </div>
      <div class="table">
        <div class="select">
          <div
            class="row-col"
          >
            <div
              class="row"
              @dragover="
                e =>
                  e.preventDefault()
              "
              @drop="
                handleRowDrop
              "
            >
              <div>
                行维度：
              </div>
              <a-tag
                v-for="item in rowList"
                :key="
                  item[
                    'data-id'
                  ]
                "
                closable
                @close="
                  handleCloseRow(
                    item
                  )
                "
                >{{
                  item.label
                }}</a-tag
              >
            </div>
            <div
              class="col"
              @dragover="
                e =>
                  e.preventDefault()
              "
              @drop="
                handleColDrop
              "
            >
              <div>
                列维度：
              </div>
              <a-tag
                v-for="item in colList"
                :key="
                  item[
                    'data-id'
                  ]
                "
                closable
                @close="
                  handleCloseCol(
                    item
                  )
                "
                >{{
                  item.label
                }}</a-tag
              >
            </div>
          </div>
          <div
            class="table-header"
            @dragover="
              e =>
                e.preventDefault()
            "
            @drop="
              handleHeaderDrop
            "
          >
            <div>表头：</div>
            <a-tag
              v-for="item in headerList"
              :key="
                item[
                  'data-id'
                ]
              "
              closable
              @close="
                handleCloseHeader(
                  item
                )
              "
              >{{
                item.label
              }}</a-tag
            >
          </div>
        </div>
        <vxe-grid
          ref="gridRef"
          v-bind="gridOptions"
        >
          <!-- <template #toolbarButtons>
            <span>数据：</span>
            <vxe-select v-model="gridOptions.pagerConfig.pageSize" :options="dataOptions" @change="changeRowSizeEvent"></vxe-select>
          </template>

          <template #emailDefault="{ row }">
            <vxe-text :content="row.email" click-to-copy></vxe-text>
          </template> -->
        </vxe-grid>
      </div>
    </div>
  </div>
</template>
<style>
body {
  padding: 0;
  margin: 0;
}
.demo-page-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.main {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
}
.main .menu {
  width: 300px;
  height: 100%;
}
.main .table {
  height: 100%;
  flex: 1;
}
.table .select {
  width: 100%;
  height: 100px;
}
.row-col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
}
.row-col .row,
.row-col .col {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #e6e6e6;
  flex: 1;
  height: 100%;
  padding: 0 20px;
}
.table-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #e6e6e6;
  flex: 1;
  height: 50px;
  padding: 0 20px;
}
</style>
