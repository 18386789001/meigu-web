<template>
  <section class="trade-anywhere">
    <div class="container">
      <div class="content-layout">
        <!-- 左侧信息区 -->
        <div class="info-side">
          <h2 class="section-title">{{ $t('newHome.tradeAnywhere.title') }}</h2>
          <p class="section-subtitle">{{ $t('newHome.tradeAnywhere.subtitle') }}</p>

          <!-- 二维码 -->
          <div class="qr-section">
            <div class="qr-code">
              <!-- TODO: 添加实际二维码组件 -->
              <div class="qr-placeholder">
                <el-icon><QrCode /></el-icon>
              </div>
            </div>
            <div class="qr-info">
              <h3>{{ $t('newHome.tradeAnywhere.scanQR') }}</h3>
              <p>{{ $t('newHome.tradeAnywhere.downloadDesc') }}</p>
            </div>
          </div>

          <!-- 下载按钮 -->
          <div class="download-buttons">
            <a href="#" class="download-btn app-store">
              <img src="/images/badges/app-store.svg" alt="App Store" />
            </a>
            <a href="#" class="download-btn google-play">
              <img src="/images/badges/google-play.svg" alt="Google Play" />
            </a>
            <a href="#" class="download-btn apk">
              <el-button class="btn-apk">
                <el-icon><Download /></el-icon>
                APK Download
              </el-button>
            </a>
          </div>

          <!-- API 文档链接 -->
          <div class="api-link">
            <a href="/api-docs" target="_blank">
              <el-icon><Document /></el-icon>
              {{ $t('newHome.tradeAnywhere.apiDocs') }}
            </a>
          </div>
        </div>

        <!-- 右侧预览区 -->
        <div class="preview-side">
          <div class="phone-mockup">
            <img src="/images/app-preview.png" alt="App Preview" class="preview-image" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { QrCode, Download, Document } from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>
@import '@/views/_new/home/styles/variables.scss';

.trade-anywhere {
  padding: $spacing-5xl 0;
  background: linear-gradient(180deg, $bg-white 0%, $bg-light 100%);

  @media (max-width: $breakpoint-md) {
    padding: $spacing-3xl 0;
  }

  .content-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-4xl;
    align-items: center;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: 1fr;
      gap: $spacing-3xl;
    }
  }

  .info-side {
    .section-title {
      font-size: $font-size-4xl;
      font-weight: $font-weight-bold;
      color: $color-black;
      margin-bottom: $spacing-md;

      @media (max-width: $breakpoint-md) {
        font-size: $font-size-3xl;
      }
    }

    .section-subtitle {
      font-size: $font-size-lg;
      color: $color-text-secondary;
      margin-bottom: $spacing-3xl;
      line-height: 1.6;
    }

    .qr-section {
      display: flex;
      gap: $spacing-xl;
      align-items: center;
      margin-bottom: $spacing-3xl;
      padding: $spacing-xl;
      background: $bg-white;
      border-radius: $radius-lg;
      box-shadow: $shadow-sm;

      .qr-code {
        width: 140px;
        height: 140px;
        background: $bg-light;
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .qr-placeholder {
          font-size: 64px;
          color: $color-text-tertiary;
        }
      }

      .qr-info {
        h3 {
          font-size: $font-size-xl;
          font-weight: $font-weight-semibold;
          color: $color-black;
          margin: 0 0 $spacing-sm 0;
        }

        p {
          font-size: $font-size-sm;
          color: $color-text-secondary;
          margin: 0;
          line-height: 1.5;
        }
      }
    }

    .download-buttons {
      display: flex;
      gap: $spacing-md;
      flex-wrap: wrap;
      margin-bottom: $spacing-xl;

      .download-btn {
        display: inline-block;
        transition: transform $transition-base;

        &:hover {
          transform: translateY(-4px);
        }

        img {
          height: 48px;
          width: auto;
        }

        &.apk {
          .btn-apk {
            height: 48px;
            padding: 0 $spacing-xl;
            background: $color-black;
            color: $color-white;
            border: none;
            border-radius: $radius-sm;
            font-weight: $font-weight-medium;

            &:hover {
              background: #333;
            }

            .el-icon {
              margin-right: 8px;
            }
          }
        }
      }
    }

    .api-link {
      a {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: $primary-color;
        font-size: $font-size-base;
        font-weight: $font-weight-medium;
        text-decoration: none;
        transition: all $transition-base;

        &:hover {
          color: $primary-dark;
          gap: 12px;
        }

        .el-icon {
          font-size: 20px;
        }
      }
    }
  }

  .preview-side {
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: $breakpoint-lg) {
      order: -1;
    }

    .phone-mockup {
      position: relative;
      max-width: 400px;
      width: 100%;

      .preview-image {
        width: 100%;
        height: auto;
        filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
      }
    }
  }
}
</style>
