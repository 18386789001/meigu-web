<template>
  <div id="cryptos">
    <div class="CommonProblem">
      <assets-head :title="$t('关于我们')" />
      <div class="CommonProblem-padding">
        <div class="about-hero">
          <div class="hero-title">JPMX</div>
          <div class="hero-sub">{{ $t('全球数字资产金融服务平台') }}</div>
        </div>

        <div class="about-card">
          <h3>{{ $t('平台简介') }}</h3>
          <p>{{ $t('about_static_p1') }}</p>
        </div>

        <div class="about-card">
          <h3>{{ $t('全球化发展') }}</h3>
          <p>{{ $t('about_static_p2') }}</p>
        </div>

        <div class="about-card">
          <h3>{{ $t('产品与服务') }}</h3>
          <p>{{ $t('about_static_p3') }}</p>
        </div>

        <div class="about-card">
          <h3>{{ $t('核心团队') }}</h3>
          <p>{{ $t('about_static_p4') }}</p>
        </div>

        <div class="about-card">
          <h3>{{ $t('安全与合规') }}</h3>
          <p>{{ $t('about_static_p5') }}</p>
        </div>

        <div class="about-card">
          <h3>{{ $t('使命愿景') }}</h3>
          <p>{{ $t('about_static_p6') }}</p>
        </div>

        <div class="about-card contact">
          <h3>{{ $t('JPMX公司总部') }}</h3>
          <div class="contact-info">
            <p><strong>{{ $t('公司名称') }}:</strong> {{ $t('company_name_value') }}</p>
            <p><strong>{{ $t('街道地址') }}:</strong> {{ $t('street_address_value') }}</p>
            <p><strong>{{ $t('城市') }}:</strong> {{ $t('格林威治') }}</p>
            <p><strong>{{ $t('州') }}:</strong> {{ $t('康涅狄格州') }}</p>
            <p><strong>{{ $t('邮箱') }}:</strong> jpmx@jpmx.xyz</p>
            <p><strong>{{ $t('邮编') }}:</strong> 06830</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>
<script>
import assetsHead from "@/components/Transform/assets-head/index.vue";
export default {
  components: { assetsHead }
}
</script>
<style lang="scss" scoped>
#cryptos {
  .CommonProblem {
    width: 100%;
    box-sizing: border-box;
  }

  pre {
    white-space: pre-wrap;
  }

  .CommonProblem-padding {
    padding-left: 35px;
    padding-right: 35px;
    font-weight: 400;
    font-size: 30px;
    line-height: 35px;
    color: $text_color;
  }

  .CommonProblem-title {
    font-style: normal;
    font-weight: 700;
    font-size: 50px;
    line-height: 59px;
    padding-left: 35px;
    padding-right: 35px;
    margin-top: 57px;
    margin-bottom: 22px;
    color: $text_color;
  }

  .about-hero {
    background: linear-gradient(135deg, rgba(0, 123, 255, 0.18), rgba(0, 123, 255, 0.06));
    border: 1px solid rgba(0, 123, 255, 0.2);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    .hero-title {
      font-size: 40px;
      font-weight: 800;
      letter-spacing: 1px;
    }
    .hero-sub {
      margin-top: 8px;
      font-size: 24px;
      opacity: 0.8;
    }
  }

  .about-card {
    background: rgba(0,0,0,0.02);
    border: 1px solid $border_color;
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 16px;
    
    h3 {
      font-size: 30px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    p {
      font-size: 28px;
      line-height: 40px;
      text-align: justify;
    }
    &.contact {
      .contact-info {
        background: rgba(0, 123, 255, 0.05);
        border-radius: 12px;
        padding: 16px;
        p { font-size: 26px; line-height: 36px; margin-bottom: 8px; }
        strong { color: #007bff; font-weight: 600; }
      }
    }
  }

  // 旧静态内容样式（兼容保留，已不再使用）
  .fallback-content {
    .about-us-content {
      h3 {
        font-size: 32px;
        font-weight: 700;
        color: $text_color;
        margin: 40px 0 20px 0;
        line-height: 38px;
        
        &:first-child {
          margin-top: 0;
        }
      }
      
      p {
        font-size: 28px;
        line-height: 40px;
        color: $text_color;
        margin-bottom: 20px;
        text-align: justify;
      }
      
      .contact-info {
        background: rgba(0, 123, 255, 0.05);
        border-radius: 12px;
        padding: 20px;
        margin-top: 20px;
        
        p {
          margin-bottom: 12px;
          font-size: 26px;
          line-height: 36px;
          
          strong {
            color: #007bff;
            font-weight: 600;
          }
        }
      }
    }
    
    .service-terms-content {
      h3 {
        font-size: 32px;
        font-weight: 700;
        color: $text_color;
        margin: 40px 0 20px 0;
        line-height: 38px;
        text-align: center;
        
        &:first-child {
          margin-top: 0;
        }
      }
      
      .terms-section {
        h4 {
          font-size: 28px;
          font-weight: 600;
          color: $text_color;
          margin: 30px 0 15px 0;
          line-height: 34px;
        }
        
        p {
          font-size: 26px;
          line-height: 38px;
          color: $text_color;
          margin-bottom: 15px;
          text-align: justify;
        }
      }
    }
  }
  
  // API内容样式
  .api-content {
    .textColor {
      font-size: 28px;
      line-height: 40px;
      color: $text_color;
    }
  }
}
</style>
