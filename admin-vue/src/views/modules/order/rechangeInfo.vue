<template>
  <el-dialog
    :title="type=='n'? '人工充值' : '驳回'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item v-if="type=='n'" label="币种"  prop="coin">
        <el-input v-model="dataForm.coin" disabled placeholder="用户充值币种"></el-input>
      </el-form-item>
      <el-form-item  v-if="type=='n'" label="充值数量"  prop="amount">
        <el-input v-model="dataForm.amount" type="number" placeholder="充值币种数量"></el-input>
      </el-form-item>
      <el-form-item v-if="type=='n'" label="资金密码"  prop="safePasssword">
        <el-input v-model="dataForm.safePasssword" type="password" placeholder="资金密码"></el-input>
      </el-form-item>
      <el-form-item v-if="type=='m'" label="原因"  prop="content">
        <el-input type="textarea" v-model="dataForm.content"></el-input>
      </el-form-item>
      <!-- 备注相关 -->
      <el-divider v-if="type=='n'" content-position="left">备注信息</el-divider>
      <el-form-item v-if="type=='n'" label="备注" prop="remarks">
        <el-input 
          type="textarea" 
          v-model="dataForm.remarks" 
          placeholder="请输入备注内容（非必填）"
          :rows="3"
          maxlength="200"
          show-word-limit>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="type=='n'" type="success" @click="saveRemarks()" :loading="remarksLoading">保存备注</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isEmail, isMobile } from '@/utils/validate'
  import { Debounce } from '@/utils/debounce'
  import { encrypt } from '@/utils/crypto'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateAmount = (rule, value, callback) => {
        if (value<0) {
          callback(new Error('充值数量不能小于0'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        id:'',
        type:'',//n.手动转   m驳回
        dataForm: {
          amount: '',
          safePasssword: '',
          coin:'',
          content:'',
          amount:'',
          remarks: '',
          //channelAmount
        },
        remarksLoading: false,
        dataRule: {
          amount: [
            { required: true, message: '充值数量不能为空', trigger: 'blur' },
            { validator: validateAmount, trigger: 'blur' }
          ],
          safePasssword: [
          { required: true, message: '资金密码不能为空', trigger: 'blur' },
          ],
          // 驳回原因允许为空，未填写时默认传 "无"
          content: [],
          // email: [
          //   { required: true, message: '邮箱不能为空', trigger: 'blur' },
          //   { validator: validateEmail, trigger: 'blur' }
          // ],
          // mobile: [
          //   { required: true, message: '手机号不能为空', trigger: 'blur' }
          // ]
        }
      }
    },
    methods: {
      init (type,id,coin,channelAmount) {
        this.dataForm.content= ''
        this.resClear()
        this.id = id || ''
        this.type = type || ''
        this.dataForm.amount = channelAmount
        if(coin){
          this.dataForm.coin = coin
        }
        this.visible = true
        this.$nextTick(() => {
        //this.$refs.dataForm.resetFields()  
      })
      },
      resClear(){
        this.dataForm = {
          amount: '',
          safePasssword: '',
          coin:'',
          content:'',
          remarks: '',
        }
      },
      // 表单提交
      dataFormSubmit: Debounce(function () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(this.type == 'n'){
              this.$http({
              url: this.$http.adornUrl(`/rechargeOrder/manualReceipt`), //人工
              method: 'post',
              data: this.$http.adornData({
                'id': this.id,
                'safePasssword':encrypt(this.dataForm.safePasssword),
                'amount': this.dataForm.amount,
              })
            }).then(({data}) => {
              if(data.code == 0){
                  this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.resClear()
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              }else{
                this.$message({
                  message: data.msg,
                  type: 'error',
                })
              }

            })
            }else{
              this.$http({
              url: this.$http.adornUrl(`/rechargeOrder/refusalApply`), //驳回
              method: 'post',
              data: this.$http.adornData({
                'id': this.id,
                'content': (this.dataForm.content || '').trim() || '无',
              })
            }).then(({data}) => {
              if(data.code == 0){
                  this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.resClear()
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              }else{
                this.$message({
                  message: data.msg,
                  type: 'error',
                })
              }

            })
            }
          }
        })
      }),
      // 保存备注
      saveRemarks() {
        console.log('保存备注方法被调用', {
          id: this.id,
          remarks: this.dataForm.remarks,
          timestamp: Date.now()
        })
        this.remarksLoading = true
        
        const requestData = {
          id: this.id,
          remarks: this.dataForm.remarks || '',
          t: Date.now()
        }
        
        console.log('准备发送请求:', {
          url: '/rechargeOrder/remarks',
          data: requestData
        })
        
        this.$http({
          url: this.$http.adornUrl('/rechargeOrder/remarks'),
          method: 'post',
          data: this.$http.adornData(requestData)
        }).then(({ data }) => {
          console.log('API响应:', data)
          this.remarksLoading = false
          if (data && data.code === 0) {
            this.$message({
              message: '备注保存成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$message({
              message: data.msg || '备注保存失败',
              type: 'error',
              duration: 1500
            })
          }
        }).catch((error) => {
          this.remarksLoading = false
          console.error('保存备注失败:', error)
          console.error('错误详情:', {
            message: error.message,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data
          })
          this.$message({
            message: '备注保存失败，请重试',
            type: 'error',
            duration: 1500
          })
        })
      }
    }
  }
</script>