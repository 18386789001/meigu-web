<template>
  <section class="inner-tab-container">
    <div class="news-header">
      <p class="title">{{ t('news') }}</p>
    </div>

    <!-- 日经新闻日期范围显示 -->
    <div v-if="nikkeiDateRange" class="nikkei-date-range">
      <p class="date-range-text">{{ nikkeiDateRange }}</p>
    </div>

    <!-- 翻译状态提示 -->
    <div v-if="translating" class="translation-status">
      <van-loading size="16px" />
      <span class="translation-text">{{ t('正在翻译新闻内容...') }}</span>
    </div>

    <!-- Alpha Vantage 新闻日期范围显示 -->
    <div v-if="alphaVantageData && alphaVantageData.dateFrom" class="alpha-vantage-date-range">
      <p class="date-range-text">{{ t('最新财经新闻') }} - {{ formatDate(alphaVantageData.dateFrom) }}</p>
    </div>

    <div class="news-container">
      <!-- 显示 Alpha Vantage 新闻列表 -->
      <div v-if="alphaVantageData && alphaVantageData.articles && alphaVantageData.articles.length > 0">
        <div class="alpha-vantage-news-list">
          <div 
            v-for="(article, index) in alphaVantageData.articles.slice(0, alphaVantageDisplayCount)" 
            :key="article.id || index"
            class="alpha-vantage-news-item"
          >
            <div class="news-number">{{ index + 1 }}</div>
            <div class="news-content">
              <p class="news-title">{{ article.title }}</p>
              <p class="news-time">{{ formatTime(article.time_published) }}</p>
              <p v-if="article.summary" class="news-summary">{{ article.summary }}</p>
              <div v-if="article.overall_sentiment_label" class="sentiment-badge" :class="getSentimentClass(article.overall_sentiment_label)">
                {{ article.overall_sentiment_label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Alpha Vantage 新闻加载更多按钮 -->
        <div v-if="!showAllAlphaVantage" class="flex mt-2">
          <van-button
            type="default"
            plain
            class="more-btn"
            :loading="alphaVantageLoading"
            @click="onLoadMore"
          >
            {{ alphaVantageLoading ? t('加载中...') : t('查看更多') }}
          </van-button>
        </div>

        <!-- 没有更多数据提示 -->
        <div v-if="showAllAlphaVantage" class="no-more-text">
          {{ t('没有更多了') }}
        </div>
      </div>

      <!-- 显示日经新闻列表 -->
      <div v-else-if="nikkeiData && nikkeiData.articles && nikkeiData.articles.length > 0">
        <div class="nikkei-news-list">
          <div 
            v-for="(article, index) in nikkeiData.articles.slice(0, nikkeiDisplayCount)" 
            :key="article.id || index"
            class="nikkei-news-item"
          >
            <div class="news-number">{{ index + 1 }}</div>
            <div class="news-content">
              <p class="news-title">{{ article.title }}</p>
            </div>
          </div>
        </div>

        <!-- 日经新闻加载更多按钮 -->
        <div v-if="!showAllNikkei" class="flex mt-2">
          <van-button
            type="default"
            plain
            class="more-btn"
            @click="onLoadMore"
          >
            {{ t('查看更多') }}
          </van-button>
        </div>

        <!-- 没有更多数据提示 -->
        <div v-if="showAllNikkei" class="no-more-text">
          {{ t('没有更多了') }}
        </div>
      </div>
      
      <!-- 显示原有新闻列表 -->
      <div v-else-if="list.length > 0">
        <van-steps direction="vertical" :active="0">
          <van-step v-for="(item, index) in list" :key="item.uuid || index">
            <p class="time">{{ item.createdAt }}</p>
            <p class="context" v-html="item.description"></p>
          </van-step>
        </van-steps>

        <!-- 原有新闻加载更多按钮 -->
        <div v-if="!finished" class="flex mt-2">
          <van-button
            type="default"
            plain
            class="more-btn"
            :loading="loading"
            @click="onLoadMore"
          >
            {{ loading ? t('加载中...') : t('更多数据') }}
          </van-button>
        </div>

        <!-- 没有更多数据提示 -->
        <div v-if="finished" class="no-more-text">
          {{ t('没有更多了') }}
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading && !nikkeiData && !alphaVantageData" class="empty-state">
        <p>{{ t('暂无新闻数据') }}</p>
        <van-button type="primary" @click="getInformationList">{{ t('重新加载') }}</van-button>
      </div>

      <!-- 首次加载状态 -->
      <div v-if="loading && list.length === 0 && !nikkeiData && !alphaVantageData" class="loading-state">
        <van-loading size="24px" />
        <p>{{ t('加载中...') }}</p>
      </div>
    </div>
  </section>
</template>
    
<script setup>
import { ref, onMounted, watch } from 'vue';
import { _getInformationList } from '@/service/etf.api'
import translationService from '@/services/translationService'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const { t, locale } = useI18n()
const list = ref([])
const maxTime = ref('')
const translating = ref(false)
const originalList = ref([]) // 保存原始数据
const loading = ref(false)
const finished = ref(false)

// 工具函数
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const formatTime = (timeString) => {
  // 格式化时间字符串 20250927T122400 -> 2025-09-27 12:24
  if (!timeString) return ''
  const year = timeString.substring(0, 4)
  const month = timeString.substring(4, 6)
  const day = timeString.substring(6, 8)
  const hour = timeString.substring(9, 11)
  const minute = timeString.substring(11, 13)
  return `${year}-${month}-${day} ${hour}:${minute}`
}

const getSentimentClass = (sentiment) => {
  switch (sentiment) {
    case 'Bullish':
      return 'sentiment-bullish'
    case 'Somewhat-Bullish':
      return 'sentiment-somewhat-bullish'
    case 'Neutral':
      return 'sentiment-neutral'
    case 'Somewhat-Bearish':
      return 'sentiment-somewhat-bearish'
    case 'Bearish':
      return 'sentiment-bearish'
    default:
      return 'sentiment-neutral'
  }
}

// 日经新闻相关状态
const nikkeiData = ref(null) // 日经新闻数据
const nikkeiDateRange = ref('') // 日期范围显示
const showAllNikkei = ref(false) // 是否显示全部50条
const nikkeiDisplayCount = ref(20) // 当前显示数量

// Alpha Vantage 新闻相关状态
const alphaVantageData = ref(null) // Alpha Vantage 新闻数据
const showAllAlphaVantage = ref(false) // 是否显示全部50条
const alphaVantageDisplayCount = ref(20) // 当前显示数量
const alphaVantageLoading = ref(false) // Alpha Vantage 加载状态

// 获取 Alpha Vantage 新闻数据
const getAlphaVantageNews = async () => {
  try {
    console.log('📰 获取 Alpha Vantage 新闻数据...')
    alphaVantageLoading.value = true
    
    // 使用不同的 API Key 根据语言环境
    const apiKey = locale.value === 'en' || locale.value === 'English' 
      ? 'C7NVENZNS0LS6' 
      : 'C7NVENZNS0LS6SFF'
    
    const response = await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${apiKey}`)
    
    if (response.data && response.data.feed && Array.isArray(response.data.feed)) {
      const newsData = response.data.feed.map((item, index) => ({
        id: `alpha_${index}`,
        title: item.title,
        time_published: item.time_published,
        summary: item.summary,
        url: item.url,
        source: item.source,
        banner_image: item.banner_image,
        overall_sentiment_score: item.overall_sentiment_score,
        overall_sentiment_label: item.overall_sentiment_label
      }))
      
      alphaVantageData.value = {
        articles: newsData,
        total: newsData.length,
        dateFrom: new Date().toISOString(),
        dateTo: new Date().toISOString()
      }
      
      console.log('📰 Alpha Vantage 新闻数据获取成功:', newsData.length, '条新闻')
      return newsData
    }
  } catch (error) {
    console.error('❌ 获取 Alpha Vantage 新闻失败:', error)
    return null
  } finally {
    alphaVantageLoading.value = false
  }
}

// 获取日经新闻数据
const getNikkeiNews = async () => {
  try {
    console.log('📰 获取日经新闻数据...')
    
    // 使用CORS代理或者JSONP方式
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.nikkei.com/api/ranking/v1/access/articles?volume=50')
    const response = await axios.get(proxyUrl)
    
    if (response.data && response.data.contents) {
      const data = JSON.parse(response.data.contents)
      
      if (data && data.articles) {
        nikkeiData.value = data
        
        // 格式化日期范围
        const dateFrom = new Date(data.dateFrom)
        const dateTo = new Date(data.dateTo)
        
        const formatDate = (date) => {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const hours = String(date.getHours()).padStart(2, '0')
          const minutes = String(date.getMinutes()).padStart(2, '0')
          return `${year}-${month}-${day}T${hours}:${minutes}`
        }
        
        nikkeiDateRange.value = `${formatDate(dateFrom)}に${formatDate(dateTo)}最新ニュース`
        
        console.log('📰 日经新闻数据获取成功:', data.articles.length, '条新闻')
        console.log('📰 日期范围:', nikkeiDateRange.value)
        
        return data.articles
      }
    }
  } catch (error) {
    console.error('❌ 获取日经新闻失败:', error)
    
    // 如果API调用失败，使用模拟数据作为备选方案
    console.log('📰 使用模拟日经新闻数据作为备选方案')
    const mockData = {
      dateFrom: "2025-01-26T22:00:00.000Z",
      dateTo: "2025-01-27T02:28:00.000Z",
      articles: [
        { id: "1", title: "米、医薬品に100%関税 トランプ氏「国内で工場着工なら免除」" },
        { id: "2", title: "アクセンチュア、1300億円規模のリストラ計画発表 人員1万人減" },
        { id: "3", title: "Amazon、米当局と3800億円で和解 3500万人にプライム会費返金" },
        { id: "4", title: "物価高対策、高市・小泉氏ら「減税」傾斜 現役の社保負担は議論進まず" },
        { id: "5", title: "Microsoft、イスラエル軍向けクラウド一部停止 ガザ監視に利用" },
        { id: "6", title: "ドジャース地区優勝 大谷翔平が自己最多タイ54号、山本由伸12勝" },
        { id: "7", title: "デンマークに再びドローン飛来 国防相「ハイブリッド攻撃」指摘" },
        { id: "8", title: "住友商事、「買収巧者」へ変身 航空機リースに過去最大3000億円" },
        { id: "9", title: "米スタバ「くつろげない店」閉鎖 北米で900人削減、費用1500億円" },
        { id: "10", title: "小泉進次郎氏、陣営による動画称賛要請を認める 「再発防止を徹底」" },
        { id: "11", title: "「選ぶのが面倒」投資は二択 タイパ20代にはシンプル思考が勝ち筋" },
        { id: "12", title: "「トランプ景気」悲観論が後退 高所得層の消費けん引、GDP上方修正" },
        { id: "13", title: "政治は市場にスキを見せるな 世界のマネー、TOKYOに集結" },
        { id: "14", title: "日経平均株価、NYダウ続落が重荷に（先読み株式相場）" },
        { id: "15", title: "トヨタ「ウーブン・シティ」で自動運転を実装へ 異業種連携で米中追走" },
        { id: "16", title: "ソフトバンクG、時価総額国内2位に浮上 OpenAI評価で年初来2倍に" },
        { id: "17", title: "「ジャック・マー復権」が支える中国株高 習氏軟化に沸く半導体・AI" },
        { id: "18", title: "ボッシュ、自動車部品で新たに1万3000人削減 全従業員の3%" },
        { id: "19", title: "NY株ハイライト 米オラクル「過大評価」高値から2週間で1割強下落" },
        { id: "20", title: "アクセンチュア江川社長「AIやデータ関連、数年内に売上高の8割へ」" }
      ]
    }
    
    nikkeiData.value = mockData
    
    // 格式化日期范围
    const dateFrom = new Date(mockData.dateFrom)
    const dateTo = new Date(mockData.dateTo)
    
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    }
    
    nikkeiDateRange.value = `${formatDate(dateFrom)}に${formatDate(dateTo)}最新ニュース`
    
    console.log('📰 模拟日经新闻数据加载成功:', mockData.articles.length, '条新闻')
    console.log('📰 日期范围:', nikkeiDateRange.value)
    
    return mockData.articles
  }
}

onMounted(async () => {
  // 清理翻译缓存，确保获取最新翻译结果
  translationService.clearCache()

  // 重置数据状态
  list.value = []
  originalList.value = []
  maxTime.value = ''
  finished.value = false
  
  // 重置日经新闻状态
  nikkeiData.value = null
  nikkeiDateRange.value = ''
  showAllNikkei.value = false
  nikkeiDisplayCount.value = 20

  // 重置 Alpha Vantage 新闻状态
  alphaVantageData.value = null
  showAllAlphaVantage.value = false
  alphaVantageDisplayCount.value = 20

  console.log('📰 新闻页面初始化，当前语言:', locale.value)

  // 根据语言环境选择新闻源
  const currentLang = locale.value
  const isJapanese = currentLang === 'ja' || currentLang === 'Japanese' || currentLang === 'JP'
  const isEnglish = currentLang === 'en' || currentLang === 'English'
  const isTraditionalChinese = currentLang === 'CN' // 繁体中文标识
  const isSimplifiedChinese = currentLang === 'zh-CN' // 简体中文标识
  
  if (isJapanese) {
    console.log('📰 检测到日语环境，使用日经新闻API')
    const nikkeiResult = await getNikkeiNews()
    if (!nikkeiResult) {
      console.log('📰 日经新闻API失败，使用翻译功能')
      await getInformationList()
    }
  } else if (isEnglish || (!isTraditionalChinese && !isSimplifiedChinese)) {
    console.log('📰 检测到英语或其他语言环境，使用 Alpha Vantage 新闻API')
    const alphaResult = await getAlphaVantageNews()
    if (!alphaResult) {
      console.log('📰 Alpha Vantage 新闻API失败，使用翻译功能')
      await getInformationList()
    }
  } else if (isTraditionalChinese) {
    console.log('📰 检测到繁体中文环境，使用翻译功能')
    await getInformationList()
  } else if (isSimplifiedChinese) {
    console.log('📰 检测到简体中文环境，使用原有新闻API')
    await getInformationList()
  }
})

const onLoadMore = async () => {
  const currentLang = locale.value
  const isJapanese = currentLang === 'ja' || currentLang === 'Japanese' || currentLang === 'JP'
  const isEnglish = currentLang === 'en' || currentLang === 'English'
  const isTraditionalChinese = currentLang === 'CN' // 繁体中文标识
  const isSimplifiedChinese = currentLang === 'zh-CN' // 简体中文标识
  
  if (isJapanese && nikkeiData.value) {
    // 日语环境，显示全部50条日经新闻
    showAllNikkei.value = true
    nikkeiDisplayCount.value = 50
    console.log('📰 显示全部50条日经新闻')
  } else if ((isEnglish || (!isTraditionalChinese && !isSimplifiedChinese)) && alphaVantageData.value) {
    // 英语或其他语言环境，显示全部50条 Alpha Vantage 新闻
    showAllAlphaVantage.value = true
    alphaVantageDisplayCount.value = 50
    console.log('📰 显示全部50条 Alpha Vantage 新闻')
  } else {
    // 使用原有逻辑（翻译功能或简体中文）
    if (originalList.value.length > 0) {
      maxTime.value = originalList.value[originalList.value.length - 1].createdAt
    } else if (list.value.length > 0) {
      maxTime.value = list.value[list.value.length - 1].createdAt
    }
    await getInformationList()
  }
}

const getInformationList = async () => {
  try {
    loading.value = true

    // 始终调用中文接口获取原始数据
    const data = await _getInformationList(maxTime.value)

    if (data && data.length > 0) {
      // 保存原始中文数据
      const newOriginalData = [...originalList.value, ...data]
      originalList.value = newOriginalData

      // 根据当前语言环境决定是否翻译
      const currentLang = locale.value
      console.log('📰 当前显示语言:', currentLang)

      if (currentLang === 'zh-CN') {
        // 简体中文环境直接使用原始数据
        console.log('📰 显示简体中文新闻，使用原始数据')
        list.value = [...list.value, ...data]
      } else {
        // 需要翻译的语言环境
        translating.value = true

        try {
          // 使用高精度翻译服务
          const translatedNewData = translationService.translateNewsList(data, currentLang)

          // 合并翻译后的数据到显示列表
          list.value = [...list.value, ...translatedNewData]

          console.log(`📰 成功翻译 ${translatedNewData.length} 条新闻到 ${currentLang}`)

          // 验证翻译质量
          const sampleTranslation = translatedNewData[0]?.description
          console.log('📰 翻译示例:', sampleTranslation?.substring(0, 100) + '...')
        } catch (translationError) {
          console.error('❌ 新闻翻译失败:', translationError)

          // 翻译失败时，使用原始数据
          list.value = [...list.value, ...data]
        } finally {
          translating.value = false
        }
      }

      // 检查是否还有更多数据
      if (data.length < 50) {
        finished.value = true
      }
    } else {
      // 没有获取到数据
      if (list.value.length === 0) {
        // 首次加载没有数据，不设置finished
        finished.value = false
      } else {
        // 不是首次加载，确实没有更多数据
        finished.value = true
      }
    }
  } catch (error) {
    console.error('获取新闻列表失败:', error)
    // 错误处理：区分首次加载和后续加载
    if (list.value.length > 0) {
      finished.value = true
    } else {
      finished.value = false
    }
  } finally {
    loading.value = false
  }
}

// 监听语言切换
watch(locale, async (newLocale, oldLocale) => {
  if (newLocale !== oldLocale) {
    console.log(`📰 检测到语言切换: ${oldLocale} → ${newLocale}`)

    // 清理翻译缓存，确保获取最新翻译
    translationService.clearCache()

    // 重置日经新闻状态
    nikkeiData.value = null
    nikkeiDateRange.value = ''
    showAllNikkei.value = false
    nikkeiDisplayCount.value = 20

    // 重置 Alpha Vantage 新闻状态
    alphaVantageData.value = null
    showAllAlphaVantage.value = false
    alphaVantageDisplayCount.value = 20

    // 根据新语言环境选择新闻源
    const isJapanese = newLocale === 'ja' || newLocale === 'Japanese' || newLocale === 'JP'
    const isEnglish = newLocale === 'en' || newLocale === 'English'
    const isTraditionalChinese = newLocale === 'CN' // 繁体中文标识
    const isSimplifiedChinese = newLocale === 'zh-CN' // 简体中文标识
    
    if (isJapanese) {
      console.log('📰 切换到日语，使用日经新闻API')
      const nikkeiResult = await getNikkeiNews()
      if (!nikkeiResult && originalList.value.length > 0) {
        console.log('📰 日经新闻API失败，使用翻译功能')
        // 使用翻译功能
        translating.value = true
        try {
          const translatedList = translationService.translateNewsList(originalList.value, newLocale)
          list.value = translatedList
        } catch (error) {
          console.error('❌ 语言切换翻译失败:', error)
          list.value = [...originalList.value]
        } finally {
          translating.value = false
        }
      }
    } else if (isEnglish || (!isTraditionalChinese && !isSimplifiedChinese)) {
      console.log('📰 切换到英语或其他语言，使用 Alpha Vantage 新闻API')
      const alphaResult = await getAlphaVantageNews()
      if (!alphaResult && originalList.value.length > 0) {
        console.log('📰 Alpha Vantage 新闻API失败，使用翻译功能')
        // 使用翻译功能
        translating.value = true
        try {
          const translatedList = translationService.translateNewsList(originalList.value, newLocale)
          list.value = translatedList
        } catch (error) {
          console.error('❌ 语言切换翻译失败:', error)
          list.value = [...originalList.value]
        } finally {
          translating.value = false
        }
      }
    } else if (isTraditionalChinese) {
      console.log('📰 切换到繁体中文，使用翻译功能')
      if (originalList.value.length > 0) {
        // 使用翻译功能
        translating.value = true
        try {
          const translatedList = translationService.translateNewsList(originalList.value, newLocale)
          list.value = translatedList
        } catch (error) {
          console.error('❌ 语言切换翻译失败:', error)
          list.value = [...originalList.value]
        } finally {
          translating.value = false
        }
      }
    } else if (isSimplifiedChinese) {
      console.log('📰 切换到简体中文，使用原始数据')
      if (originalList.value.length > 0) {
        list.value = [...originalList.value]
      }
    } else if (originalList.value.length > 0) {
      // 非日语环境，使用原有逻辑
      if (newLocale === 'zh-CN') {
        // 切换到简体中文，直接使用原始数据
        list.value = [...originalList.value]
        console.log('📝 切换到简体中文，使用原始数据')
      } else {
        // 需要翻译到目标语言
        translating.value = true
        try {
          console.log(`🔄 开始高精度翻译 ${originalList.value.length} 条新闻到 ${newLocale}`)

          // 使用高精度翻译服务
          const translatedList = translationService.translateNewsList(originalList.value, newLocale)
          list.value = translatedList

          console.log(`✅ 语言切换翻译完成，显示 ${translatedList.length} 条翻译内容`)
          console.log('翻译示例:', translatedList[0]?.description?.substring(0, 100) + '...')

          // 验证翻译质量
          const chineseCount = translatedList.filter(item => /[\u4e00-\u9fa5]/.test(item.description)).length
          if (chineseCount === 0) {
            console.log(`✅ 翻译质量验证通过：所有 ${translatedList.length} 条新闻均已完全翻译`)
          } else {
            console.warn(`⚠️ 翻译质量警告：仍有 ${chineseCount} 条新闻包含中文字符`)
          }
        } catch (error) {
          console.error('❌ 语言切换翻译失败:', error)
          // 翻译失败时保持原始数据
          list.value = [...originalList.value]
        } finally {
          translating.value = false
        }
      }
    }
    console.log('=== 新闻语言切换处理完成 ===')
  }
}, { immediate: false })


</script>
<style lang="scss" scoped>
:deep(.van-steps) {
  background: $mainBgColor;

  .van-step__title {
    color: $text_color !important;

    .time {
      color: #747A8F;
      margin: 5px 0;
    }

  }

  .van-step__line {
    background-color: $step-border;
  }

  .van-icon-checked::before {
    content: '';
    background-color: #3478F6;
    width: 6px;
    height: 6px;
    box-shadow: 0 0 0px 4px $step-bg;
    border-radius: 50%;
  }

  .van-step__circle {
    background-color: #3478F6;
    width: 6px;
    height: 6px;
    box-shadow: 0 0 0px 4px $step-bg;
  }

  .van-step--vertical:not(:last-child):after {
    border-bottom-width: 1px;
    border-color: $border_color;
  }
}

.inner-tab-container {
  margin-top: 8px;
  padding: 0 12px 60px;

  .news-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 16px;
      font-weight: 700;
      margin: 0;
    }
  }



  // 翻译状态样式
  .translation-status {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: rgba(64, 158, 255, 0.1);
    border-radius: 8px;
    margin: 16px 0;

    .translation-text {
      margin-left: 8px;
      font-size: 14px;
      color: #409eff;
    }
  }



  // 空状态样式
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;

    p {
      margin-bottom: 20px;
      color: #999;
      font-size: 14px;
    }
  }

  // 加载状态样式
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;

    p {
      margin-top: 12px;
      color: #666;
      font-size: 14px;
    }
  }

  // 没有更多数据样式
  .no-more-text {
    text-align: center;
    padding: 20px;
    color: #999;
    font-size: 12px;
  }

  .more-btn {
    margin: 0 auto;
    background-color: transparent;
    color: #3478F6;
  }

  // 日经新闻日期范围样式
  .nikkei-date-range {
    background: rgba(64, 158, 255, 0.1);
    border-radius: 8px;
    padding: 12px;
    margin: 16px 0;
    text-align: center;

    .date-range-text {
      margin: 0;
      font-size: 14px;
      color: #409eff;
      font-weight: 500;
    }
  }

  // Alpha Vantage 新闻日期范围样式
  .alpha-vantage-date-range {
    background: rgba(52, 120, 246, 0.1);
    border-radius: 8px;
    padding: 12px;
    margin: 16px 0;
    text-align: center;

    .date-range-text {
      margin: 0;
      font-size: 14px;
      color: #3478F6;
      font-weight: 500;
    }
  }

  // 日经新闻列表样式
  .nikkei-news-list {
    background: $mainBgColor;
    border-radius: 8px;
    padding: 16px;

    .nikkei-news-item {
      display: flex;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid $border_color;

      &:last-child {
        border-bottom: none;
      }

      .news-number {
        width: 24px;
        height: 24px;
        background: #3478F6;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        margin-right: 12px;
        flex-shrink: 0;
      }

      .news-content {
        flex: 1;

        .news-title {
          margin: 0;
          font-size: 16px;
          line-height: 1.5;
          color: $text_color;
          font-weight: 500;
        }
      }
    }
  }

  // Alpha Vantage 新闻列表样式
  .alpha-vantage-news-list {
    background: $mainBgColor;
    border-radius: 8px;
    padding: 16px;

    .alpha-vantage-news-item {
      display: flex;
      align-items: flex-start;
      padding: 16px 0;
      border-bottom: 1px solid $border_color;

      &:last-child {
        border-bottom: none;
      }

      .news-number {
        width: 24px;
        height: 24px;
        background: #3478F6;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        margin-right: 12px;
        flex-shrink: 0;
      }

      .news-content {
        flex: 1;

        .news-title {
          margin: 0 0 8px 0;
          font-size: 16px;
          line-height: 1.5;
          color: $text_color;
          font-weight: 600;
        }

        .news-time {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #999;
        }

        .news-summary {
          margin: 0 0 8px 0;
          font-size: 14px;
          line-height: 1.4;
          color: #666;
        }

        .sentiment-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;

          &.sentiment-bullish {
            background: rgba(0, 255, 136, 0.2);
            color: #00ff88;
          }

          &.sentiment-somewhat-bullish {
            background: rgba(0, 255, 136, 0.1);
            color: #00ff88;
          }

          &.sentiment-neutral {
            background: rgba(128, 128, 128, 0.1);
            color: #808080;
          }

          &.sentiment-somewhat-bearish {
            background: rgba(255, 71, 87, 0.1);
            color: #ff4757;
          }

          &.sentiment-bearish {
            background: rgba(255, 71, 87, 0.2);
            color: #ff4757;
          }
        }
      }
    }
  }
}
</style>