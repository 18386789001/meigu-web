<template>
  <el-dialog
    :title="!id ? '新增' : '修改'"
    :close-on-click-modal="false"
    @close="handClose"
    width="750px"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="用户名" label-width="100px" prop="username">
        <el-input
          v-model="dataForm.username"
          :disabled="false"
          placeholder="登录帐号"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="!id"
        label="登录密码"
        label-width="100px"
        prop="password"
      >
        <el-input
          v-model="dataForm.password"
          type="password"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <div v-if="!id" style="margin: 20px 0; color: green; padding-left: 100px">
        演示账号资金密码默认为000000，可登录后修改
      </div>
      <el-form-item
        v-if="!id"
        label="UID(选填)"
        prop="parentsUseCode"
        label-width="100px"
      >
        <el-input
          v-model="dataForm.parentsUseCode"
          placeholder="上级用户或上级代理商UID(选填)"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item> -->
      <el-form-item label="登录权限" label-width="100px">
        <el-select
          v-model="options.value1"
          @change="changeVal()"
          class="inpspase"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value1"
            :label="item.label1"
            :value="item.value1"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="id" label="提现权限" label-width="100px">
        <el-select
          v-model="optionsThree.value3"
          @change="changeVal()"
          class="inpspase"
          placeholder="请选择"
        >
          <el-option
            v-for="item in optionsThree"
            :key="item.value3"
            :label="item.label3"
            :value="item.value3"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="id" label="基础认证" label-width="100px">
        <el-select
          v-model="dataForm.realNameAuthority"
          @change="changeVal()"
          class="inpspase"
          placeholder="请选择"
        >
          <el-option
            v-for="item in optionsFous"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="id" label="实名姓名" label-width="100px">
        <el-input
          v-model="dataForm.realName"
          placeholder="请输入实名姓名"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="id" label="证件号码" label-width="100px">
        <el-input
          v-model="dataForm.idNumber"
          placeholder="请输入证件号码"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="id" label="邮箱账号" label-width="100px">
        <el-input
          v-model="dataForm.userMail"
          placeholder="请输入邮箱账号"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="id" label="证件正面照" label-width="100px">
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <el-input
              v-model="dataForm.idFrontImg"
              placeholder="请输入证件正面照地址"
              style="flex: 1;"
            ></el-input>
            <el-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="(res, file) => handleUploadSuccess(res, file, 'front')"
              :on-error="(err, file) => handleUploadError(err, file, 'front')"
              :before-upload="(file) => beforeUpload(file, 'front')"
              accept="image/*"
            >
              <el-button size="small" type="primary" :loading="frontUploading">
                {{ frontUploading ? '上传中...' : '上传图片' }}
              </el-button>
            </el-upload>
          </div>
          <el-image
            v-if="dataForm.idFrontImg"
            :src="dataForm.idFrontImg"
            style="width: 200px; height: 120px; cursor: pointer; border: 1px solid #dcdfe6; border-radius: 4px;"
            :preview-src-list="[dataForm.idFrontImg]"
            fit="cover"
          >
          </el-image>
        </div>
      </el-form-item>
      <el-form-item v-if="id" label="证件背面照" label-width="100px">
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <el-input
              v-model="dataForm.idBackImg"
              placeholder="请输入证件背面照地址"
              style="flex: 1;"
            ></el-input>
            <el-upload
              :action="uploadUrl"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="(res, file) => handleUploadSuccess(res, file, 'back')"
              :on-error="(err, file) => handleUploadError(err, file, 'back')"
              :before-upload="(file) => beforeUpload(file, 'back')"
              accept="image/*"
            >
              <el-button size="small" type="primary" :loading="backUploading">
                {{ backUploading ? '上传中...' : '上传图片' }}
              </el-button>
            </el-upload>
          </div>
          <el-image
            v-if="dataForm.idBackImg"
            :src="dataForm.idBackImg"
            style="width: 200px; height: 120px; cursor: pointer; border: 1px solid #dcdfe6; border-radius: 4px;"
            :preview-src-list="[dataForm.idBackImg]"
            fit="cover"
          >
          </el-image>
        </div>
      </el-form-item>
      <div
        v-if="id"
        style="margin: 20px 0; color: rgb(124, 126, 124); padding-left: 100px"
      >
        演示账号该设置不生效，默认无提现权限
      </div>
      <el-form-item label="是否业务锁定" label-width="100px">
        <el-select
          v-model="optionsTwo.value2"
          @change="changeVal()"
          class="inpspase"
          placeholder="请选择"
        >
          <el-option
            v-for="item in optionsTwo"
            :key="item.value2"
            :label="item.label2"
            :value="item.value2"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评分" label-width="100px" prop="">
        <el-input
          v-model="dataForm.userLevel"
          type="number"
          placeholder="评分"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" label-width="100px" prop="remarks">
        <el-input
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 8 }"
          show-word-limit
          v-model="dataForm.remarks"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from "@/utils/validate";
