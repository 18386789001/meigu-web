<template>
  <div class="platform-detail-page">
    <div class="container">
      <div class="platform-header">
        <div class="platform-image">
          <img src="/images/web.png" alt="Web交易" />
        </div>
        <div class="platform-info">
          <h1 class="platform-title">Web交易</h1>
          <p class="platform-subtitle">无需下载，浏览器直接交易</p>
          <div class="platform-badges">
            <span class="badge">即时访问</span>
            <span class="badge">跨平台</span>
            <span class="badge">云端同步</span>
            <span class="badge">实时数据</span>
          </div>
        </div>
      </div>

      <div class="platform-content">
        <div class="content-section">
          <h2>平台特色</h2>
          <ul class="feature-list">
            <li>无需安装，浏览器直接使用</li>
            <li>支持所有主流浏览器</li>
            <li>云端数据同步</li>
            <li>实时市场数据</li>
            <li>响应式设计，适配各种设备</li>
            <li>快速加载，流畅体验</li>
          </ul>
        </div>

        <div class="content-section">
          <h2>系统要求</h2>
          <div class="requirements-grid">
            <div class="requirement-item">
              <h3>浏览器支持</h3>
              <ul>
                <li>Chrome 80+</li>
                <li>Firefox 75+</li>
                <li>Safari 13+</li>
                <li>Edge 80+</li>
              </ul>
            </div>
            <div class="requirement-item">
              <h3>操作系统</h3>
              <ul>
                <li>Windows 10+</li>
                <li>macOS 10.14+</li>
                <li>Linux Ubuntu 18+</li>
                <li>移动端浏览器</li>
              </ul>
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
          <h2>立即开始</h2>
          <div class="action-buttons">
            <button class="action-btn primary">开始Web交易</button>
            <button class="action-btn secondary">查看演示</button>
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

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.requirement-item {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.requirement-item h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.requirement-item ul {
  list-style: none;
  padding: 0;
}

.requirement-item li {
  padding: 5px 0;
  color: #666;
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

.action-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.action-btn.secondary:hover {
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
  
  .requirements-grid {
    grid-template-columns: 1fr;
  }
  
  .params-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
