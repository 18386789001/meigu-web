<template>
  <footer class="new-footer">
    <div class="container">
      <div class="footer-content">
        <!-- 左侧菜单列 -->
        <div class="footer-columns">
          <!-- 关于我们 -->
          <div class="footer-column">
            <h4 class="column-title">{{ $t('newHome.footer.aboutUs') }}</h4>
            <ul class="column-links">
              <li><a href="/about">{{ $t('newHome.footer.about') }}</a></li>
              <li><a href="/blog">{{ $t('newHome.footer.blog') }}</a></li>
              <li><a href="/partners">{{ $t('newHome.footer.partners') }}</a></li>
              <li><a href="/terms">{{ $t('newHome.footer.terms') }}</a></li>
              <li><a href="/privacy">{{ $t('newHome.footer.privacy') }}</a></li>
            </ul>
          </div>

          <!-- 资源 -->
          <div class="footer-column">
            <h4 class="column-title">{{ $t('newHome.footer.resources') }}</h4>
            <ul class="column-links">
              <li><a href="/quotes">{{ $t('newHome.footer.quotes') }}</a></li>
              <li><a href="/academy">{{ $t('newHome.footer.academy') }}</a></li>
              <li><a href="/community">{{ $t('newHome.footer.community') }}</a></li>
              <li><a href="/security">{{ $t('newHome.footer.security') }}</a></li>
              <li><a href="/fees">{{ $t('newHome.footer.fees') }}</a></li>
            </ul>
          </div>

          <!-- 帮助 -->
          <div class="footer-column">
            <h4 class="column-title">{{ $t('newHome.footer.help') }}</h4>
            <ul class="column-links">
              <li><a href="/support">{{ $t('newHome.footer.support') }}</a></li>
              <li><a href="/deposit">{{ $t('newHome.footer.deposit') }}</a></li>
              <li><a href="/withdraw">{{ $t('newHome.footer.withdraw') }}</a></li>
              <li><a href="/faq">{{ $t('newHome.footer.faq') }}</a></li>
              <li><a href="/api-docs">{{ $t('newHome.footer.apiDocs') }}</a></li>
            </ul>
          </div>

          <!-- 交易 -->
          <div class="footer-column">
            <h4 class="column-title">{{ $t('newHome.footer.trading') }}</h4>
            <ul class="column-links">
              <li v-for="pair in tradingPairs" :key="pair.symbol">
                <a :href="`/trade/${pair.symbol}`">{{ pair.symbol }}</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- 右侧区域 -->
        <div class="footer-right">
          <!-- Logo -->
          <img src="@/assets/images/logo.png" alt="Coinstore" class="footer-logo" />

          <!-- 语言选择 -->
          <div class="footer-lang">
            <LangSelect />
          </div>

          <!-- 二维码 -->
          <div class="footer-qr">
            <div class="qr-code">
              <!-- TODO: 添加实际二维码 -->
              <div class="qr-placeholder">QR Code</div>
            </div>
            <p class="qr-text">{{ $t('newHome.footer.scanToDownload') }}</p>
          </div>
        </div>
      </div>

      <!-- 社交媒体 -->
      <div class="footer-social">
        <h4 class="social-title">{{ $t('newHome.footer.community') }}</h4>
        <div class="social-icons">
          <a
            v-for="social in socialLinks"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            :title="social.name"
          >
            <img :src="social.icon" :alt="social.name" />
          </a>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} Coinstore. {{ $t('newHome.footer.allRightsReserved') }}
        </p>
        <div class="footer-legal">
          <a href="/terms">{{ $t('newHome.footer.termsOfService') }}</a>
          <span class="divider">|</span>
          <a href="/privacy">{{ $t('newHome.footer.privacyPolicy') }}</a>
          <span class="divider">|</span>
          <a href="/cookies">{{ $t('newHome.footer.cookiePolicy') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import LangSelect from '@/views/_new/components/common/LangSelect.vue';

const currentYear = computed(() => new Date().getFullYear());

const tradingPairs = ref([
  { symbol: 'BTC/USDT' },
  { symbol: 'ETH/USDT' },
  { symbol: 'BNB/USDT' },
  { symbol: 'SOL/USDT' },
  { symbol: 'XRP/USDT' }
]);

const socialLinks = ref([
  {
    name: 'Telegram',
    url: 'https://t.me/coinstore',
    icon: '/images/social/telegram.svg'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/coinstore',
    icon: '/images/social/twitter.svg'
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/coinstore',
    icon: '/images/social/facebook.svg'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/coinstore',
    icon: '/images/social/linkedin.svg'
  },
  {
    name: 'Medium',
    url: 'https://medium.com/@coinstore',
    icon: '/images/social/medium.svg'
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/coinstore',
    icon: '/images/social/discord.svg'
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@coinstore',
    icon: '/images/social/tiktok.svg'
  },
  {
    name: 'Weibo',
    url: 'https://weibo.com/coinstore',
    icon: '/images/social/weibo.svg'
  }
]);
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.new-footer {
  background: $bg-dark;
  color: $color-white;
  padding: $spacing-4xl 0 $spacing-xl;
  margin-top: $spacing-5xl;

  .container {
    max-width: $container-max-width;
    margin: 0 auto;
    padding: 0 $container-padding;
  }

  .footer-content {
    display: flex;
    gap: $spacing-4xl;
    margin-bottom: $spacing-4xl;

    @media (max-width: $breakpoint-lg) {
      flex-direction: column;
      gap: $spacing-3xl;
    }
  }

  .footer-columns {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-3xl;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
      gap: $spacing-2xl;
    }
  }

  .footer-column {
    .column-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      margin-bottom: $spacing-lg;
      color: $color-white;
    }

    .column-links {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: $spacing-sm;

        a {
          color: rgba($color-white, 0.7);
          text-decoration: none;
          font-size: $font-size-sm;
          transition: color $transition-base;

          &:hover {
            color: $primary-color;
          }
        }
      }
    }
  }

  .footer-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-lg;
    min-width: 200px;

    .footer-logo {
      height: 36px;
      width: auto;
    }

    .footer-lang {
      :deep(.lang-select .lang-trigger) {
        background: rgba($color-white, 0.1);
        color: $color-white;

        &:hover {
          background: rgba($color-white, 0.15);
        }

        .lang-text {
          color: $color-white;
        }

        .arrow {
          color: rgba($color-white, 0.7);
        }
      }
    }

    .footer-qr {
      text-align: center;

      .qr-code {
        width: 120px;
        height: 120px;
        background: $color-white;
        border-radius: $radius-md;
        margin-bottom: $spacing-sm;
        display: flex;
        align-items: center;
        justify-content: center;

        .qr-placeholder {
          color: $color-text-secondary;
          font-size: $font-size-sm;
        }
      }

      .qr-text {
        font-size: $font-size-xs;
        color: rgba($color-white, 0.7);
      }
    }
  }

  .footer-social {
    text-align: center;
    padding: $spacing-2xl 0;
    border-top: 1px solid rgba($color-white, 0.1);
    border-bottom: 1px solid rgba($color-white, 0.1);

    .social-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      margin-bottom: $spacing-lg;
    }

    .social-icons {
      display: flex;
      justify-content: center;
      gap: $spacing-lg;
      flex-wrap: wrap;

      .social-link {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba($color-white, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all $transition-base;

        &:hover {
          background: $primary-color;
          transform: translateY(-4px);
        }

        img {
          width: 20px;
          height: 20px;
          filter: brightness(0) invert(1);
        }
      }
    }
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: $spacing-2xl;
    font-size: $font-size-sm;

    @media (max-width: $breakpoint-md) {
      flex-direction: column;
      gap: $spacing-md;
      text-align: center;
    }

    .copyright {
      color: rgba($color-white, 0.6);
      margin: 0;
    }

    .footer-legal {
      display: flex;
      align-items: center;
      gap: $spacing-md;

      a {
        color: rgba($color-white, 0.7);
        text-decoration: none;
        transition: color $transition-base;

        &:hover {
          color: $primary-color;
        }
      }

      .divider {
        color: rgba($color-white, 0.3);
      }
    }
  }
}
</style>