import { Debounce } from "@/utils/debounce";
import { encrypt } from "@/utils/crypto";
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    var validateuserLevel = (rule, value, callback) => {
      const regex = /^(0|[1-9]\d*)$/; // 正则表达式：大于等于0的整数
      if (regex.test(value)) {
        callback();
      } else {
        callback(new Error("请输入大于或等于0的整数"));
      }
    };
    return {
      visible: false,
      roleList: {},
      id: "",
      frontUploading: false,
      backUploading: false,
      uploadUrl: this.$http.adornUrl('/api/uploadFile'),
      uploadHeaders: {
        token: this.$cookie.get('token')
      },
      dataForm: {
        parentsUseCode: "",
        remarks: "",
        username: "",
        password: "",
        email: "",
        mobile: "",
        userLevel: "",
        realNameAuthority:'',
        realName: "",
        idNumber: "",
        userMail: "",
        idFrontImg: "",
        idBackImg: "",
        status: 1,
      },
      options: [
        {
          label1: "正常",
          value1: true,
        },
        {
          label1: "限制登录",
          value1: false,
        },
      ],
      optionsTwo: [
        {
          label2: "正常",
          value2: true,
        },
        {
          label2: "业务锁定(登录不受影响,锁定后无法购买订单和提现)",
          value2: false,
        },
      ],
      optionsThree: [
        {
          label3: "正常",
          value3: true,
        },
        {
          label3: "限制提现",
          value3: false,
        },
      ],
      optionsFous: [
        {
          label: "已认证",
          value: true,
        },
        {
          label: "未认证",
          value: false,
        },
      ],
      dataRule: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          // { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        userLevel: [
          { required: true, message: "评分不能为空", trigger: "blur" },
          { validator: validateuserLevel, trigger: "blur" },
          // { pattern: /\s\S+|S+\s|\S/, message: '请输入正确的用户名', trigger: 'blur' }
        ],
        // email: [
        //   { required: true, message: '邮箱不能为空', trigger: 'blur' },
        //   { validator: validateEmail, trigger: 'blur' }
        // ],
        // mobile: [
        //   { required: true, message: '手机号不能为空', trigger: 'blur' },
        //   { validator: validateMobile, trigger: 'blur' }
        // ]
      },
    };
  },
  methods: {
    init(row, id) {
      this.dataForm.remarks = "";
      this.resClear();
      this.roleList = row || {};
      this.id = id || "";
      if (row) {
        this.dataForm.username = row.userName;
        this.options.value1 = row.loginAuthority;
        this.optionsTwo.value2 = row.enabled;
        this.optionsThree.value3 = row.withdrawAuthority;
        this.dataForm.userLevel = row.userLevel;
        this.dataForm.realNameAuthority = row.realNameAuthority;
        this.dataForm.remarks = row.remarks;
        this.dataForm.realName = row.realName || "";
        this.dataForm.idNumber = row.idNumber || "";
        this.dataForm.userMail = row.userMail || "";
        this.dataForm.idFrontImg = row.idFrontImg || "";
        this.dataForm.idBackImg = row.idBackImg || "";
      } else {
        this.options.value1 = this.options[0].value1;
        this.optionsTwo.value2 = this.optionsTwo[0].value2;
      }
      this.visible = true;
      this.$nextTick(() => {
        //this.$refs.dataForm.resetFields()
      });
    },
    resClear() {
      this.dataForm = {
        parentsUseCode: "",
        remarks: "",
        username: "",
        password: "",
        email: "",
        mobile: "",
        userLevel: "",
        realNameAuthority: "",
        realName: "",
        idNumber: "",
        userMail: "",
        idFrontImg: "",
        idBackImg: "",
      };
    },
    changeVal(val) {
      this.$forceUpdate();
    },
    handClose() {
      this.$data.dataForm = JSON.parse(
        JSON.stringify(this.$options.data().dataForm)
      );
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); // 清除表单验证
      });
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if(isNaN(this.dataForm.userLevel)){
            this.dataForm.userLevel = "";
          }else if(this.dataForm.userLevel%1!==0){
            this.dataForm.userLevel = "";
          }

          if (this.id) {
            this.$http({
              url: this.$http.adornUrl(`/userData/update`), //修改
              method: "post",
              data: this.$http.adornData({
                enabled: this.optionsTwo.value2,
                loginAuthority: this.options.value1,
                withdrawAuthority: this.optionsThree.value3,
                userId: this.roleList.userId,
                remarks: this.dataForm.remarks,
                userLevel: this.dataForm.userLevel,
                realNameAuthority:this.dataForm.realNameAuthority,
                userName: this.dataForm.username,
                name: this.dataForm.realName,
                idNumber: this.dataForm.idNumber,
                mail: this.dataForm.userMail,
                idFrontImg: this.dataForm.idFrontImg,
                idBackImg: this.dataForm.idBackImg
              }),
            }).then(({ data }) => {
              if (data.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.resClear();
                    this.visible = false;
                    this.$emit("refreshDataList");
                  },
                });
              } else {
                this.$message({
                  message: data.msg,
                  type: "error",
                });
              }
            });
          } else {
            this.$http({
              url: this.$http.adornUrl(`/userData/add`), //新增
              method: "post",
              data: this.$http.adornData({
                username: this.dataForm.username,
                enabled: this.optionsTwo.value2,
                loginAuthority: this.options.value1,
                parentsUseCode: this.dataForm.parentsUseCode,
                password: encrypt(this.dataForm.password),
                remarks: this.dataForm.remarks,
                userLevel: this.dataForm.userLevel,
              }),
            }).then(({ data }) => {
              if (data.code == 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.resClear();
                    this.visible = false;
                    this.$emit("refreshDataList");
                  },
                });
              } else {
                this.$message({
                  message: data.msg,
                  type: "error",
                });
              }
            });
          }
        }
      });
    }),
    // 上传前验证
    beforeUpload(file, type) {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImage) {
        this.$message.error('只能上传图片文件!');
        return false;
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!');
        return false;
      }
      
      // 设置上传状态
      if (type === 'front') {
        this.frontUploading = true;
      } else {
        this.backUploading = true;
      }
      
      return true;
    },
    // 上传成功处理
    handleUploadSuccess(res, file, type) {
      if (type === 'front') {
        this.frontUploading = false;
      } else {
        this.backUploading = false;
      }

      if (res.code === 0 && res.succeed) {
        this.$message.success('图片上传成功');
        const imageUrl = res.data.httpUrl || res.data.path;
        if (type === 'front') {
          this.dataForm.idFrontImg = imageUrl;
        } else {
          this.dataForm.idBackImg = imageUrl;
        }
      } else {
        this.$message.error(res.msg || '上传失败');
      }
    },
    // 上传失败处理
    handleUploadError(err, file, type) {
      if (type === 'front') {
        this.frontUploading = false;
      } else {
        this.backUploading = false;
      }
      this.$message.error('图片上传失败，请重试');
      console.error('上传错误:', err);
    },
  },
};
</script>
<style scoped>
.inpspase {
  width: 560px;
}
</style>
