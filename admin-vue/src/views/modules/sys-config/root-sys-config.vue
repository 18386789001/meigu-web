<template>
  <div class="mod-transport">
    <avue-crud
      ref="crud"
      :page.sync="page"
      :data="dataList"
      :option="tableOption"
      @search-change="searchChange"
      @selection-change="selectionChange"
      @on-load="getDataList"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="small"
          v-if="isAuth('sys:user:root')"
          @click.stop="getUpdateSuperGoogleAuth()"
        >
          超级谷歌验证器
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="small"
          v-if="isAuth('sys:user:root')"
          @click.stop="getAdminGoogleAuth()"
        >
          admin谷歌验证器
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="small"
          v-if="isAuth('sys:user:root')"
          @click.stop="backupDB()"
        >
          备份数据库
        </el-button>
        <el-button
          type="success"
          icon="el-icon-message"
          size="small"
          
          @click.stop="openMail()"
        >
          打开邮件
        </el-button>
        <el-button
          type="warning"
          icon="el-icon-close"
          size="small"
          @click.stop="closeMail()"
        >
          关闭邮件
        </el-button>
        <div style="display: inline-block; margin-left: 10px; padding: 8px 12px; background: #f5f7fa; border: 1px solid #dcdfe6; border-radius: 4px;">
          <span style="color: #606266; font-size: 14px;">邮件状态：</span>
          <span :style="{ color: (mailStatus === '开' || mailStatus === '开启') ? '#67c23a' : '#f56c6c' }">{{ mailStatus || '未知' }}</span>
        </div>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="small"
          v-if="isAuth('sys:user:update')"
          @click.stop="addOrUpdateHandle(scope.row, scope.$index)"
        >
          编辑
        </el-button>
      </template>
    </avue-crud>
    <!-- 弹窗, 新增 / 修改  -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      :dataList="dataList"
      :currentPage="page.currentPage"
      :pageSize="page.pageSize"
      @refreshDataList="refreshDataList"
    ></add-or-update>
     <!-- 谷歌验证 -->
     <add-or-gogle
      v-if="UpdateGogle"
      ref="UpdateGogle"
      @refreshDataList="getDataList"
    ></add-or-gogle>
  </div>
</template>

