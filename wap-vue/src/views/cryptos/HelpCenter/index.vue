<template>
  <div id="cryptos">
    <div class="helpCenter">
      <assets-head :title="$t('帮助中心')" />
      <div class="content">
        <div class="item" v-for="(item, index) in listArr" :key="index" @click="$router.push({
          path: '/helpDetail',
          query: { // 这个位置把参数都带过去
            ...item
          }
        })">
          <span class="textColor">{{ item.title }}</span>
          <div class="moreBox"><img src="@/assets/image/userCenter/more.png" alt=""></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, showToast } from 'vant';
import assetsHead from "@/components/Transform/assets-head/index.vue";
import { _helpCenter } from "@/service/user.api"

export default {
  name: "helpCenter",
  components: {
    [Icon.name]: Icon,
    assetsHead
  },
  data() {
    return {
      listArr: [],
      useFallbackContent: false, // 控制是否使用备选内容
      apiLoadTimeout: null,      // API超时控制
    }
  },
  mounted() {
    this.getHelpCenter()
  },
  beforeUnmount() {
    // 清理超时定时器
    if (this.apiLoadTimeout) {
      clearTimeout(this.apiLoadTimeout)
    }
  },
  methods: {
    onClickLeft() {
      this.$router.push('/')
    },
    getHelpCenter() {
      // 设置5秒超时
      this.apiLoadTimeout = setTimeout(() => {
        console.log('帮助中心API请求超时，使用备选内容')
        this.useFallbackContent = true
        this.loadFallbackContent()
      }, 5000)

      _helpCenter({
        model: 'help_center',
        language: this.$i18n.locale,
      }).then((res) => {
        if (this.apiLoadTimeout) {
          clearTimeout(this.apiLoadTimeout)
        }
        if (res && res.length > 0) {
          this.listArr = res
          this.useFallbackContent = false
          console.log('帮助中心API内容加载成功')
        } else {
          console.log('帮助中心API返回内容为空，使用备选内容')
          this.useFallbackContent = true
          this.loadFallbackContent()
        }
      }).catch((error) => {
        if (this.apiLoadTimeout) {
          clearTimeout(this.apiLoadTimeout)
        }
        console.error('帮助中心API请求失败，使用备选内容:', error)
        this.useFallbackContent = true
        this.loadFallbackContent()
        if (error.code !== 'ECONNABORTED') {
          if (error.msg !== undefined) { 
            showToast(this.$t(error.msg)); 
          }
        }
      });
    },
    loadFallbackContent() {
      // 加载备选静态内容
      this.listArr = [
        {
          title: this.$t('常见问题'),
          content: this.$t('help_faq_content'),
          id: 'faq'
        },
        {
          title: this.$t('账户安全'),
          content: this.$t('help_account_security_content'),
          id: 'security'
        },
        {
          title: this.$t('交易指南'),
          content: this.$t('help_trading_guide_content'),
          id: 'trading'
        },
        {
          title: this.$t('充值提现'),
          content: this.$t('help_deposit_withdraw_content'),
          id: 'deposit'
        },
        {
          title: this.$t('技术支持'),
          content: this.$t('help_technical_support_content'),
          id: 'technical'
        }
      ]
    },
  }

}
</script>

<style lang="scss" scoped>
#cryptos {
  .helpCenter {
    width: 100%;
    box-sizing: border-box;
  }

  .content {
    font-size: 28px;
    padding: 0 32px;
  }

  .item {
    padding: 35px 0;
    text-decoration: underline;
    display: flex;
    justify-content: space-between;
  }

  .moreBox {
    width: 26px;
    height: 26px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>