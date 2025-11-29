<template>
  <div class="whitepaper-page">
    <!-- 封面 -->
    <div class="text-center mb-10">
      <h1 class="display-4 fw-bold text-primary">{{ t('whitepaper.cover.title') }}</h1>
      <h2 class="h3 text-muted mt-2">{{ t('whitepaper.cover.subtitle') }}</h2>
      <p class="text-secondary mt-4">{{ t('whitepaper.cover.description') }}</p>
      <p class="text-secondary">{{ t('whitepaper.cover.version') }}</p>
    </div>

    <!-- 目录 -->
    <div class="card mb-8">
      <div class="card-header bg-primary text-white">
        <h3 class="h4 mb-0">{{ t('whitepaper.toc.title') }}</h3>
      </div>
      <div class="card-body">
        <ul class="list-unstyled">
          <li class="mb-2" v-for="item in tocItems" :key="item.id">
            <a :href="`#${item.id}`" class="toc-link" @click="scrollToSection(item.id)">{{ item.title }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 1. 平台简介 -->
    <section :id="1">
      <h2 class="section-title h2">{{ t('whitepaper.section1.title') }}</h2>
      <p class="mb-3" v-html="t('whitepaper.section1.content1')"></p>
      <p>{{ t('whitepaper.section1.content2') }}</p>
    </section>

    <!-- 2. 全球合规资质 -->
    <section :id="2">
      <h2 class="section-title h2">{{ t('whitepaper.section2.title') }}</h2>
      <p class="mb-3">{{ t('whitepaper.section2.intro') }}</p>

      <!-- 美国FinCEN MSB资质 -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h3 class="h5 mb-0">{{ t('whitepaper.section2.fincen.title') }}</h3>
        </div>
        <div class="card-body">
          <div class="license-info">
            <p class="mb-1"><span class="fw-bold">{{ t('whitepaper.section2.fincen.registrationNumber') }}</span>：{{ t('whitepaper.section2.fincen.registrationNumberValue') }}</p>
            <p class="mb-1"><span class="fw-bold">{{ t('whitepaper.section2.fincen.registrationType') }}</span>：{{ t('whitepaper.section2.fincen.registrationTypeValue') }}</p>
            <p class="mb-1"><span class="fw-bold">{{ t('whitepaper.section2.fincen.legalEntity') }}</span>：{{ t('whitepaper.section2.fincen.legalEntityValue') }}</p>
            <p class="mb-1"><span class="fw-bold">{{ t('whitepaper.section2.fincen.registeredAddress') }}</span>：{{ t('whitepaper.section2.fincen.registeredAddressValue') }}</p>
            <p class="mb-1"><span class="fw-bold">{{ t('whitepaper.section2.fincen.businessScope') }}</span>：
              <br>• {{ t('whitepaper.section2.fincen.businessScope1') }}
              <br>• {{ t('whitepaper.section2.fincen.businessScope2') }}
              <br>• {{ t('whitepaper.section2.fincen.businessScope3') }}
              <br>• {{ t('whitepaper.section2.fincen.businessScope4') }}
              <br>• {{ t('whitepaper.section2.fincen.businessScope5') }}
              <br>• {{ t('whitepaper.section2.fincen.businessScope6') }}
              <br>• {{ t('whitepaper.section2.fincen.businessScope7') }}
              <br>• {{ t('whitepaper.section2.fincen.businessScope8') }}
            </p>
            <p class="mb-1"><span class="fw-bold">{{ t('whitepaper.section2.fincen.coverageArea') }}</span>：{{ t('whitepaper.section2.fincen.coverageAreaValue') }}</p>
            <p class="mb-1"><span class="fw-bold">{{ t('whitepaper.section2.fincen.registrationProgress') }}</span>：{{ t('whitepaper.section2.fincen.registrationProgressValue') }}</p>
            <p class="text-muted small">{{ t('whitepaper.section2.fincen.disclaimer') }}</p>
          </div>
        </div>
      </div>

      <!-- 加拿大FINTRAC MSB资质 -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h3 class="h5 mb-0">{{ t('whitepaper.section2.fintrac.title') }}</h3>
        </div>
        <div class="card-body">
          <p>{{ t('whitepaper.section2.fintrac.content') }}</p>
        </div>
      </div>

      <!-- 其他地区合规布局 -->
      <p class="mb-3">{{ t('whitepaper.section2.otherRegions') }}</p>
    </section>

    <!-- 3. 市场布局与用户规模 -->
    <section :id="3">
      <h2 class="section-title h2">{{ t('whitepaper.section3.title') }}</h2>
      <p class="mb-3">{{ t('whitepaper.section3.intro') }}</p>
      <ul class="list-disc ms-5 mb-4">
        <li><span class="highlight">用户规模</span>：{{ t('whitepaper.section3.userScale').split('：')[1] }}</li>
        <li><span class="highlight">地理覆盖</span>：{{ t('whitepaper.section3.geographicCoverage').split('：')[1] }}</li>
        <li><span class="highlight">用户体验</span>：{{ t('whitepaper.section3.userExperience').split('：')[1] }}</li>
      </ul>
    </section>

    <!-- 4. 产品与服务体系 -->
    <section :id="4">
      <h2 class="section-title h2">{{ t('whitepaper.section4.title') }}</h2>
      <p class="mb-3">{{ t('whitepaper.section4.intro') }}</p>

      <div class="row">
        <!-- 现货交易 -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h3 class="h5 fw-bold">{{ t('whitepaper.section4.spotTrading.title') }}</h3>
            </div>
            <div class="card-body">
              <p>{{ t('whitepaper.section4.spotTrading.content') }}</p>
            </div>
          </div>
        </div>

        <!-- 合约交易 -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h3 class="h5 fw-bold">{{ t('whitepaper.section4.contractTrading.title') }}</h3>
            </div>
            <div class="card-body">
              <p>{{ t('whitepaper.section4.contractTrading.content') }}</p>
            </div>
          </div>
        </div>

        <!-- Staking -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h3 class="h5 fw-bold">{{ t('whitepaper.section4.staking.title') }}</h3>
            </div>
            <div class="card-body">
              <p>{{ t('whitepaper.section4.staking.content') }}</p>
            </div>
          </div>
        </div>

        <!-- 流动性池 -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h3 class="h5 fw-bold">{{ t('whitepaper.section4.liquidityPool.title') }}</h3>
            </div>
            <div class="card-body">
              <p>{{ t('whitepaper.section4.liquidityPool.content') }}</p>
            </div>
          </div>
        </div>

        <!-- 智能投顾 -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h3 class="h5 fw-bold">{{ t('whitepaper.section4.roboAdvisor.title') }}</h3>
            </div>
            <div class="card-body">
              <p>{{ t('whitepaper.section4.roboAdvisor.content') }}</p>
            </div>
          </div>
        </div>

        <!-- 机构服务 -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h3 class="h5 fw-bold">{{ t('whitepaper.section4.institutionalServices.title') }}</h3>
            </div>
            <div class="card-body">
              <p>{{ t('whitepaper.section4.institutionalServices.content') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. 核心技术实力 -->
    <section :id="5">
      <h2 class="section-title h2">{{ t('whitepaper.section5.title') }}</h2>
      <p class="mb-3">{{ t('whitepaper.section5.intro') }}</p>

      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h3 class="h5 mb-0">{{ t('whitepaper.section5.matchingEngine.title') }}</h3>
        </div>
        <div class="card-body">
          <p v-html="t('whitepaper.section5.matchingEngine.content')"></p>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h3 class="h5 mb-0">{{ t('whitepaper.section5.securitySystem.title') }}</h3>
        </div>
        <div class="card-body">
          <ul class="list-disc ms-5">
            <li v-html="t('whitepaper.section5.securitySystem.multiSig')"></li>
            <li v-html="t('whitepaper.section5.securitySystem.riskControl')"></li>
            <li v-html="t('whitepaper.section5.securitySystem.monitoring')"></li>
          </ul>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h3 class="h5 mb-0">{{ t('whitepaper.section5.blockchain.title') }}</h3>
        </div>
        <div class="card-body">
          <p>{{ t('whitepaper.section5.blockchain.content') }}</p>
        </div>
      </div>
    </section>

    <!-- 6. 核心团队背景 -->
    <section :id="6">
      <h2 class="section-title h2">{{ t('whitepaper.section6.title') }}</h2>
      <p class="mb-3">{{ t('whitepaper.section6.intro') }}</p>
      <ul class="list-disc ms-5 mb-4">
        <li v-html="t('whitepaper.section6.finance')"></li>
        <li v-html="t('whitepaper.section6.technology')"></li>
        <li v-html="t('whitepaper.section6.compliance')"></li>
        <li v-html="t('whitepaper.section6.crypto')"></li>
      </ul>
    </section>

    <!-- 7. 战略合作伙伴 -->
    <section :id="7">
      <h2 class="section-title h2">{{ t('whitepaper.section7.title') }}</h2>
      <p class="mb-3">{{ t('whitepaper.section7.intro') }}</p>

      <div class="row">
        <!-- Webster Financial -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h3 class="h5 mb-0">{{ t('whitepaper.section7.webster.title') }}</h3>
            </div>
            <div class="card-body">
              <p class="mb-2"><span class="fw-bold">{{ t('whitepaper.section7.webster.overview') }}</span>：{{ t('whitepaper.section7.webster.overviewValue') }}</p>
              <p class="mb-2"><span class="fw-bold">{{ t('whitepaper.section7.webster.cooperation') }}</span>：{{ t('whitepaper.section7.webster.cooperationValue') }}</p>
              <p class="text-muted small">{{ t('whitepaper.section7.webster.reference') }}</p>
            </div>
          </div>
        </div>

        <!-- Columbia Banking System -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h3 class="h5 mb-0">{{ t('whitepaper.section7.columbia.title') }}</h3>
            </div>
            <div class="card-body">
              <p class="mb-2"><span class="fw-bold">{{ t('whitepaper.section7.columbia.overview') }}</span>：{{ t('whitepaper.section7.columbia.overviewValue') }}</p>
              <p class="mb-2"><span class="fw-bold">{{ t('whitepaper.section7.columbia.cooperation') }}</span>：{{ t('whitepaper.section7.columbia.cooperationValue') }}</p>
              <p class="text-muted small">{{ t('whitepaper.section7.columbia.reference') }}</p>
            </div>
          </div>
        </div>

        <!-- LendingClub -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h3 class="h5 mb-0">{{ t('whitepaper.section7.lendingClub.title') }}</h3>
            </div>
            <div class="card-body">
              <p class="mb-2"><span class="fw-bold">{{ t('whitepaper.section7.lendingClub.overview') }}</span>：{{ t('whitepaper.section7.lendingClub.overviewValue') }}</p>
              <p class="mb-2"><span class="fw-bold">{{ t('whitepaper.section7.lendingClub.cooperation') }}</span>：{{ t('whitepaper.section7.lendingClub.cooperationValue') }}</p>
            </div>
          </div>
        </div>

        <!-- Northern Trust -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h3 class="h5 mb-0">{{ t('whitepaper.section7.northernTrust.title') }}</h3>
            </div>
            <div class="card-body">
              <p class="mb-2"><span class="fw-bold">{{ t('whitepaper.section7.northernTrust.overview') }}</span>：{{ t('whitepaper.section7.northernTrust.overviewValue') }}</p>
              <p class="mb-2"><span class="fw-bold">{{ t('whitepaper.section7.northernTrust.cooperation') }}</span>：{{ t('whitepaper.section7.northernTrust.cooperationValue') }}</p>
              <p class="text-muted small">{{ t('whitepaper.section7.northernTrust.reference') }}</p>
            </div>
          </div>
        </div>

        <!-- Cullen/Frost Bankers -->
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h3 class="h5 mb-0">{{ t('whitepaper.section7.cullenFrost.title') }}</h3>
            </div>
            <div class="card-body">
              <p class="mb-2"><span class="fw-bold">{{ t('whitepaper.section7.cullenFrost.overview') }}</span>：{{ t('whitepaper.section7.cullenFrost.overviewValue') }}</p>
              <p class="mb-2"><span class="fw-bold">{{ t('whitepaper.section7.cullenFrost.cooperation') }}</span>：{{ t('whitepaper.section7.cullenFrost.cooperationValue') }}</p>
              <p class="text-muted small">{{ t('whitepaper.section7.cullenFrost.reference') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. 未来发展规划 -->
    <section :id="8">
      <h2 class="section-title h2">{{ t('whitepaper.section8.title') }}</h2>
      <p class="mb-3">{{ t('whitepaper.section8.intro') }}</p>
      <ul class="list-disc ms-5 mb-4">
        <li v-html="t('whitepaper.section8.compliance')"></li>
        <li v-html="t('whitepaper.section8.product')"></li>
        <li v-html="t('whitepaper.section8.institution')"></li>
        <li v-html="t('whitepaper.section8.userExperience')"></li>
        <li v-html="t('whitepaper.section8.ecosystem')"></li>
      </ul>
    </section>

    <!-- 9. 免责声明 -->
    <section :id="9">
      <h2 class="section-title h2">{{ t('whitepaper.section9.title') }}</h2>
      <div class="card bg-light">
        <div class="card-body">
          <p class="mb-2">{{ t('whitepaper.section9.disclaimer1') }}</p>
          <p class="mb-2">{{ t('whitepaper.section9.disclaimer2') }}</p>
          <p class="mb-2">{{ t('whitepaper.section9.disclaimer3') }}</p>
          <p class="mb-2">{{ t('whitepaper.section9.disclaimer4') }}</p>
          <p>{{ t('whitepaper.section9.disclaimer5') }}</p>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="text-center mt-10 mb-5 text-muted">
      <p>{{ t('whitepaper.footer.copyright') }}</p>
      <p>{{ t('whitepaper.footer.contact') }}</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 目录数据 - 使用响应式翻译
const tocItems = computed(() => [
  { id: '1', title: t('whitepaper.toc.item1') },
  { id: '2', title: t('whitepaper.toc.item2') },
  { id: '3', title: t('whitepaper.toc.item3') },
  { id: '4', title: t('whitepaper.toc.item4') },
  { id: '5', title: t('whitepaper.toc.item5') },
  { id: '6', title: t('whitepaper.toc.item6') },
  { id: '7', title: t('whitepaper.toc.item7') },
  { id: '8', title: t('whitepaper.toc.item8') },
  { id: '9', title: t('whitepaper.toc.item9') }
])

// 平滑滚动到指定章节
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}
</script>

<style lang="scss" scoped>
.whitepaper-page {
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #ffffff;
  line-height: 1.6;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 100vh;
}

/* 基础样式 */
.section-title { 
  color: #66b3ff; 
  border-bottom: 2px solid #66b3ff; 
  padding-bottom: 0.5rem; 
  margin: 2rem 0 1rem; 
}

.card { 
  border: none; 
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1); 
  margin-bottom: 1.5rem; 
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.card-header { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); 
  color: #ffffff;
}

.card-body {
  color: #ffffff;
}

.license-info { 
  background: rgba(255, 255, 255, 0.08); 
  padding: 1.5rem; 
  border-radius: 0.5rem; 
  margin: 1rem 0; 
  color: #ffffff;
}

.highlight { 
  color: #66b3ff; 
  font-weight: 600; 
}

.toc-link { 
  color: #ffffff; 
  text-decoration: none; 
  transition: color 0.3s ease;
}

.toc-link:hover { 
  color: #66b3ff; 
  text-decoration: underline; 
}

.text-primary {
  color: #66b3ff !important;
}

.text-muted {
  color: #cccccc !important;
}

.text-secondary {
  color: #cccccc !important;
}

.bg-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.text-white {
  color: #ffffff !important;
}

.fw-bold {
  font-weight: 700 !important;
}

.display-4 {
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1.2;
}

.h3 {
  font-size: 1.25rem;
}

.h4 {
  font-size: 1.1rem;
}

.h5 {
  font-size: 1rem;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.mb-2 {
  margin-bottom: 0.5rem !important;
}

.mb-3 {
  margin-bottom: 1rem !important;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.mb-5 {
  margin-bottom: 3rem !important;
}

.mb-8 {
  margin-bottom: 2rem !important;
}

.mb-10 {
  margin-bottom: 3rem !important;
}

.mt-2 {
  margin-top: 0.5rem !important;
}

.mt-10 {
  margin-top: 3rem !important;
}

.ms-5 {
  margin-left: 3rem !important;
}

.text-center {
  text-align: center !important;
}

.list-unstyled {
  padding-left: 0;
  list-style: none;
}

.list-disc {
  list-style-type: disc;
}

.h-100 {
  height: 100% !important;
}

.small {
  font-size: 0.875em;
}

.bg-light {
  background: rgba(255, 255, 255, 0.08) !important;
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .whitepaper-page {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
    color: #ffffff;
  }
  
  .card {
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
  }
  
  .card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .card-body {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }
  
  .license-info {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
  
  .toc-link {
    color: #ffffff;
    
    &:hover {
      color: #66b3ff;
    }
  }
  
  .text-primary {
    color: #66b3ff !important;
  }
  
  .text-muted {
    color: #cccccc !important;
  }
  
  .text-secondary {
    color: #cccccc !important;
  }
  
  .bg-light {
    background: rgba(255, 255, 255, 0.08) !important;
  }
  
  footer {
    color: #cccccc !important;
  }
}

/* 基于主题存储的暗黑模式样式 */
.dark-theme .whitepaper-page,
[data-theme="dark"] .whitepaper-page {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%);
  color: #ffffff;
  
  .card {
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
  }
  
  .card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .card-body {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }
  
  .license-info {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
  
  .toc-link {
    color: #ffffff;
    
    &:hover {
      color: #66b3ff;
    }
  }
  
  .text-primary {
    color: #66b3ff !important;
  }
  
  .text-muted {
    color: #cccccc !important;
  }
  
  .text-secondary {
    color: #cccccc !important;
  }
  
  .bg-light {
    background: rgba(255, 255, 255, 0.08) !important;
  }
  
  footer {
    color: #cccccc !important;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .whitepaper-page {
    padding: 10px;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  .ms-5 {
    margin-left: 1rem !important;
  }
  
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .card {
    margin-bottom: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .h2 {
    font-size: 1.5rem;
  }
  
  .h3 {
    font-size: 1.2rem;
  }
  
  .h4 {
    font-size: 1.1rem;
  }
  
  .h5 {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .whitepaper-page {
    padding: 5px;
  }
  
  .display-4 {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .license-info {
    padding: 1rem;
  }
}
</style>
