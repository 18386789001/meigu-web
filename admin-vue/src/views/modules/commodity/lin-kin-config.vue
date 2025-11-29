<template>
  <el-dialog
    title="行情K线设置"
    :visible.sync="visible"
    width="800px"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <div class="lin-kin-config">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-form-item label="交易对选择" prop="symbols">
          <el-select
            v-model="dataForm.symbols"
            multiple
            placeholder="请选择交易对"
            style="width: 100%"
          >
            <el-option
              v-for="item in symbolOptions"
              :key="item.symbol"
              :label="item.name"
              :value="item.symbol"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="K线类型" prop="klineType">
          <el-select v-model="dataForm.klineType" placeholder="请选择K线类型" style="width: 100%">
            <el-option label="1分钟" value="1min"></el-option>
            <el-option label="5分钟" value="5min"></el-option>
            <el-option label="15分钟" value="15min"></el-option>
            <el-option label="30分钟" value="30min"></el-option>
            <el-option label="1小时" value="1hour"></el-option>
            <el-option label="4小时" value="4hour"></el-option>
            <el-option label="1天" value="1day"></el-option>
            <el-option label="1周" value="1week"></el-option>
            <el-option label="1月" value="1month"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="数据源" prop="dataSource">
          <el-select v-model="dataForm.dataSource" placeholder="请选择数据源" style="width: 100%">
            <el-option label="默认数据源" value="default"></el-option>
            <el-option label="备用数据源" value="backup"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="启用状态" prop="status">
          <el-switch
            v-model="dataForm.status"
            active-text="启用"
            inactive-text="禁用"
          ></el-switch>
        </el-form-item>
      </el-form>
    </div>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="submitLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'LinKinConfig',
  data() {
    return {
      visible: false,
      submitLoading: false,
      symbolOptions: [],
      dataForm: {
        symbols: [],
        klineType: '1min',
        dataSource: 'default',
        status: true
      },
      dataRule: {
        symbols: [
          { required: true, message: '请选择交易对', trigger: 'change' }
        ],
        klineType: [
          { required: true, message: '请选择K线类型', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请选择数据源', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init(symbols) {
      this.visible = true
      this.symbolOptions = symbols || []
      this.dataForm = {
        symbols: [],
        klineType: '1min',
        dataSource: 'default',
        status: true
      }
    },
    closeDialog() {
      this.visible = false
      this.$refs.dataForm.resetFields()
    },
    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          
          // 模拟API调用
          setTimeout(() => {
            this.$message({
              message: 'K线设置保存成功',
              type: 'success',
              duration: 1500
            })
            this.submitLoading = false
            this.visible = false
            this.$emit('refreshDataList')
          }, 1000)
          
          // 实际API调用示例
          /*
          this.$http({
            url: this.$http.adornUrl('/api/kline/config'),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            if (data.code === 0) {
              this.$message({
                message: 'K线设置保存成功',
                type: 'success',
                duration: 1500
              })
              this.visible = false
              this.$emit('refreshDataList')
            } else {
              this.$message({
                message: data.msg || '操作失败',
                type: 'error',
                duration: 1500
              })
            }
            this.submitLoading = false
          }).catch(() => {
            this.submitLoading = false
          })
          */
        }
      })
    }
  }
}
</script>

<style scoped>
.lin-kin-config {
  padding: 20px 0;
}
</style>
