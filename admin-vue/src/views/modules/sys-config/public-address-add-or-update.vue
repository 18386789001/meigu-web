<template>
  <el-dialog
    :title="dialogTitle"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="币种" prop="coin">
        <el-select v-model="dataForm.coin" placeholder="请选择币种">
          <el-option label="USDT" value="USDT"></el-option>
          <el-option label="BTC" value="BTC"></el-option>
          <el-option label="ETH" value="ETH"></el-option>
          <el-option label="TRX" value="TRX"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="币种链名称" prop="blockchainName">
        <el-input
          v-model="dataForm.blockchainName"
          placeholder="请输入币种链名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="充值地址" prop="address">
        <el-input
          v-model="dataForm.address"
          placeholder="请输入充值地址"
          type="textarea"
          :rows="3"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="dataForm.remark"
          placeholder="请输入备注信息"
          type="textarea"
          :rows="2"
        ></el-input>
      </el-form-item>
      <el-form-item label="二维码图片" prop="imgsrc">
        <el-upload
          class="qrcode-uploader"
          action="https://jpmx.xyz/apis/api/uploadFile"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeUpload"
          :headers="uploadHeaders"
          name="file"
        >
          <img v-if="dataForm.imgsrc" :src="dataForm.imgsrc" class="qrcode-image" />
          <i v-else class="el-icon-plus qrcode-uploader-icon"></i>
        </el-upload>
        <div class="upload-tips">支持jpg、png格式，建议尺寸200x200</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      isUpdate: false, // 新增标识，用于明确区分新增和修改
      dataForm: {
        id: null, // 改为null，更好地判断是否为新增
        coin: 'USDT', // 默认币种
        blockchainName: '',
        address: '',
        status: 1,
        remark: '',
        imgsrc: '' // 二维码图片地址
      },
      uploadHeaders: {}, // 上传请求头
      dataRule: {
        coin: [
          { required: true, message: '币种不能为空', trigger: 'change' }
        ],
        blockchainName: [
          { required: true, message: '币种链名称不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '充值地址不能为空', trigger: 'blur' }
        ],
        imgsrc: [
          { required: true, message: '请上传二维码图片', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    // 动态计算弹窗标题
    dialogTitle() {
      const title = this.isUpdate ? '修改地址' : '新增地址'
      console.log('🏷️ 计算弹窗标题:', title, '(isUpdate:', this.isUpdate, ')')
      return title
    }
  },
  watch: {
    // 监听isUpdate变化，确保标题正确更新
    isUpdate: {
      handler(newVal) {
        console.log('👀 isUpdate状态变化:', newVal, '新标题:', this.dialogTitle)
        // 强制更新视图
        this.$forceUpdate()
      },
      immediate: true
    }
  },
  methods: {
    init(id, rowData) {
      console.log('=== 弹窗初始化调试信息 ===')
      console.log('传入ID:', id, '类型:', typeof id)
      console.log('传入行数据:', rowData)
      console.log('ID转换为字符串:', String(id))
      console.log('ID转换为数字:', Number(id))

      // 更强的ID有效性判断
      const isValidId = this.isValidId(id)
      console.log('ID有效性判断结果:', isValidId)

      // 先设置isUpdate状态，这会影响弹窗标题的计算
      this.isUpdate = isValidId

      // 重置表单数据
      this.dataForm = {
        id: null,
        coin: 'USDT',
        blockchainName: '',
        address: '',
        status: 1,
        remark: '',
        imgsrc: ''
      }

      if (isValidId && rowData) {
        // 修改模式：填充行数据
        this.dataForm.id = id
        this.dataForm.coin = rowData.coin || 'USDT'
        this.dataForm.blockchainName = rowData.blockchainName || ''
        this.dataForm.address = rowData.address || ''
        this.dataForm.status = rowData.status !== undefined ? rowData.status : 1
        this.dataForm.remark = rowData.remark || ''
        this.dataForm.imgsrc = rowData.imgsrc || ''
        console.log('✅ 设置为修改模式 - ID:', this.dataForm.id)
        console.log('✅ 表单数据已填充:', this.dataForm)
      } else {
        // 新增模式
        console.log('✅ 设置为新增模式')
      }
      
      console.log('✅ isUpdate状态:', this.isUpdate)
      console.log('✅ 弹窗标题应该显示:', this.dialogTitle)
      console.log('=== 调试信息结束 ===')

      // 打开弹窗
      this.visible = true
      
      // 等待DOM更新后，只在新增模式时重置表单
      this.$nextTick(() => {
        if (this.$refs['dataForm']) {
          if (!this.isUpdate) {
            // 新增模式：重置表单到初始值
            this.$refs['dataForm'].resetFields()
          }
          // 编辑模式：不重置，保持已填充的数据
        }
      })
    },

    // 判断ID是否有效的辅助方法
    isValidId(id) {
      // 排除无效值
      if (id === null || id === undefined || id === '' || id === 'null' || id === 'undefined') {
        return false
      }

      // 排除数字0和字符串'0'
      if (id === 0 || id === '0') {
        return false
      }

      // 如果是字符串，需要检查是否有效
      if (typeof id === 'string') {
        // 如果是空字符串或只包含空白字符，无效
        if (id.trim() === '') {
          return false
        }
        // UUID格式或非空字符串都认为是有效的（包含字母、数字、连字符等）
        // 尝试转换为数字，如果不是NaN且大于0，则是有效的数字ID
        const num = Number(id)
        if (!isNaN(num) && num > 0) {
          return true
        }
        // 对于非数字字符串（如UUID），只要不是空字符串就认为有效
        return id.length > 0
      }

      // 如果是数字，检查是否大于0
      if (typeof id === 'number') {
        return id > 0
      }

      // 其他情况认为有效
      return true
    },
    // 获取信息
    getInfo() {
      console.log('📞 调用获取详情API，ID:', this.dataForm.id)
      this.$http({
        url: this.$http.adornUrl(`/channelBlockchain/info/${this.dataForm.id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        console.log('📋 获取详情API响应:', data)
        if (data && data.code === 0) {
          // 根据后端实体类结构，确保正确映射字段
          const responseData = data.data
          this.dataForm.coin = responseData.coin || 'USDT'
          this.dataForm.blockchainName = responseData.blockchainName || ''
          this.dataForm.address = responseData.address || ''
          this.dataForm.status = responseData.status !== undefined ? responseData.status : 1
          this.dataForm.remark = responseData.remark || ''
          this.dataForm.imgsrc = responseData.imgsrc || ''

          console.log('✅ 数据加载成功:', this.dataForm)
        } else {
          console.error('❌ 获取数据失败:', data.msg)
          this.$message.error(data.msg || '获取数据失败')
        }
      }).catch((error) => {
        console.error('❌ 获取详情API调用失败:', error)
        this.$message.error('获取数据失败，请稍后重试')
      })
    },
    // 表单提交
    dataFormSubmit() {
      console.log('表单提交开始')
      console.log('当前表单数据:', this.dataForm)

      this.$refs['dataForm'].validate((valid) => {
        console.log('表单验证结果:', valid)

        if (valid) {
          // 使用isUpdate标识判断操作类型
          const apiUrl = this.isUpdate ? '/channelBlockchain/update' : '/channelBlockchain/add'

          console.log('操作类型:', this.isUpdate ? '修改' : '新增')
          console.log('API URL:', apiUrl)

          const requestData = {
            'coin': this.dataForm.coin,
            'blockchainName': this.dataForm.blockchainName,
            'address': this.dataForm.address,
            'status': this.dataForm.status,
            'remark': this.dataForm.remark,
            'imgsrc': this.dataForm.imgsrc, // 二维码图片地址
            'safeword': '', // 资金密码，暂时为空
            // 'superGoogleAuthCode': '' // 超级谷歌验证码，暂时为空
          }

          // 修改时需要传递ID
          if (this.isUpdate) {
            requestData.id = this.dataForm.id
            console.log('修改模式 - 传递ID:', requestData.id)
          }

          console.log('📤 最终请求数据:', JSON.stringify(requestData, null, 2))

          // 修改接口使用完整URL: https://jpmx.xyz/apis/channelBlockchain/update
          let fullUrl = apiUrl
          if (this.isUpdate) {
            fullUrl = 'https://jpmx.xyz/apis/channelBlockchain/update'
            console.log('使用完整URL:', fullUrl)
          }

          this.$http({
            url: this.isUpdate ? fullUrl : this.$http.adornUrl(apiUrl),
            method: 'post',
            data: this.isUpdate ? requestData : this.$http.adornData(requestData)
          }).then(({ data }) => {
            console.log('API响应:', data)

            if (data && data.code === 0) {
              this.$message({
                message: this.isUpdate ? '修改成功' : '新增成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg || '操作失败')
            }
          }).catch((error) => {
            console.error('API调用失败:', error)
            this.$message.error('网络请求失败，请稍后重试')
          })
        } else {
          console.log('表单验证失败')
          this.$message.error('请检查表单输入')
        }
      })
    },
    // 上传前验证
    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
      return true
    },
    // 上传成功
    handleUploadSuccess(response, file) {
      console.log('上传成功响应:', response)
      if (response && response.code === 0) {
        // 从返回的对象中提取 httpUrl 或 path
        const imageUrl = response.data?.httpUrl || response.data?.path || response.data
        this.dataForm.imgsrc = imageUrl
        console.log('保存的图片URL:', imageUrl)
        this.$message.success('上传成功')
        // 手动触发表单验证
        this.$refs['dataForm'].validateField('imgsrc')
      } else {
        this.$message.error(response.msg || '上传失败')
      }
    },
    // 上传失败
    handleUploadError(err, file) {
      console.error('上传失败:', err)
      this.$message.error('上传失败，请重试')
    }
  }
}
</script>
<style scoped>
.qrcode-uploader {
  display: inline-block;
}
.qrcode-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qrcode-uploader >>> .el-upload:hover {
  border-color: #409EFF;
}
.qrcode-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
.qrcode-image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: contain;
}
.upload-tips {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}
</style>
