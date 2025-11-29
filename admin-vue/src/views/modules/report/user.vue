<template>
  <div class="mod-user-revenue">
    <avue-crud
      ref="crud"
      :page.sync="page"
      :data="dataList"
      :option="tableOption"
      @search-change="searchChange"
      @selection-change="selectionChange"
      :cell-class-name="addClasscolor"
      @on-load="getDataList"
    >
      <template slot-scope="scope" slot="usdtBalance">
        <span class="seachButton" @click="showUsdtBalance(scope.row)">{{
          scope.row.money || 0
        }}</span>
      </template>
    </avue-crud>
    
    <!-- USDT余额弹窗 -->
    <el-dialog
      title="USDT余额详情"
      :visible.sync="usdtDialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <div v-if="currentUserBalance">
        <el-table :data="currentUserBalance" border>
          <el-table-column prop="coin" label="币种" align="center"></el-table-column>
          <el-table-column prop="available" label="可用余额" align="center"></el-table-column>
          <el-table-column prop="frozen" label="冻结余额" align="center"></el-table-column>
          <el-table-column prop="total" label="总余额" align="center"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="usdtDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tableOption } from "@/crud/report/user";

export default {
  data() {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      searchParams: {}, // 搜索条件
      usdtDialogVisible: false, // USDT余额弹窗显示状态
      currentUserBalance: [], // 当前用户余额数据
    };
  },
  created() {
    this.dataListLoading = true;
  },
  methods: {
    // 获取数据列表
    getDataList(page, done) {
      const params = {
        current: page == null ? this.page.currentPage : page.currentPage,
        size: page == null ? this.page.pageSize : page.pageSize,
        ...this.searchParams,
      };
      
      this.dataListLoading = true;
      
      // 获取搜索关键词
      const searchKeyword = params.search_keyword || "";
      
      if (!searchKeyword) {
        // 如果没有搜索关键词，清空列表
        this.dataList = [];
        this.page.total = 0;
        this.dataListLoading = false;
        if (done) {
          done();
        }
        return;
      }
      
      // 先通过userList接口查询，获取user_id
      this.searchUserByKeyword(searchKeyword, page, done);
    },
    
    // 通过UID或用户名搜索用户
    searchUserByKeyword(keyword, page, done) {
      console.log('🔍 搜索关键词:', keyword);
      
      this.$http({
        url: this.$http.adornUrl("/statistics/userList"),
        method: "post",
        data: this.$http.adornData({
          t: Date.now(),
          user_name: keyword, // 可以是user_code或user_name
          current: 1,
          size: 5 // API要求最小值为5
        }),
      }).then(({ data }) => {
        console.log('📋 userList返回数据:', data);
        
        if (data.code == 0 && data.data && data.data.records && data.data.records.length > 0) {
          // 获取到user_id，调用userById接口（取第一条匹配结果）
          const userId = data.data.records[0].user_id;
          console.log('✅ 找到user_id:', userId);
          console.log('📊 用户信息:', data.data.records[0]);
          this.getUserRevenueData(userId, page, done);
        } else {
          console.warn('⚠️ 未找到用户，API返回:', data);
          this.$message.warning(data.msg || "未找到该用户");
          this.dataList = [];
          this.page.total = 0;
          this.dataListLoading = false;
          if (done) {
            done();
          }
        }
      }).catch((error) => {
        console.error('❌ 搜索用户失败:', error);
        this.$message.error("搜索用户失败");
        this.dataList = [];
        this.page.total = 0;
        this.dataListLoading = false;
        if (done) {
          done();
        }
      });
    },
    
    
    // 通过userById接口获取用户收益数据
    getUserRevenueData(userId, page, done) {
      const requestData = {
        t: Date.now(),
        userId: userId,
        current: page == null ? this.page.currentPage : page.currentPage,
        size: page == null ? this.page.pageSize : page.pageSize,
      };
      
      this.$http({
        url: this.$http.adornUrl("/statistics/userById"),
        method: "post",
        data: this.$http.adornData(requestData),
      }).then(({ data }) => {
        console.log('📊 API返回数据:', data);
        
        if (data.code == 0) {
          // 根据实际API返回结构处理数据
          let records = [];
          
          // 检查不同的数据结构
          if (data.data && data.data.records) {
            // 结构1: { code: 0, data: { records: [], total: 0 } }
            records = data.data.records || [];
            this.page.total = data.data.total || 0;
          } else if (data.records) {
            // 结构2: { code: 0, records: [], total: 0 }
            records = data.records || [];
            this.page.total = data.total || 0;
          } else if (Array.isArray(data.data)) {
            // 结构3: data.data 是数组
            records = data.data;
            this.page.total = data.total || data.data.length;
          } else if (Array.isArray(data)) {
            // 结构4: 直接返回数组
            records = data;
            this.page.total = data.length;
          } else if (data.data && typeof data.data === 'object') {
            // 结构5: data.data 是单个对象，包装成数组
            records = [data.data];
            this.page.total = 1;
          } else {
            // 结构6: 空数据
            records = [];
            this.page.total = data.total || 0;
          }
          
          console.log('📋 解析后的记录:', records);
          console.log('📊 总记录数:', this.page.total);
          console.log('📊 records是数组吗?', Array.isArray(records));
          
          // 确保records是数组
          if (!Array.isArray(records)) {
            console.warn('⚠️ records不是数组，强制转换为数组');
            records = records ? [records] : [];
          }
          
          // 处理数据，计算总盈亏
          this.dataList = records.map(item => {
            // 计算总盈亏：现货总盈亏 + 合约总累计盈亏 - 手续费
            const totalProfit = (parseFloat(item.profitTotal) || 0) + 
                              (parseFloat(item.orderProfitTotal) || 0) - 
                              (parseFloat(item.totle_fee) || 0);
            
            return {
              ...item,
              totalProfit: totalProfit.toFixed(2)
            };
          });
          
          console.log('✅ 最终dataList:', this.dataList);
        } else {
          console.error('❌ API返回错误:', data);
          this.$message.error(data.msg || "获取数据失败");
          this.dataList = [];
          this.page.total = 0;
        }
        this.dataListLoading = false;
        if (done) {
          done();
        }
      }).catch((error) => {
        console.error("获取用户收益数据失败:", error);
        this.$message.error("获取数据失败");
        this.dataListLoading = false;
        if (done) {
          done();
        }
      });
    },
    
    // 表格样式设置
    addClasscolor({ column, row }) {
      // 正数显示绿色，负数显示红色
      if (
        (column.property === "recharge" && row.recharge * 1 > 0) ||
        (column.property === "withdraw" && row.withdraw * 1 > 0) ||
        (column.property === "difference" && row.difference * 1 > 0) ||
        (column.property === "profitTotal" && row.profitTotal * 1 > 0) ||
        (column.property === "orderProfitTotal" && row.orderProfitTotal * 1 > 0) ||
        (column.property === "totalProfit" && row.totalProfit * 1 > 0) ||
        (column.property === "totle_fee" && row.totle_fee * 1 > 0)
      ) {
        return "green";
      } else if (
        (column.property === "profitTotal" && row.profitTotal * 1 < 0) ||
        (column.property === "orderProfitTotal" && row.orderProfitTotal * 1 < 0) ||
        (column.property === "totalProfit" && row.totalProfit * 1 < 0)
      ) {
        return "red";
      } else {
        return "";
      }
    },
    
    // 显示USDT余额弹窗
    showUsdtBalance(row) {
      // 这里可以调用API获取用户的具体余额信息
      // 暂时使用模拟数据
      this.currentUserBalance = [
        {
          coin: "USDT",
          available: row.money || 0,
          frozen: 0,
          total: row.money || 0
        }
      ];
      this.usdtDialogVisible = true;
    },
    
    // 关闭弹窗
    handleClose(done) {
      this.usdtDialogVisible = false;
      this.currentUserBalance = [];
    },
    
    // 条件查询
    searchChange(params, done) {
      this.page.currentPage = 1; // 重置当前页为第一页
      this.searchParams = params;
      this.getDataList(this.page, done);
    },
    
    // 多选变化
    selectionChange(val) {
      this.dataListSelections = val;
    },
  },
};
</script>

<style scoped>
.mod-user-revenue {
  padding: 20px;
}

.seachButton {
  color: #409EFF;
  cursor: pointer;
  text-decoration: underline;
}

.seachButton:hover {
  color: #66b1ff;
}

/* 表格样式 */
:deep(.el-table .green) {
  color: #67C23A;
  font-weight: bold;
}

:deep(.el-table .red) {
  color: #F56C6C;
  font-weight: bold;
}
</style>
