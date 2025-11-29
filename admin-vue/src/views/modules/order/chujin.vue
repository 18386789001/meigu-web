<template>
  <div class="mod-chujin-report">
    <avue-crud
      ref="crud"
      :page.sync="page"
      :data="dataList"
      :option="tableOption"
      @search-change="searchChange"
      @refresh-change="refreshChange"
      @on-load="getDataList"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          icon="el-icon-refresh"
          size="small"
          @click="handleRefresh"
        >刷新数据</el-button>
      </template>
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
        searchMenuSpan: 10,
        searchLabelWidth: 100,
        columnBtn: false,
        border: true,
        selection: false,
        index: true,
        indexLabel: '序号',
        stripe: true,
        menuAlign: 'center',
        align: 'center',
        refreshBtn: true,
        searchSize: 'mini',
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menu: false,
        props: {
          label: 'label',
          value: 'value'
        },
        column: [
          {
            label: '订单号',
            prop: 'orderNo',
            search: true,
            hide: true,
            minWidth: 180
          },
          {
            label: '用户名',
            prop: 'userName',
            placeholder: '用户名',
            search: true,
            minWidth: 120
          },
          {
            label: '用户UID',
            prop: 'userUid',
            placeholder: 'UID',
            search: true,
            hide: true,
            minWidth: 120
          },
          {
            label: 'UID',
            prop: 'userCode',
            minWidth: 100
          },
          {
            label: '实名姓名',
            prop: 'realName',
            minWidth: 120
          },
          {
            label: '出金方式',
            prop: 'withdrawType',
            type: 'select',
            search: true,
            searchValue: '',
            dicData: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '银行卡提现',
                value: 'bankCard'
              },
              {
                label: '数字货币提现',
                value: 'crypto'
              },
              {
                label: '手动下分',
                value: 'manual'
              }
            ],
            minWidth: 130
          },
          {
            label: '日志',
            prop: 'logInfo',
            minWidth: 200,
            showOverflowTooltip: true
          },
          {
            label: '支付币种',
            prop: 'payCurrency',
            minWidth: 100
          },
          {
            label: '到账币种',
            prop: 'receiveCurrency',
            minWidth: 100
          },
          {
            label: '币种单价',
            prop: 'currencyPrice',
            minWidth: 100
          },
          {
            label: '提现数量',
            prop: 'withdrawAmount',
            minWidth: 120
          },
          {
            label: '到账数量',
            prop: 'receiveAmount',
            minWidth: 120
          },
          {
            label: '手续费',
            prop: 'fee',
            minWidth: 100
          },
          {
            label: '支付金额',
            prop: 'payAmount',
            minWidth: 120
          },
          {
            label: '提现币链',
            prop: 'blockchain',
            minWidth: 120
          },
          {
            label: '币链地址',
            prop: 'blockchainAddress',
            minWidth: 200,
            showOverflowTooltip: true
          },
          {
            label: '备注',
            prop: 'remark',
            minWidth: 150,
            showOverflowTooltip: true
          },
          {
            label: '创建时间',
            prop: 'createTime',
            minWidth: 160
          },
          {
            label: '审核时间',
            prop: 'reviewTime',
            minWidth: 160
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    // 获取数据列表
    async getDataList(page, done) {
      this.dataListLoading = true;
      const currentPage = page == null ? this.page.currentPage : page.currentPage;
      const pageSize = page == null ? this.page.pageSize : page.pageSize;

      try {
        // 并行请求三个接口
        const [bankCardData, cryptoData, moneylogData] = await Promise.all([
          this.getBankCardWithdrawOrders(currentPage, pageSize),
          this.getCryptoWithdrawOrders(currentPage, pageSize),
          this.getMoneylogWithdrawOrders(currentPage, pageSize)
        ]);

        // 合并并处理数据
        const mergedData = this.mergeAndFormatData(bankCardData, cryptoData, moneylogData);
        
        // 应用搜索过滤
        this.dataList = this.applySearchFilter(mergedData);
        
        // 分页处理
        this.page.total = this.dataList.length;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        this.dataList = this.dataList.slice(start, end);

        this.dataListLoading = false;
        if (done) {
          done();
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        this.$message.error('获取数据失败，请稍后重试');
        this.dataListLoading = false;
        if (done) {
          done();
        }
      }
    },

    // 获取银行卡提现订单
    async getBankCardWithdrawOrders(current, size) {
      try {
        const response = await this.$http({
          url: 'https://jpmx.xyz/apis/bankCardOrder/list',
          method: 'post',
          data: {
            t: Date.now(),
            current: 1, // 获取所有数据，前端分页
            size: 1000 // 获取足够多的数据
          }
        });

        if (response.data && response.data.succeed && response.data.data && response.data.data.records) {
          // 只返回提现订单（direction为withdraw）且状态为已完成的
          return response.data.data.records.filter(
            item => item.direction === 'withdraw' && item.state === '3'
          );
        }
        return [];
      } catch (error) {
        console.error('获取银行卡提现订单失败:', error);
        return [];
      }
    },

    // 获取数字货币提现订单
    async getCryptoWithdrawOrders(current, size) {
      try {
        const response = await this.$http({
          url: 'https://jpmx.xyz/apis/withdraw/list',
          method: 'post',
          data: {
            t: Date.now(),
            status: '1', // 只获取已处理的订单
            current: 1,
            size: 1000
          }
        });

        if (response.data && response.data.succeed && response.data.data && response.data.data.records) {
          // 只返回已处理的订单（status为1）
          return response.data.data.records.filter(item => item.status === 1);
        }
        return [];
      } catch (error) {
        console.error('获取数字货币提现订单失败:', error);
        return [];
      }
    },

    // 获取手动下分日志记录
    async getMoneylogWithdrawOrders(current, size) {
      try {
        const response = await this.$http({
          url: 'https://jpmx.xyz/apis/moneylog/list',
          method: 'post',
          data: {
            t: Date.now(),
            userName: '',
            roleName: '',
            log: '', // 获取所有类型
            startTime: '',
            endTime: '',
            current: 1,
            size: 1000
          }
        });

        if (response.data && response.data.succeed && response.data.data && response.data.data.records) {
          // 返回所有log包含指定关键词的记录
          const filteredRecords = response.data.data.records.filter(item => {
            const log = item.log || '';
            // 检查log是否包含"手动减少"或"手动下分"
            return log.includes('手动减少') || log.includes('手动下分');
          });
          console.log('手动下分记录总数:', filteredRecords.length);
          return filteredRecords;
        }
        return [];
      } catch (error) {
        console.error('获取手动下分日志失败:', error);
        return [];
      }
    },

    // 合并并格式化数据
    mergeAndFormatData(bankCardData, cryptoData, moneylogData) {
      const formattedData = [];

      // 处理银行卡提现数据
      bankCardData.forEach(item => {
        formattedData.push({
          orderNo: item.order_no || '',
          userName: item.username || '',
          userCode: item.usercode || '',
          userUid: item.usercode || '',
          realName: item.realname || '',
          withdrawType: '银行卡提现',
          withdrawTypeValue: 'bankCard',
          logInfo: '',
          payCurrency: item.currency || '',
          receiveCurrency: item.symbol || '',
          currencyPrice: item.symbol_value || '',
          withdrawAmount: item.coin_amount || '',
          receiveAmount: item.coin_amount || '',
          fee: item.coin_amount_fee || '',
          payAmount: item.amount || '',
          blockchain: '',
          blockchainAddress: '',
          remark: item.remark || '',
          createTime: item.create_time || '',
          reviewTime: item.update_time || '',
          sourceType: 'bankCard'
        });
      });

      // 处理数字货币提现数据
      cryptoData.forEach(item => {
        formattedData.push({
          orderNo: item.orderNo || '',
          userName: item.userName || '',
          userCode: item.userCode || '',
          userUid: item.userCode || '',
          realName: item.realName || item.fullName || '',
          withdrawType: '数字货币提现',
          withdrawTypeValue: 'crypto',
          logInfo: '',
          payCurrency: item.coin || item.blockchainName || '',
          receiveCurrency: item.coin || '',
          currencyPrice: '',
          withdrawAmount: item.amount || item.withdrawAmount || '',
          receiveAmount: item.receiveAmount || item.actualAmount || '',
          fee: item.fee || '',
          payAmount: item.amount || '',
          blockchain: item.blockchainName || item.blockchain || '',
          blockchainAddress: item.address || item.withdrawAddress || '',
          remark: item.description || item.remark || '',
          createTime: item.createTime || '',
          reviewTime: item.reviewTime || item.auditTime || '',
          sourceType: 'crypto'
        });
      });

      // 处理手动下分日志数据
      moneylogData.forEach(item => {
        // 所有包含"手动减少"、"手动下分"的log都归类为"手动下分"
        formattedData.push({
          orderNo: item.uuid || '',
          userName: item.userName || '',
          userCode: item.userCode || '',
          userUid: item.userCode || '',
          realName: '',
          withdrawType: '手动下分',
          withdrawTypeValue: 'manual',
          logInfo: item.log || '',
          payCurrency: '',
          receiveCurrency: item.walletType || '',
          currencyPrice: '',
          withdrawAmount: Math.abs(item.amount || 0), // 使用绝对值，因为是负数
          receiveAmount: Math.abs(item.amount || 0),
          fee: '',
          payAmount: '',
          blockchain: '',
          blockchainAddress: '',
          remark: '',
          createTime: item.createTime || '',
          reviewTime: '',
          sourceType: 'moneylog'
        });
      });

      // 按创建时间降序排序
      formattedData.sort((a, b) => {
        return new Date(b.createTime) - new Date(a.createTime);
      });

      return formattedData;
    },

    // 应用搜索过滤
    applySearchFilter(data) {
      let filteredData = [...data];

      // 订单号搜索
      if (this.searchParams.orderNo) {
        const searchText = this.searchParams.orderNo.toLowerCase();
        filteredData = filteredData.filter(item =>
          (item.orderNo || '').toLowerCase().includes(searchText)
        );
      }

      // 用户名搜索
      if (this.searchParams.userName) {
        const searchText = this.searchParams.userName.toLowerCase();
        filteredData = filteredData.filter(item =>
          (item.userName || '').toLowerCase().includes(searchText)
        );
      }

      // UID搜索
      if (this.searchParams.userUid) {
        const searchText = this.searchParams.userUid.toLowerCase();
        filteredData = filteredData.filter(item =>
          (item.userCode || '').toLowerCase().includes(searchText)
        );
      }

      // 出金方式筛选
      if (this.searchParams.withdrawType) {
        filteredData = filteredData.filter(item =>
          item.withdrawTypeValue === this.searchParams.withdrawType
        );
      }

      return filteredData;
    },

    // 条件查询
    searchChange(params, done) {
      this.page.currentPage = 1; // 重置当前页为第一页
      this.searchParams = params;
      this.getDataList(this.page, done);
    },

    // 点击刷新按钮
    refreshChange(params, done) {
      this.searchParams = {}; // 清空搜索条件
      this.page.currentPage = 1;
      this.getDataList(this.page, done);
    },

    // 手动刷新
    handleRefresh() {
      this.searchParams = {};
      this.page.currentPage = 1;
      this.getDataList(this.page);
    }
  }
};
</script>

<style scoped>
.mod-chujin-report {
  padding: 10px;
}
</style>

