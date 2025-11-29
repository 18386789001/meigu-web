<template>
  <div class="language-selector-overlay" v-if="visible" @click="handleOverlayClick">
    <div class="language-selector-modal" @click.stop>
      <div class="modal-header">
        <h3>{{ $t('header.language') }}</h3>
        <button class="close-btn" @click="closeModal">
          <i class="icon-close">×</i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="language-list">
          <div
            v-for="lang in availableLanguages"
            :key="lang.code"
            class="language-item"
            :class="{ active: selectedLanguage === lang.code }"
            @click="selectLanguage(lang.code)"
          >
            <div class="language-flag">
              <span class="flag-emoji">{{ lang.flag }}</span>
            </div>
            <div class="language-info">
              <div class="language-name">{{ lang.name }}</div>
              <div class="language-native">{{ lang.nativeName }}</div>
            </div>
            <div class="language-check" v-if="selectedLanguage === lang.code">
              <i class="icon-check">✓</i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal">
          {{ $t('common.cancel') || '取消' }}
        </button>
        <button class="confirm-btn" @click="confirmSelection" :disabled="!selectedLanguage">
          {{ $t('common.confirm') || '确认' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { safeSetItem } from '@/utils/localStorage'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'language-changed'])

// Composables
const { locale, t } = useI18n()

// Reactive data
const selectedLanguage = ref('')

// 可用语言列表 - 与 App.vue 保持一致的排序
const availableLanguages = [
  { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', name: '日本語', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'th-TH', name: 'ไทย', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi-VN', name: 'Tiếng Việt', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'de-DE', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'es-ES', name: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'it-IT', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-PT', name: 'Português', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'el-GR', name: 'Ελληνικά', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'zh-CN', name: '简体中文', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', name: '繁體中文', nativeName: '繁體中文', flag: '🇹🇼' }
]

// Computed
const currentLanguage = computed(() => {
  return locale.value
})

// Watch for modal visibility changes
watch(() => props.visible, (newVal) => {
  if (newVal) {
    selectedLanguage.value = currentLanguage.value
  }
})

// Methods
const selectLanguage = (langCode) => {
  selectedLanguage.value = langCode
}

const confirmSelection = () => {
  if (selectedLanguage.value && selectedLanguage.value !== currentLanguage.value) {
    // 更新i18n locale
    locale.value = selectedLanguage.value
    
    // 保存到localStorage
    safeSetItem('lang', selectedLanguage.value)
    
    // 触发语言变更事件
    emit('language-changed', selectedLanguage.value)
    
    console.log('语言已切换到:', selectedLanguage.value)
  }
  
  closeModal()
}

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}
</script>

<style scoped>
.language-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.language-selector-modal {
  background: #1a1a1a;
  border-radius: 16px;
  border: 1px solid #333;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #333;
  background: #222;
}

.modal-header h3 {
  color: #ffd700;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #fff;
  background: #333;
}

.modal-body {
  max-height: 400px;
  overflow-y: auto;
  padding: 12px 0;
}

.language-list {
  display: flex;
  flex-direction: column;
}

.language-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #2a2a2a;
}

.language-item:hover {
  background: #2a2a2a;
}

.language-item.active {
  background: #333;
  border-left: 4px solid #ffd700;
}

.language-flag {
  margin-right: 16px;
  flex-shrink: 0;
}

.flag-emoji {
  font-size: 24px;
  display: block;
}

.language-info {
  flex: 1;
}

.language-name {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 2px;
}

.language-native {
  color: #999;
  font-size: 14px;
}

.language-check {
  color: #ffd700;
  font-size: 18px;
  font-weight: bold;
  margin-left: 12px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #333;
  background: #222;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #333;
  color: #fff;
}

.cancel-btn:hover {
  background: #444;
}

.confirm-btn {
  background: #ffd700;
  color: #000;
}

.confirm-btn:hover:not(:disabled) {
  background: #ffed4e;
}

.confirm-btn:disabled {
  background: #666;
  color: #999;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .language-selector-overlay {
    padding: 12px;
  }
  
  .language-selector-modal {
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-header h3 {
    font-size: 16px;
  }
  
  .language-item {
    padding: 14px 20px;
  }
  
  .language-name {
    font-size: 15px;
  }
  
  .language-native {
    font-size: 13px;
  }
  
  .modal-footer {
    padding: 16px 20px;
  }
  
  .cancel-btn,
  .confirm-btn {
    padding: 10px 20px;
    font-size: 15px;
  }
}

/* 滚动条样式 */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>
