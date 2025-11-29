<template>
  <el-dropdown trigger="click" @command="handleChange" class="lang-select">
    <div class="icon-btn">
      <el-icon><Orange /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in langOptions"
          :key="lang.value"
          :command="lang.value"
          :class="{ active: lang.value === currentLang }"
        >
          <div class="lang-item">
            <span>{{ lang.label }}</span>
            <el-icon v-if="lang.value === currentLang" class="check-icon">
              <Select />
            </el-icon>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const langOptions = [
  { label: "简体中文", value: "zh-CN" },
  { label: "English", value: "en" },
  { label: "繁體中文", value: "cht" },
  { label: "日本語", value: "ja" },
  { label: "한국어", value: "ko" },
  { label: "Français", value: "fr" },
  { label: "Deutsch", value: "de" },
  { label: "Ελληνικά", value: "el" },
  { label: "Italiano", value: "it" },
  { label: "Português", value: "pt" },
  { label: "Română", value: "ro" },
  { label: "Español", value: "es" },
  { label: "Türkçe", value: "tk" },
];

const currentLang = computed(() => locale.value);

const handleChange = (lang) => {
  locale.value = lang;
  localStorage.setItem("lang", lang);
  // 刷新页面以应用新语言
  window.location.reload();
};
</script>

<style lang="scss" scoped>
@import "@/views/_new/home/styles/variables.scss";

.lang-select {
  cursor: pointer;
  padding-right: 12px;
  display: flex;
  align-items: center;

  .icon-btn {
    font-size: 20px;
    cursor: pointer;
    padding-bottom: 4px;
    color: $color-text-secondary;
    transition: color $transition-base;
    display: flex;
    &:hover {
      color: $color-text-primary;
    }
  }

  :deep(.el-dropdown-menu__item) {
    .lang-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-width: 120px;

      .check-icon {
        color: $primary-color;
        font-size: 16px;
      }
    }

    &.active {
      color: $primary-color;
      font-weight: $font-weight-medium;
      background: rgba($primary-color, 0.1);
    }
  }
}
</style>
