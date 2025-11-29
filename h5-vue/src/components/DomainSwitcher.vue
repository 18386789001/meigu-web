<template>
  <div class="domain-switcher">
    <!-- 域名切换按钮 -->
    <button 
      class="domain-switch-btn"
      @click="showSwitcher = !showSwitcher"
      :title="$t('domainSwitcher.title')"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    </button>

    <!-- 域名切换面板 -->
    <div v-if="showSwitcher" class="domain-panel">
      <div class="panel-header">
        <h3>{{ $t('domainSwitcher.title') }}</h3>
        <button class="close-btn" @click="showSwitcher = false">×</button>
      </div>

      <div class="panel-content">
        <!-- 当前域名显示 -->
        <div class="current-domain">
          <label>{{ $t('domainSwitcher.currentDomain') }}:</label>
          <span class="domain-value">{{ currentDomain }}</span>
          <span 
            class="domain-status" 
            :class="{ 'healthy': isDomainHealthy, 'unhealthy': !isDomainHealthy }"
          >
            {{ isDomainHealthy ? '✓' : '✗' }}
          </span>
        </div>

        <!-- 预设域名列表 -->
        <div class="preset-domains">
          <label>{{ $t('domainSwitcher.presetDomains') }}:</label>
          <div class="domain-list">
            <button
              v-for="(domain, env) in presetDomains"
              :key="env"
              class="domain-item"
              :class="{ 'active': domain === currentDomain }"
              @click="switchToPresetDomain(domain)"
              :disabled="switching"
            >
              <span class="domain-name">{{ domain }}</span>
              <span class="domain-env">({{ env }})</span>
            </button>
          </div>
        </div>

        <!-- 自定义域名输入 -->
        <div class="custom-domain">
          <label>{{ $t('domainSwitcher.customDomain') }}:</label>
          <div class="input-group">
            <input
              v-model="customDomainInput"
              type="text"
              :placeholder="$t('domainSwitcher.placeholder')"
              class="domain-input"
              @keyup.enter="switchToCustomDomain"
              :disabled="switching"
            />
            <button
              class="switch-btn"
              @click="switchToCustomDomain"
              :disabled="!isValidDomain || switching"
            >
              {{ switching ? $t('domainSwitcher.switching') : $t('domainSwitcher.switch') }}
            </button>
          </div>
          <div v-if="customDomainInput && !isValidDomain" class="error-message">
            {{ $t('domainSwitcher.invalidDomain') }}
          </div>
        </div>

        <!-- 域名健康检查 -->
        <div class="health-check">
          <button
            class="check-btn"
            @click="checkCurrentDomainHealth"
            :disabled="checking"
          >
            {{ checking ? $t('domainSwitcher.checking') : $t('domainSwitcher.checkHealth') }}
          </button>
        </div>

        <!-- 重置按钮 -->
        <div class="reset-section">
          <button
            class="reset-btn"
            @click="resetDomain"
            :disabled="switching"
          >
            {{ $t('domainSwitcher.reset') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div v-if="showSwitcher" class="overlay" @click="showSwitcher = false"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  getCurrentDomain,
  switchDomain,
  getCustomDomain,
  resetToDefaultDomain,
  validateDomain,
  checkDomainHealth,
  DEFAULT_DOMAINS
} from '@/utils/domainManager';

const { t } = useI18n();

// 响应式数据
const showSwitcher = ref(false);
const currentDomain = ref(getCurrentDomain());
const customDomainInput = ref('');
const switching = ref(false);
const checking = ref(false);
const isDomainHealthy = ref(true);

// 预设域名
const presetDomains = ref(DEFAULT_DOMAINS);

// 计算属性
const isValidDomain = computed(() => {
  return customDomainInput.value ? validateDomain(customDomainInput.value) : false;
});

// 方法
const switchToPresetDomain = async (domain) => {
  if (domain === currentDomain.value) return;
  
  switching.value = true;
  try {
    const success = switchDomain(domain);
    if (!success) {
      alert(t('domainSwitcher.switchFailed'));
    }
  } catch (error) {
    console.error('域名切换失败:', error);
    alert(t('domainSwitcher.switchError'));
  } finally {
    switching.value = false;
  }
};

const switchToCustomDomain = async () => {
  if (!isValidDomain.value) return;
  
  switching.value = true;
  try {
    // 先检查域名健康状态
    const isHealthy = await checkDomainHealth(customDomainInput.value);
    if (!isHealthy) {
      const confirm = window.confirm(t('domainSwitcher.unhealthyDomainWarning'));
      if (!confirm) {
        switching.value = false;
        return;
      }
    }
    
    const success = switchDomain(customDomainInput.value);
    if (!success) {
      alert(t('domainSwitcher.switchFailed'));
    }
  } catch (error) {
    console.error('自定义域名切换失败:', error);
    alert(t('domainSwitcher.switchError'));
  } finally {
    switching.value = false;
  }
};

const checkCurrentDomainHealth = async () => {
  checking.value = true;
  try {
    const isHealthy = await checkDomainHealth(currentDomain.value);
    isDomainHealthy.value = isHealthy;
    
    const message = isHealthy 
      ? t('domainSwitcher.domainHealthy') 
      : t('domainSwitcher.domainUnhealthy');
    alert(message);
  } catch (error) {
    console.error('域名健康检查失败:', error);
    alert(t('domainSwitcher.checkError'));
  } finally {
    checking.value = false;
  }
};

const resetDomain = () => {
  switching.value = true;
  try {
    resetToDefaultDomain();
  } catch (error) {
    console.error('重置域名失败:', error);
    alert(t('domainSwitcher.resetError'));
  } finally {
    switching.value = false;
  }
};

// 生命周期
onMounted(async () => {
  // 初始化时检查域名健康状态
  try {
    const isHealthy = await checkDomainHealth(currentDomain.value);
    isDomainHealthy.value = isHealthy;
  } catch (error) {
    console.warn('初始域名健康检查失败:', error);
  }
  
  // 如果有自定义域名，显示在输入框中
  const customDomain = getCustomDomain();
  if (customDomain) {
    customDomainInput.value = customDomain;
  }
});
</script>

<style scoped>
.domain-switcher {
  position: relative;
  display: inline-block;
}

.domain-switch-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.domain-switch-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #333;
}

