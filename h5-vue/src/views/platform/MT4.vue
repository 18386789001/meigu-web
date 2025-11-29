<template>
  <div class="platform-detail-page">
    <div class="container">
      <div class="platform-header">
        <div class="platform-image">
          <img src="/images/mt4.png" alt="MetaTrader 4" />
        </div>
        <div class="platform-info">
          <h1 class="platform-title">MetaTrader 4</h1>
          <p class="platform-subtitle">最受欢迎的外汇交易平台</p>
          <div class="platform-badges">
            <span class="badge">图表分析</span>
            <span class="badge">EA交易</span>
            <span class="badge">移动端</span>
            <span class="badge">多语言</span>
          </div>
        </div>
      </div>

      <div class="platform-content">
        <div class="content-section">
          <h2>平台特色</h2>
          <ul class="feature-list">
            <li>强大的图表分析工具</li>
            <li>支持EA自动交易</li>
            <li>移动端完美支持</li>
            <li>多语言界面</li>
            <li>实时市场数据</li>
            <li>历史数据回测</li>
          </ul>
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
          <div class="download-buttons">
            <button class="download-btn primary">下载桌面版</button>
            <button class="download-btn secondary">下载移动版</button>
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

.download-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.download-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
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
  
  .params-grid {
    grid-template-columns: 1fr;
  }
  
  .download-buttons {
    flex-direction: column;
  }
}
</style>
