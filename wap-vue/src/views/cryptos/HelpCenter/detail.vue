<template>
  <div id="cryptos">
    <div class="CommonProblem">
      <assets-head :title="$t('问题详情')"></assets-head>
      <div class="text-32 px-8 mt-9 box-border textColor">
        {{ data.title }}
      </div>
      <!--    页面上有br标签，说明这一段是html，这里需要使用到vue的v-html指令-->
      <div class="text-32 px-8 mt-9 box-border textColor" v-html="data.content">
      </div>
    </div>
  </div>
</template>

<script>
import assetsHead from '@/components/Transform/assets-head/index.vue'
export default {
  name: "HelpDetail",
  components: {
    assetsHead
  },
  data() {
    return {
      data: null,
      useFallbackContent: false, // 控制是否使用备选内容
    }
  },
  created() {
    this.data = this.$route.query
    // 检查是否来自备选内容
    if (this.data && this.data.id) {
      this.loadFallbackContent()
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push('/helpCenter')
    },
    loadFallbackContent() {
      // 根据ID加载对应的备选内容
      const fallbackContents = {
        'faq': {
          title: this.$t('常见问题'),
          content: this.$t('help_faq_detail_content')
        },
        'security': {
          title: this.$t('账户安全'),
          content: this.$t('help_account_security_detail_content')
        },
        'trading': {
          title: this.$t('交易指南'),
          content: this.$t('help_trading_guide_detail_content')
        },
        'deposit': {
          title: this.$t('充值提现'),
          content: this.$t('help_deposit_withdraw_detail_content')
        },
        'technical': {
          title: this.$t('技术支持'),
          content: this.$t('help_technical_support_detail_content')
        }
      }
      
      if (this.data.id && fallbackContents[this.data.id]) {
        this.useFallbackContent = true
        this.data = {
          ...this.data,
          ...fallbackContents[this.data.id]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#cryptos {
  .Problem_detail {

    .detail_title {
      text-decoration: underline;
    }
  }
}
</style>