<script>
import { tableOption } from "@/crud/sys/root";
import AddOrUpdate from "./root-sys-config-add-or-update";
import AddOrGogle from "./root-sys-googleAuthCode";
export default {
  data() {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      UpdateGogle: false,
      addOrUpdateVisible: false,
      tableOption: tableOption,
      adminGoog:'',
      rootGoog:'',
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      searchParams: {}, // 搜索条件
      mailStatus: '', // 邮件状态
    };
  },
  components: {
    AddOrUpdate,
    AddOrGogle
  },
  methods: {
    // 获取数据列表
    getDataList(page, done) {
      this.dataListLoading = true;
      const params = {
        current: page == null ? this.page.currentPage : page.currentPage,
        size: page == null ? this.page.pageSize : page.pageSize,
        ...this.searchParams,
      };
      this.$http({
        url: this.$http.adornUrl("/normal/adminSysparaAction!/list.action"),
        method: "get",
        params: this.$http.adornParams(params),
      }).then(({ data }) => {
        this.dataList = data.data.records;
        this.page.total = data.data.total;

        // 更新当前页，确保与实际数据一致
        if (page != null) {
          this.page.currentPage = page.currentPage;
        }

        this.dataListLoading = false;

        // 激活事件，发送数据
        this.$bus.$emit("root2-sys-config", {});

        // 获取邮件状态
        this.showMailStatus();

        if (done) {
          done();
        }
      });
    },
    // 刷新数据列表
    refreshDataList() {
      this.getDataList(this.page);
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
    // 新增 / 修改
    addOrUpdateHandle(data, index) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data, index);
      });
    },
    addOrUpdateGogle(googleAuthBind,n,m) { // n判断是admin还是超级谷歌 m true=解绑  false = 绑定
      this.UpdateGogle = true;
      this.$nextTick(() => {
        this.$refs.UpdateGogle.init(googleAuthBind,n,m);
      });
    },
    getUpdateSuperGoogleAuth() {
      this.$http({
        url: this.$http.adornUrl( //获取系统配置-超级谷歌验证码绑定状态
          "/adminGoogleAuthAction/getUpdateSuperGoogleAuth"
        ),
        method: "get",
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        this.rootGoog = data.data.googleAuthBind
        this.goBind(this.rootGoog,'超级')
      });
    },
    getAdminGoogleAuth() {
      this.$http({
        url: this.$http.adornUrl( //获取admin谷歌验证器绑定状态
          "/adminGoogleAuthAction/getAdminGoogleAuth"
        ),
        method: "get",
        params: this.$http.adornParams({}),
      }).then(({ data }) => {
        if(data.code == 0){
          this.adminGoog = data.data.googleAuthBind
          this.goBind(this.adminGoog,'admin')
        }
      });
    },
    goBind(googleAuthBind,n){
      if (googleAuthBind) {
        this.$confirm(n + "谷歌验证器已绑定", "谷歌验证器", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "解绑",
          type: "success",
        })
          .then(() => {})
          .catch((action) => {
            if (action === "cancel") {
              this.addOrUpdateGogle(googleAuthBind,n,true);
            }
          });
      } else {
        this.addOrUpdateGogle(googleAuthBind,n,false);
      }
    },
    backupDB() {
      this.$confirm(
        `确定备份数据库操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/normal/adminSysparaAction!/backupDB"),
            method: "post",
            data: this.$http.adornData({}),
          }).then(({ data }) => {
            if(data.code == 0){
              this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
              }
            });
            }else{
              this.$message({
              message:data.msg,
              type: "error",
              duration: 1500,
              onClose: () => {
              }
            });
            }
          });
        })
        .catch(() => {});
    },
    // 打开邮件
    openMail() {
      this.$confirm(
        `确定要打开邮件服务?`,
        "邮件控制",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/rechargeOrder/openMail"),
            method: "get",
            params: this.$http.adornParams({}),
          }).then((response) => {
            console.log('打开邮件API响应:', response); // 添加调试日志
            const { data } = response;
            // 当code为1且msg为"0"时表示成功
            if(data && data.code === 1 && data.msg === "0"){
              this.$message({
                message: "邮件服务已打开",
                type: "success",
                duration: 2000,
                showClose: true
              });
              // 操作成功后刷新邮件状态
              this.showMailStatus();
            }else{
              this.$message({
                message: (data && data.msg) || "操作失败，请检查网络连接",
                type: "error",
                duration: 2000,
                showClose: true
              });
            }
          }).catch((error) => {
            console.error('打开邮件请求失败:', error); // 添加错误日志
            this.$message({
              message: "请求失败，请稍后重试",
              type: "error",
              duration: 2000,
              showClose: true
            });
          });
        })
        .catch(() => {});
    },
    // 关闭邮件
    closeMail() {
      this.$confirm(
        `确定要关闭邮件服务?`,
        "邮件控制",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/rechargeOrder/closeMail"),
            method: "get",
            params: this.$http.adornParams({}),
          }).then((response) => {
            console.log('关闭邮件API响应:', response); // 添加调试日志
            const { data } = response;
            // 当code为1且msg为"0"时表示成功
            if(data && data.code === 1 && data.msg === "0"){
              this.$message({
                message: "邮件服务已关闭",
                type: "success",
                duration: 2000,
                showClose: true
              });
              // 操作成功后刷新邮件状态
              this.showMailStatus();
            }else{
              this.$message({
                message: (data && data.msg) || "操作失败，请检查网络连接",
                type: "error",
                duration: 2000,
                showClose: true
              });
            }
          }).catch((error) => {
            console.error('关闭邮件请求失败:', error); // 添加错误日志
            this.$message({
              message: "请求失败，请稍后重试",
              type: "error",
              duration: 2000,
              showClose: true
            });
          });
        })
        .catch(() => {});
    },
    // 获取邮件状态
    showMailStatus() {
      this.$http({
        url: this.$http.adornUrl("/rechargeOrder/showMail"),
        method: "get",
        params: this.$http.adornParams({}),
      }).then((response) => {
        console.log('邮件状态API响应:', response);
        const { data } = response;
        if (data && data.data !== undefined) {
          // 直接取 data.data 的值作为邮件状态
          this.mailStatus = data.data;
        } else {
          this.mailStatus = '未知';
        }
      }).catch((error) => {
        console.error('获取邮件状态失败:', error);
        this.mailStatus = '获取失败';
      });
    }
  },
};
</script>
