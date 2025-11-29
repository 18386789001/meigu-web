<template>
  <div class="mod-email-log">
    <avue-crud
      ref="crud"
      :page.sync="page"
      :data="dataList"
      :option="tableOption"
      @search-change="searchChange"
      @search-reset="searchReset"
      @on-load="getDataList"
    >
    </avue-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      dataListLoading: false,
      searchParams: {}, // 搜索条件
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      tableOption: {
        searchMenuSpan: 6,
        columnBtn: false,
        border: true,
        selection: false, // 不需要多选
        index: true,
        indexLabel: '序号',
        stripe: true,
        align: 'center',
        refreshBtn: true,
        searchSize: 'mini',
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menu: false, // 不需要操作列
        emptyBtn: true,
        emptyText: '清空',
        searchBtn: true,
        searchBtnText: '搜索',
        props: {
          label: 'label',
          value: 'value'
        },
        column: [{
          label: 'ID',
          prop: 'id',
          width: 80,
          overHidden: true,
          hide: true // 隐藏ID列
        },{
          label: '用户ID',
          prop: 'userId',
          width: 150,
          overHidden: true,
          hide: true
        },{
          label: '邮箱号',
          prop: 'mail',
          search: true,
          searchPlaceholder: '请输入邮箱号',
          width: 250,
          overHidden: true
        },{
          label: '邮件主题',
          prop: 'emailSubject',
          width: 120,
          overHidden: true
        },{
          label: '邮件内容',
          prop: 'descrip',
          minWidth: 300,
          overHidden: true,
          showOverflowTooltip: true
        },{
          label: '发送时间',
          prop: 'time',
          type: 'datetime',
          format: 'yyyy-MM-dd HH:mm:ss',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          width: 180
        }]
      }
    };
  },
  created() {
    // 页面初始化
  },
  methods: {
    // 获取数据列表
    getDataList(page, done) {
      this.dataListLoading = true;
      
      // 构建请求参数
      const params = {
        t: new Date().getTime(), // 时间戳
        status: '', // 状态为空
        current: page == null ? this.page.currentPage : page.currentPage,
        size: page == null ? this.page.pageSize : page.pageSize
      };
      
      // 如果有搜索条件（邮箱号），添加到参数中
      if (this.searchParams.mail) {
        params.mail = this.searchParams.mail;
      }

      this.$http({
        url: "https://jpmx.xyz/apis/selectMailLog",
        method: "post",
        data: params
      }).then(({ data }) => {
        if (data.code == 0 && data.succeed) {
          // 处理数据，添加邮件主题字段
          this.dataList = (data.data.records || []).map(item => {
            return {
              ...item,
              emailSubject: this.getEmailSubject(item.descrip)
            };
          });
          this.page.total = data.data.total;
        } else {
          this.$message({
            message: data.msg || '获取数据失败',
            type: "error",
            duration: 1500,
          });
          this.dataList = [];
          this.page.total = 0;
        }
        
        this.dataListLoading = false;
        
        if (done) {
          done();
        }
      }).catch(error => {
        console.error('获取邮件日志失败:', error);
        this.$message({
          message: '获取数据失败，请稍后重试',
          type: "error",
          duration: 1500,
        });
        this.dataListLoading = false;
        if (done) {
          done();
        }
      });
    },

    // 根据邮件内容判断邮件主题
    getEmailSubject(descrip) {
      if (!descrip) return '';
      
      const content = descrip.toLowerCase();
      
      // 检查是否包含 sincerely for choosing 关键词（优先检查更长的关键词）
      if (content.includes('sincerely for choosing')) {
        return '初级认证';
      }
      
      // 检查是否包含 welcome 关键词
      if (content.includes('welcome')) {
        return '新注册';
      }
      
      // 检查是否包含 deposit 关键词
      if (content.includes('deposit')) {
        return '入金';
      }
      
      // 检查是否包含 withdrawal 关键词
      if (content.includes('withdrawal')) {
        return '出金';
      }
      
      // 如果都不包含，返回空字符串
      return '';
    },

    // 条件查询
    searchChange(params, done) {
      this.page.currentPage = 1; // 重置当前页为第一页
      this.searchParams = params;
      this.getDataList(this.page, done);
    },
    
    // 重置搜索
    searchReset() {
      this.searchParams = {};
      this.page.currentPage = 1;
      this.getDataList(this.page);
    }
  },
};
</script>

<style scoped>
.mod-email-log {
  padding: 10px;
}
</style>

