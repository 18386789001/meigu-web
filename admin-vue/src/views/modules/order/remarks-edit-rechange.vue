<template>
  <el-dialog
    title="编辑备注"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px"
    @close="handleClose"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="80px"
    >
      <el-form-item label="订单号" prop="orderNo">
        <el-input v-model="dataForm.orderNo" disabled></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="dataForm.remarks"
          type="textarea"
          :rows="4"
          placeholder="请输入备注内容"
          maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave" :loading="saveLoading">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      saveLoading: false,
      dataForm: {
        uuid: '',
        orderNo: '',
        remarks: ''
      },
      dataRule: {
        remarks: [
          { max: 200, message: '备注内容不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(row) {
      this.dataForm.uuid = row.uuid
      this.dataForm.orderNo = row.orderNo || ''
      this.dataForm.remarks = row.description || ''
      this.visible = true
    },
    handleClose() {
      this.visible = false
      this.dataForm = {
        uuid: '',
        orderNo: '',
        remarks: ''
      }
    },
    handleCancel() {
      this.visible = false
    },
    handleSave() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          this.$http({
            url: this.$http.adornUrl('/rechargeOrder/remarks'),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.uuid,
              remarks: this.dataForm.remarks,
              t: Date.now()
            })
          }).then(({ data }) => {
            this.saveLoading = false
            if (data && data.code === 0) {
              this.$message({
                message: '备注保存成功',
                type: 'success',
                duration: 1500
              })
              this.visible = false
              // 触发父组件刷新数据
              this.$emit('refreshDataList')
            } else {
              this.$message({
                message: data.msg || '备注保存失败',
                type: 'error',
                duration: 1500
              })
            }
          }).catch((error) => {
            this.saveLoading = false
            console.error('保存备注失败:', error)
            this.$message({
              message: '备注保存失败，请重试',
              type: 'error',
              duration: 1500
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding: 20px 20px 10px 20px;
}

::v-deep .el-textarea__inner {
  resize: vertical;
}
</style>
