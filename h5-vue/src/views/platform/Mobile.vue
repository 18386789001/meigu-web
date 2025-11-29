<template>
  <div class="platform-detail-page">
    <div class="container">
      <div class="platform-header">
        <div class="platform-image">
          <img src="/images/mobile.png" alt="移动交易" />
        </div>
        <div class="platform-info">
          <h1 class="platform-title">移动交易</h1>
          <p class="platform-subtitle">随时随地，移动端交易</p>
          <div class="platform-badges">
            <span class="badge">实时行情</span>
            <span class="badge">快速下单</span>
            <span class="badge">推送通知</span>
            <span class="badge">离线模式</span>
          </div>
        </div>
      </div>

      <div class="platform-content">
        <div class="content-section">
          <h2>平台特色</h2>
          <ul class="feature-list">
            <li>实时市场行情推送</li>
            <li>快速下单和交易</li>
            <li>重要消息推送通知</li>
            <li>离线模式查看历史数据</li>
            <li>指纹/面部识别登录</li>
            <li>多账户管理</li>
          </ul>
        </div>

        <div class="content-section">
          <h2>移动端支持</h2>
          <div class="mobile-platforms">
            <div class="platform-item">
              <div class="platform-icon">📱</div>
              <h3>iOS</h3>
              <p>支持iPhone和iPad</p>
              <span class="version">iOS 12.0+</span>
            </div>
            <div class="platform-item">
              <div class="platform-icon">🤖</div>
              <h3>Android</h3>
              <p>支持手机和平板</p>
              <span class="version">Android 7.0+</span>
            </div>
            <div class="platform-item">
              <div class="platform-icon">🌐</div>
              <h3>Web App</h3>
              <p>浏览器直接使用</p>
              <span class="version">PWA支持</span>
            </div>
          </div>
        </div>

        <div class="content-section">
          <h2>交易参数</h2>
          <div class="params-grid">
            <div class="param-item">
              <span class="param-label">点差</span>
              <span class="param-value">0.1点起</span>
            </div>
            <div class="param-item">
              <span class="param-label">杠杆</span>
              <span class="param-value">1:500</span>
            </div>
            <div class="param-item">
              <span class="param-label">最小手数</span>
              <span class="param-value">0.01</span>
            </div>
            <div class="param-item">
              <span class="param-label">最大手数</span>
              <span class="param-value">100</span>
            </div>
          </div>
        </div>

        <div class="content-section">
          <h2>下载安装</h2>
          <div class="download-options">
            <div class="download-item">
              <div class="download-icon">🍎</div>
              <h3>App Store</h3>
              <button class="download-btn primary">iOS下载</button>
            </div>
            <div class="download-item">
              <div class="download-icon">📱</div>
              <h3>Google Play</h3>
              <button class="download-btn primary">Android下载</button>
            </div>
            <div class="download-item">
              <div class="download-icon">🌐</div>
              <h3>Web版本</h3>
              <button class="download-btn secondary">立即使用</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.platform-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 30px;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.platform-image img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.platform-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.platform-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.platform-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  background: #667eea;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.platform-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.content-section {
  margin-bottom: 40px;
}

.content-section h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  position: relative;
  padding-left: 30px;
}

.feature-list li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.mobile-platforms {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.platform-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.platform-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.platform-item h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.platform-item p {
  color: #666;
  margin-bottom: 10px;
}

.version {
  background: #667eea;
  color: white;
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.param-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.param-label {
  font-weight: 500;
  color: #666;
}

.param-value {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.download-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.download-item {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  transition: transform 0.3s ease;
}

.download-item:hover {
  transform: translateY(-5px);
}

.download-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.download-item h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.download-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
}

.download-btn.primary {
  background: #667eea;
  color: white;
}

.download-btn.primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.download-btn.secondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.download-btn.secondary:hover {
  background: #667eea;
  color: white;
}

@include mobile {
  .platform-header {
    flex-direction: column;
    text-align: center;
  }
  
  .platform-title {
    font-size: 2rem;
  }
  
  .mobile-platforms {
    grid-template-columns: 1fr;
  }
  
  .params-grid {
    grid-template-columns: 1fr;
  }
  
  .download-options {
    grid-template-columns: 1fr;
  }
}
</style>
