export const tableOption = {
  searchMenuSpan: 6,
  columnBtn: false,
  border: true,
  selection: false,
  index: false,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 200,
  align: 'center',
  refreshBtn: true,
  searchSize: 'mini',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  menu: false,
  pageSizes: [10, 20, 30, 40, 50, 100], // 分页大小选项
  pageSize: 10, // 默认每页显示条数
  props: {
    label: 'label',
    value: 'value'
  },
  column: [
    {
      label: '搜索',
      prop: 'search_keyword',
      search: true,
      placeholder: "请输入UID或用户名",
      searchSpan: 12,
      hide: true, // 只用于搜索，不在表格中显示
    },
    {
      label: '用户名',
      prop: 'user_name',
      width: 200,
    },
    {
      label: 'UID',
      prop: 'user_code',
      width: 120,
    },
    {
      label: 'USDT',
      prop: 'usdtBalance',
      slot: true,
      width: 120,
    },
    {
      label: '入金',
      prop: 'recharge',
      width: 120,
    },
    {
      label: '出金',
      prop: 'withdraw',
      width: 120,
    },
    {
      label: '出入金差额',
      prop: 'difference',
      width: 130,
    },
    {
      label: '现货订单总数',
      prop: 'exchange_num',
      width: 140,
    },
    {
      label: '合约订单总数',
      prop: 'order_num',
      width: 140,
    },
    {
      label: '现货总盈亏',
      prop: 'profitTotal',
      width: 130,
    },
    {
      label: '合约总累计盈亏',
      prop: 'orderProfitTotal',
      width: 150,
    },
    {
      label: '总盈亏',
      prop: 'totalProfit',
      width: 120,
    },
    {
      label: '手续费',
      prop: 'totle_fee',
      width: 120,
    }
  ]
}
