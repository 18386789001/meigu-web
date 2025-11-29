<template>
  <div class="debug-localstorage">
    <div class="container">
      <h1>LocalStorage 调试工具</h1>
      
      <div class="section">
        <h2>当前存储的值</h2>
        <div class="storage-item">
          <strong>lang:</strong> {{ localStorageData.lang }}
        </div>
        <div class="storage-item">
          <strong>userInfo:</strong> {{ localStorageData.userInfo }}
        </div>
        <div class="storage-item">
          <strong>token:</strong> {{ localStorageData.token }}
        </div>
      </div>
      
      <div class="section">
        <h2>语言测试</h2>
        <div class="language-buttons">
          <button 
            v-for="lang in testLanguages" 
            :key="lang.code"
            @click="testLanguage(lang.code)"
            :class="{ active: currentLang === lang.code }"
          >
            {{ lang.flag }} {{ lang.name }}
          </button>
        </div>
      </div>
      
      <div class="section">
        <h2>操作</h2>
        <div class="action-buttons">
          <button @click="clearAll" class="btn-danger">清除所有数据</button>
          <button @click="setInvalidLang" class="btn-warning">设置无效语言代码</button>
          <button @click="setInvalidJson" class="btn-warning">设置无效JSON</button>
          <button @click="refresh" class="btn-primary">刷新数据</button>
        </div>
      </div>
      
      <div class="section">
        <h2>控制台日志</h2>
        <div class="console-log">
          <p v-for="(log, index) in consoleLogs" :key="index" :class="log.type">
            {{ log.message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  initLocalStorageCleanup, 
  cleanupInvalidLanguageCode, 
  cleanupInvalidJsonData,
  safeGetItem,
  safeRemoveItem,
  SUPPORTED_LANGUAGES
} from '@/utils/localStorage'

const { locale } = useI18n()

const localStorageData = ref({
  lang: '',
  userInfo: '',
  token: ''
})

const currentLang = ref('')
const consoleLogs = ref([])

const testLanguages = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' }
]

const addLog = (message, type = 'info') => {
  consoleLogs.value.unshift({
    message: `[${new Date().toLocaleTimeString()}] ${message}`,
    type
  })
  
  // 保持最多20条日志
  if (consoleLogs.value.length > 20) {
    consoleLogs.value = consoleLogs.value.slice(0, 20)
  }
}

const refresh = () => {
  localStorageData.value = {
    lang: safeGetItem('lang', '无'),
    userInfo: safeGetItem('userInfo', '无'),
    token: safeGetItem('token', '无')
  }
  currentLang.value = locale.value
  addLog('数据已刷新', 'success')
}

const testLanguage = (langCode) => {
  localStorage.setItem('lang', langCode)
  locale.value = langCode
  refresh()
  addLog(`测试语言: ${langCode}`, 'info')
}

const clearAll = () => {
  localStorage.clear()
  refresh()
  addLog('所有localStorage数据已清除', 'warning')
}

const setInvalidLang = () => {
  localStorage.setItem('lang', 'invalid-lang-code')
  refresh()
  addLog('设置了无效语言代码: invalid-lang-code', 'warning')
}

const setInvalidJson = () => {
  localStorage.setItem('userInfo', 'invalid-json-string')
  refresh()
  addLog('设置了无效JSON: invalid-json-string', 'warning')
}

onMounted(() => {
  refresh()
  addLog('LocalStorage调试工具已启动', 'success')
  
  // 监听localStorage变化
  window.addEventListener('storage', (e) => {
    addLog(`localStorage变化: ${e.key} = ${e.newValue}`, 'info')
    refresh()
  })
})
</script>

<style scoped>
.debug-localstorage {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #ffd700;
  margin-bottom: 30px;
  text-align: center;
}

.section {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #333;
}

h2 {
  color: #ffd700;
  margin-bottom: 15px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.storage-item {
  margin-bottom: 10px;
  padding: 8px;
  background: #222;
  border-radius: 4px;
  font-family: monospace;
}

.language-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.language-buttons button {
  padding: 10px 15px;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-buttons button:hover {
  background: #444;
}

.language-buttons button.active {
  background: #1e40af;
  border-color: #3b82f6;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.action-buttons button {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #1e40af;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
}

.btn-warning {
  background: #d97706;
  color: white;
}

.btn-warning:hover {
  background: #b45309;
}

.console-log {
  background: #111;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.console-log p {
  margin: 5px 0;
  font-family: monospace;
  font-size: 14px;
}

.console-log .info {
  color: #60a5fa;
}

.console-log .success {
  color: #34d399;
}

.console-log .warning {
  color: #fbbf24;
}

.console-log .error {
  color: #f87171;
}

@media (max-width: 768px) {
  .language-buttons,
  .action-buttons {
    flex-direction: column;
  }
  
  .language-buttons button,
  .action-buttons button {
    width: 100%;
  }
}
</style>
