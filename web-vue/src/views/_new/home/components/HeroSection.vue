<template>
  <section class="hero-section">
    <div class="container">
      <div class="hero-content">
        <!-- 主标题 -->
        <h1 class="hero-title">
          {{ $t('newHome.hero.title1') }}<br />
          {{ $t('newHome.hero.title2') }}
          <span class="highlight">{{ $t('newHome.hero.titleHighlight') }}</span>
        </h1>

        <!-- 副标题 -->
        <div class="hero-subtitle">
          <el-icon class="gift-icon"><Gift /></el-icon>
          <span>{{ $t('newHome.hero.registerReward') }}</span>
        </div>

        <!-- 注册表单 -->
        <div class="hero-form">
          <el-input
            v-model="email"
            :placeholder="$t('newHome.hero.emailPlaceholder')"
            class="email-input"
            size="large"
            @keyup.enter="handleRegister"
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
          <el-button
            class="btn-start"
            size="large"
            :loading="loading"
            @click="handleRegister"
          >
            {{ $t('newHome.hero.startNow') }}
          </el-button>
        </div>

        <!-- 下载图标 -->
        <div class="download-icons">
          <a
            v-for="platform in platforms"
            :key="platform.name"
            :href="platform.url"
            target="_blank"
            class="platform-link"
            :title="platform.name"
          >
            <div class="icon-wrapper">
              <el-icon><component :is="platform.icon" /></el-icon>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Gift, Message } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();

const email = ref('');
const loading = ref(false);

const platforms = ref([
  {
    name: 'Apple App Store',
    url: 'https://apps.apple.com/app/coinstore',
    icon: 'Apple'
  },
  {
    name: 'Google Play',
    url: 'https://play.google.com/store/apps/details?id=com.coinstore',
    icon: 'Platform'
  },
  {
    name: 'APK Direct',
    url: 'https://coinstore.com/download',
    icon: 'Download'
  }
]);

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const handleRegister = async () => {
  if (!email.value) {
    ElMessage.warning(t('newHome.hero.emailRequired'));
    return;
  }

  if (!validateEmail(email.value)) {
    ElMessage.error(t('newHome.hero.emailInvalid'));
    return;
  }

  loading.value = true;

  try {
    // TODO: 调用注册 API
    // await registerAPI({ email: email.value });

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 跳转到注册页面，带上邮箱参数
    router.push({
      path: '/register',
      query: { email: email.value }
    });
  } catch (error) {
    ElMessage.error(t('common.error'));
    console.error('Registration error:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.hero-section {
  background: $bg-hero;
  padding: $spacing-5xl 0;
  min-height: calc(100vh - $header-height);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-4xl 0;
    min-height: auto;
  }

  // 背景装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba($primary-color, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .container {
    position: relative;
    z-index: 1;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .hero-title {
    font-size: $font-size-7xl;
    font-weight: $font-weight-bold;
    color: $color-black;
    line-height: 1.1;
    margin-bottom: $spacing-xl;

    @media (max-width: $breakpoint-lg) {
      font-size: $font-size-6xl;
    }

    @media (max-width: $breakpoint-md) {
      font-size: $font-size-5xl;
    }

    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-4xl;
    }

    .highlight {
      color: $primary-color;
      background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .hero-subtitle {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-lg;
    background: rgba($primary-color, 0.1);
    border-radius: $radius-full;
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
    margin-bottom: $spacing-3xl;

    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-base;
      padding: $spacing-xs $spacing-md;
    }

    .gift-icon {
      font-size: 24px;
      color: $primary-color;
    }
  }

  .hero-form {
    display: flex;
    gap: $spacing-md;
    max-width: 600px;
    margin: 0 auto $spacing-2xl;

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
    }

    .email-input {
      flex: 1;

      :deep(.el-input__wrapper) {
        background: $bg-white;
        border-radius: $radius-md;
        padding: $spacing-md $spacing-lg;
        box-shadow: $shadow-sm;
        transition: all $transition-base;

        &:hover,
        &.is-focus {
          box-shadow: $shadow-md;
        }
      }

      :deep(.el-input__inner) {
        font-size: $font-size-base;
      }
    }

    .btn-start {
      background: $color-black;
      color: $color-white;
      border: none;
      border-radius: $radius-md;
      padding: 0 $spacing-3xl;
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      white-space: nowrap;
      transition: all $transition-base;

      &:hover {
        background: #333;
        transform: translateY(-2px);
        box-shadow: $shadow-lg;
      }

      &:active {
        transform: translateY(0);
      }

      @media (max-width: $breakpoint-sm) {
        width: 100%;
        padding: $spacing-md $spacing-xl;
      }
    }
  }

  .download-icons {
    display: flex;
    justify-content: center;
    gap: $spacing-lg;
    flex-wrap: wrap;

    .platform-link {
      text-decoration: none;
      transition: transform $transition-base;

      &:hover {
        transform: translateY(-4px);

        .icon-wrapper {
          background: $primary-color;
          color: $color-white;
        }
      }

      .icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: $bg-white;
        box-shadow: $shadow-md;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all $transition-base;

        @media (max-width: $breakpoint-sm) {
          width: 48px;
          height: 48px;
        }

        .el-icon {
          font-size: 28px;
          color: $color-text-primary;

          @media (max-width: $breakpoint-sm) {
            font-size: 24px;
          }
        }
      }
    }
  }
}
</style>
