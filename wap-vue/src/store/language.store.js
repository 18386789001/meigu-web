import { defineStore } from 'pinia'
import { SET_LANGUAGE } from '@/store/types.store'
import { getStorage, setStorage, getBrowserLang } from '@/utils/index'

export const useLanguageStore = defineStore('language', {
    // state 持久化
    persist: true,
    state: () => ('language', {
        // 强制默认语言为英文，不依赖浏览器语言
        language: getStorage('lang') || 'en' // 项目初始化时，默认为英文
    }),
    actions: {
        [SET_LANGUAGE](locale) {
            this.language = locale
            setStorage('lang', locale)
        }

    },
})