.domain-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 8px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.panel-content {
  padding: 16px;
}

.current-domain,
.preset-domains,
.custom-domain,
.health-check,
.reset-section {
  margin-bottom: 16px;
}

.current-domain label,
.preset-domains label,
.custom-domain label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.domain-value {
  font-family: monospace;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
}

.domain-status {
  font-weight: bold;
}

.domain-status.healthy {
  color: #4CAF50;
}

.domain-status.unhealthy {
  color: #f44336;
}

.domain-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.domain-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.domain-item:hover {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.domain-item.active {
  border-color: #007bff;
  background-color: #e3f2fd;
}

.domain-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.domain-name {
  font-family: monospace;
  font-weight: 500;
}

.domain-env {
  font-size: 12px;
  color: #666;
}

.input-group {
  display: flex;
  gap: 8px;
}

.domain-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
}

.domain-input:focus {
  outline: none;
  border-color: #007bff;
}

.switch-btn,
.check-btn,
.reset-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.switch-btn {
  background-color: #007bff;
  color: white;
}

.switch-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.switch-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.check-btn {
  background-color: #28a745;
  color: white;
  width: 100%;
}

.check-btn:hover:not(:disabled) {
  background-color: #1e7e34;
}

.reset-btn {
  background-color: #6c757d;
  color: white;
  width: 100%;
}

.reset-btn:hover:not(:disabled) {
  background-color: #545b62;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .domain-panel {
    width: 90vw;
    right: 5vw;
  }
}
</style>
