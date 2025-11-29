export const tableOption = {
  searchMenuSpan: 6,
  columnBtn: false,
  border: true,
  selection: true,
  index: true,
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
  menu: true,
  emptyBtn: true,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
    label: 'ID',
    prop: 'uuid',
    width: 100,
    overHidden: true,
    addDisplay: false,
    editDisplay: false,
    hide: true // 隐藏显示，但保留在数据中
  },{
    label: '币种链名称',
    prop: 'blockchainName',
    search: true,
    searchPlaceholder: '请输入币种链名称'
  },{
    label: '充值地址',
    prop: 'address',
    search: true,
    searchPlaceholder: '请输入充值地址',
    width: 300,
    overHidden: true
  },{
    label: '状态',
    prop: 'status',
    search: true,
    type: 'select',
    dicData: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ],
    searchPlaceholder: '请选择状态',
    width: 100
  },{
    label: '备注',
    prop: 'remark',
    width: 200,
    overHidden: true
  },{
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm:ss',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    width: 180,
    addDisplay: false,
    editDisplay: false
  }],
  // 确保操作列显示
  menuType: 'button'
}
