<template>
  <div class="more-page" style="min-height: 100vh; padding: 24px 0; background: #0a0a0a; color: white;">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 16px;">
      <h1 class="page-title" style="text-align: center; margin-bottom: 48px; color: white;">{{ $t('more.title') }}</h1>
      
      <!-- 功能菜单 -->
      <div class="menu-sections">
        <!-- 交易相关 -->
        <div class="menu-section">
          <h3 class="section-title" style="color: #ffd700; font-size: 18px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #333;">{{ $t('more.tradingServices') }}</h3>
          <div class="menu-items">
            <div class="menu-item" @click="goToTrading('forex')">
              <div class="menu-icon" style="background: linear-gradient(135deg, #1e40af, #3b82f6);">
                <SvgIcon name="forex" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.forexTrading') }}</h4>
                <p>{{ $t('more.forexDesc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>

            <div class="menu-item" @click="goToTrading('crypto')">
              <div class="menu-icon" style="background: linear-gradient(135deg, #f59e0b, #f97316);">
                <SvgIcon name="crypto" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.cryptocurrency') }}</h4>
                <p>{{ $t('more.cryptoDesc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>

            <div class="menu-item" @click="goToTrading('stocks')">
              <div class="menu-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                <SvgIcon name="stocks" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.stockTrading') }}</h4>
                <p>{{ $t('more.stockDesc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>
          </div>
        </div>

        <!-- 平台服务 -->
        <div class="menu-section">
          <h3 class="section-title" style="color: #ffd700; font-size: 18px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #333;">{{ $t('more.platformServices') }}</h3>
          <div class="menu-items">
            <div class="menu-item" @click="goToPlatform">
              <div class="menu-icon" style="background: linear-gradient(135deg, #8b5cf6, #a855f7);">
                <SvgIcon name="platform" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.mt5Platform') }}</h4>
                <p>{{ $t('more.mt5Desc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>

            <div class="menu-item" @click="goToEducation">
              <div class="menu-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                <SvgIcon name="education" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.educationCenter') }}</h4>
                <p>{{ $t('more.educationDesc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>

            <div class="menu-item" @click="goToAnalysis">
              <div class="menu-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                <SvgIcon name="analysis" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.marketAnalysis') }}</h4>
                <p>{{ $t('more.analysisDesc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>
          </div>
        </div>

        <!-- 账户管理 -->
        <div class="menu-section">
          <h3 class="section-title" style="color: #ffd700; font-size: 18px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #333;">{{ $t('more.accountManagement') }}</h3>
          <div class="menu-items">
            <div class="menu-item" @click="goToLogin">
              <div class="menu-icon" style="background: linear-gradient(135deg, #1e40af, #3b82f6);">
                <SvgIcon name="login" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.login') }}</h4>
                <p>{{ $t('more.loginDesc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>

            <div class="menu-item" @click="goToRegister">
              <div class="menu-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                <SvgIcon name="register" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.register') }}</h4>
                <p>{{ $t('more.registerDesc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>

            <div class="menu-item" @click="goToSupport">
              <div class="menu-icon" style="background: linear-gradient(135deg, #f59e0b, #f97316);">
                <SvgIcon name="support" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.support') }}</h4>
                <p>{{ $t('more.supportDesc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>
          </div>
        </div>

        <!-- 设置选项 -->
        <div class="menu-section">
          <h3 class="section-title" style="color: #ffd700; font-size: 18px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #333;">{{ $t('more.settings') }}</h3>
          <div class="menu-items">
            <div class="menu-item" @click="openLanguageSelector">
              <div class="menu-icon" style="background: linear-gradient(135deg, #8b5cf6, #a855f7);">
                <SvgIcon name="language" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.language') }}</h4>
                <p>{{ $t('more.languageDesc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>

            <div class="menu-item" @click="goToAbout">
              <div class="menu-icon" style="background: linear-gradient(135deg, #6b7280, #4b5563);">
                <SvgIcon name="about" :size="20" color="white" />
              </div>
              <div class="menu-content">
                <h4>{{ $t('more.about') }}</h4>
                <p>{{ $t('more.aboutDesc') }}</p>
              </div>
              <SvgIcon name="arrow-right" :size="16" color="rgba(255, 255, 255, 0.5)" class="arrow-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 语言选择器 -->
    <LanguageSelector
      :visible="showLanguageSelector"
      @close="closeLanguageSelector"
      @language-changed="handleLanguageChanged"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSelector from '@/components/LanguageSelector.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import config from '@/config'

const router = useRouter()
const { t } = useI18n()

// 语言选择器状态
const showLanguageSelector = ref(false)

// 跳转到交易页面
const goToTrading = (type) => {
  router.push(`/trading/${type}`);
};

// 跳转到平台页面
const goToPlatform = () => {
  router.push('/platform');
};

// 跳转到教育页面
const goToEducation = () => {
  router.push('/education');
};

// 跳转到分析页面
const goToAnalysis = () => {
  router.push('/analysis');
};

// 跳转到登录页面
const goToLogin = () => {
  window.location.href = config.URLS.LOGIN();
};

// 跳转到注册页面
const goToRegister = () => {
  window.location.href = config.URLS.REGISTER();
};

// 跳转到支持页面
const goToSupport = () => {
  router.push('/support');
};

// 打开语言选择器
const openLanguageSelector = () => {
  showLanguageSelector.value = true
}

// 关闭语言选择器
const closeLanguageSelector = () => {
  showLanguageSelector.value = false
}

// 处理语言变更
const handleLanguageChanged = (newLanguage) => {
  console.log('语言已切换到:', newLanguage)
  // 可以在这里添加额外的语言切换后处理逻辑
  // 比如刷新页面数据、更新用户偏好设置等
}

// 跳转到关于页面
const goToAbout = () => {
  router.push('/about');
};
</script>

<style scoped>
.more-page {
  min-height: 100vh;
  padding: 24px 0;
  background: #0a0a0a;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.page-title {
  text-align: center;
  margin-bottom: 48px;
  color: white;
}

.menu-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.menu-section {
  margin-bottom: 32px;
}

.section-title {
  color: #ffd700;
  font-size: 18px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #1a1a1a;
  border-radius: 12px;
  border: 1px solid #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: #222;
  transform: translateX(4px);
}

.menu-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.menu-icon i {
  font-size: 20px;
  color: white;
}

.menu-content {
  flex: 1;
}

.menu-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: white;
}

.menu-content p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.arrow-icon {
  transition: all 0.3s ease;
}

.menu-item:hover .arrow-icon {
  color: #ffd700 !important;
  transform: translateX(4px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 12px;
  }

  .menu-sections {
    gap: 24px;
  }

  .menu-item {
    padding: 12px;
  }

  .menu-icon {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }

  .menu-icon i {
    font-size: 18px;
  }

  .menu-content h4 {
    font-size: 15px;
  }

  .menu-content p {
    font-size: 13px;
  }
}
</style>