<template>
  <div class="mod-role">
    <!-- 操作按钮区域 -->
    <div style="margin-bottom: 10px;">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addOrUpdateHandle()"
      >
        新增
      </el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="deleteHandle()"
        v-show="dataListSelections.length > 0"
      >
        批量删除
      </el-button>
    </div>

    <avue-crud
      ref="crud"
      :page.sync="page"
      :data="dataList"
      :option="tableOption"
      @search-change="searchChange"
      @selection-change="selectionChange"
      @on-load="getDataList"
    >
      <template slot-scope="scope" slot="menu">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="small"
          @click.stop="handleEdit(scope.row)"
          >编辑</el-button
        >

        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          @click.stop="deleteHandle(scope.row.uuid || scope.row.id)"
          >删除</el-button
        >
      </template>
    </avue-crud>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
  </div>
</template>

<script>
import { tableOption } from "@/crud/sys/public-address";
import AddOrUpdate from "./public-address-add-or-update";
export default {
  data() {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      searchParams: {}, // 搜索条件
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
    };
  },
  components: {
    AddOrUpdate,
  },
  created() {
    // 页面初始化
  },
  methods: {
    // 获取数据列表
    getDataList(page, done) {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/channelBlockchain/list"),
        method: "post",
        data: this.$http.adornData(
          Object.assign(
            {

              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
            },
            this.searchParams
          )
        ),
      }).then(({ data }) => {
        if (data.code == 0) {
          this.dataList = data.data.records;
          this.page.total = data.data.total;
          this.dataListLoading = false;

          // 调试：查看数据结构
          console.log('API返回的数据列表:', this.dataList)
          if (this.dataList.length > 0) {
            console.log('第一条数据结构:', this.dataList[0])
            console.log('第一条数据的ID字段:', this.dataList[0].id)
          }
        } else {
          this.$message({
            message: data.msg,
            type: "error",
            duration: 1500,
          });
        }

        if (done) {
          done();
        }
      });
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
    // 处理编辑按钮点击
    handleEdit(row) {
      console.log('=== 编辑按钮点击调试信息 ===')
      console.log('完整行数据:', JSON.stringify(row, null, 2))

      // 根据后端实体类，主键字段是uuid，不是id
      const actualId = row.uuid || row.id
      console.log('row.uuid:', row.uuid, '类型:', typeof row.uuid)
      console.log('row.id:', row.id, '类型:', typeof row.id)
      console.log('最终使用的ID:', actualId, '类型:', typeof actualId)
      console.log('=== 调试信息结束 ===')

      this.addOrUpdateHandle(actualId, row)
    },

    // 新增 / 修改
    addOrUpdateHandle(id, rowData) {
      console.log('主页面 - addOrUpdateHandle调用')
      console.log('主页面 - 传入的ID:', id, '类型:', typeof id)
      console.log('主页面 - 传入的行数据:', rowData)
      console.log('主页面 - 操作类型:', id ? '修改' : '新增')

      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        console.log('主页面 - 调用子组件init方法，传入ID:', id, '行数据:', rowData)
        this.$refs.addOrUpdate.init(id, rowData);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.uuid || item.id; // 优先使用uuid字段
          });
      this.$confirm(`确定进行[${id ? "删除" : "批量删除"}]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/channelBlockchain/delete"),
            method: "post",
            data: this.$http.adornData(ids, false),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
