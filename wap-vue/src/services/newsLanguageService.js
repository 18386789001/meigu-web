/**
 * 新闻资讯语言管理服务
 * 专门处理新闻内容的多语言显示和翻译
 */

class NewsLanguageService {
  constructor() {
    // 语言映射配置
    this.languageMap = {
      'en': 'English',
      'English': 'English',
      'CN': 'Chinese',
      'zh-CN': 'Chinese',
      'zh': 'Chinese',
      'Japanese': 'Japanese',
      'ja': 'Japanese',
      'Korean': 'Korean',
      'ko': 'Korean'
    };

    // 默认语言设置
    this.defaultLanguage = 'en';
    
    // 翻译缓存
    this.translationCache = new Map();
    
    // 新闻内容缓存
    this.newsCache = {
      original: [], // 原始中文数据
      translated: new Map() // 按语言缓存翻译结果
    };
  }

  /**
   * 获取当前应该显示的语言
   * @returns {string} 语言代码
   */
  getCurrentDisplayLanguage() {
    try {
      // 从localStorage获取当前语言设置
      const storedLang = localStorage.getItem('lang');
      
      // 如果没有设置或者设置无效，返回默认英文
      if (!storedLang) {
        console.log('📰 新闻语言：没有语言设置，使用默认英文');
        return this.defaultLanguage;
      }

      // 规范化语言代码
      const normalizedLang = this.normalizeLanguageCode(storedLang);
      console.log('📰 新闻语言：当前设置为', normalizedLang);
      
      return normalizedLang;
    } catch (error) {
      console.error('获取显示语言失败:', error);
      return this.defaultLanguage;
    }
  }

  /**
   * 规范化语言代码
   * @param {string} langCode 原始语言代码
   * @returns {string} 规范化后的语言代码
   */
  normalizeLanguageCode(langCode) {
    if (!langCode) return this.defaultLanguage;
    
    // 统一转换为标准格式
    const normalized = langCode.toLowerCase();
    
    if (normalized === 'cn' || normalized === 'zh' || normalized === 'zh-cn') {
      return 'CN';
    } else if (normalized === 'en' || normalized === 'english') {
      return 'en';
    } else if (normalized === 'ja' || normalized === 'japanese') {
      return 'Japanese';
    } else if (normalized === 'ko' || normalized === 'korean') {
      return 'Korean';
    }
    
    return langCode;
  }

  /**
   * 判断是否需要翻译
   * @param {string} targetLang 目标语言
   * @returns {boolean} 是否需要翻译
   */
  needsTranslation(targetLang) {
    const normalizedLang = this.normalizeLanguageCode(targetLang);
    // 中文不需要翻译，其他语言都需要翻译
    return normalizedLang !== 'CN';
  }

  /**
   * 获取新闻数据的显示版本
   * @param {Array} originalData 原始中文新闻数据
   * @param {string} targetLang 目标语言
   * @returns {Array} 处理后的新闻数据
   */
  async getDisplayNewsData(originalData, targetLang = null) {
    if (!originalData || originalData.length === 0) {
      return [];
    }

    const displayLang = targetLang || this.getCurrentDisplayLanguage();
    
    // 如果是中文，直接返回原始数据
    if (!this.needsTranslation(displayLang)) {
      console.log('📰 显示中文新闻，使用原始数据');
      return originalData;
    }

    // 需要翻译的情况
    console.log(`📰 需要翻译新闻到 ${displayLang}`);
    
    try {
      // 检查缓存
      const cacheKey = `${displayLang}_${originalData.length}`;
      if (this.newsCache.translated.has(cacheKey)) {
        console.log('📰 使用缓存的翻译结果');
        return this.newsCache.translated.get(cacheKey);
      }

      // 执行翻译
      const translatedData = await this.translateNewsData(originalData, displayLang);
      
      // 缓存翻译结果
      this.newsCache.translated.set(cacheKey, translatedData);
      
      return translatedData;
    } catch (error) {
      console.error('📰 新闻翻译失败:', error);
      // 翻译失败时返回英文摘要
      return this.generateEnglishSummaries(originalData);
    }
  }

  /**
   * 翻译新闻数据
   * @param {Array} newsData 新闻数据
   * @param {string} targetLang 目标语言
   * @returns {Array} 翻译后的数据
   */
  async translateNewsData(newsData, targetLang) {
    const translatedNews = [];

    for (let i = 0; i < newsData.length; i++) {
      const item = newsData[i];
      
      try {
        // 翻译标题和内容
        const translatedDescription = await this.translateText(item.description, targetLang);
        
        translatedNews.push({
          ...item,
          description: translatedDescription,
          originalDescription: item.description,
          translatedTo: targetLang
        });
      } catch (error) {
        console.error(`翻译第${i+1}条新闻失败:`, error);
        // 翻译失败时使用英文摘要
        translatedNews.push({
          ...item,
          description: this.generateEnglishSummary(item.description, i + 1),
          originalDescription: item.description,
          translatedTo: targetLang,
          translationFailed: true
        });
      }
    }

    return translatedNews;
  }

  /**
   * 翻译单个文本
   * @param {string} text 原始文本
   * @param {string} targetLang 目标语言
   * @returns {string} 翻译后的文本
   */
  async translateText(text, targetLang) {
    // 检查缓存
    const cacheKey = `${text}_${targetLang}`;
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey);
    }

    // 这里可以集成真实的翻译API
    // 目前使用模拟翻译
    const translatedText = this.mockTranslate(text, targetLang);
    
    // 缓存结果
    this.translationCache.set(cacheKey, translatedText);
    
    return translatedText;
  }

  /**
   * 模拟翻译函数
   * @param {string} text 原始文本
   * @param {string} targetLang 目标语言
   * @returns {string} 翻译结果
   */
  mockTranslate(text, targetLang) {
    // 移除HTML标签
    const cleanText = text.replace(/<[^>]*>/g, '');
    
    if (targetLang === 'en' || targetLang === 'English') {
      return this.generateEnglishSummary(cleanText);
    } else if (targetLang === 'Japanese') {
      return this.generateJapaneseSummary(cleanText);
    } else if (targetLang === 'Korean') {
      return this.generateKoreanSummary(cleanText);
    }
    
    return `[${targetLang}] ${cleanText.substring(0, 100)}...`;
  }

  /**
   * 生成英文摘要
   * @param {string} text 原始文本
   * @param {number} index 索引
   * @returns {string} 英文摘要
   */
  generateEnglishSummary(text, index = null) {
    const templates = [
      "Market analysis and trading insights for today's financial markets.",
      "Latest financial news and market updates from global exchanges.",
      "Investment opportunities and risk analysis in current market conditions.",
      "Economic indicators and their impact on trading strategies.",
      "Technical analysis and price movement predictions for major assets.",
      "Breaking news affecting cryptocurrency and forex markets.",
      "Expert commentary on market trends and trading opportunities.",
      "Financial market outlook and investment recommendations."
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const suffix = index ? ` (News ${index})` : '';
    
    return randomTemplate + suffix;
  }

  /**
   * 生成日文摘要
   * @param {string} text 原始文本
   * @returns {string} 日文摘要
   */
  generateJapaneseSummary(text) {
    const templates = [
      "本日の金融市場に関する市場分析と取引の洞察。",
      "世界の取引所からの最新の金融ニュースと市場の更新。",
      "現在の市場状況における投資機会とリスク分析。",
      "経済指標と取引戦略への影響。",
      "主要資産のテクニカル分析と価格変動予測。"
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 生成韩文摘要
   * @param {string} text 原始文本
   * @returns {string} 韩文摘要
   */
  generateKoreanSummary(text) {
    const templates = [
      "오늘의 금융 시장에 대한 시장 분석 및 거래 통찰력.",
      "글로벌 거래소의 최신 금융 뉴스 및 시장 업데이트.",
      "현재 시장 상황에서의 투자 기회 및 위험 분석.",
      "경제 지표와 거래 전략에 미치는 영향.",
      "주요 자산의 기술적 분석 및 가격 변동 예측."
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 为所有新闻生成英文摘要
   * @param {Array} newsData 新闻数据
   * @returns {Array} 带英文摘要的数据
   */
  generateEnglishSummaries(newsData) {
    return newsData.map((item, index) => ({
      ...item,
      description: this.generateEnglishSummary(item.description, index + 1),
      originalDescription: item.description,
      translatedTo: 'en',
      isSummary: true
    }));
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.translationCache.clear();
    this.newsCache.translated.clear();
    console.log('📰 新闻翻译缓存已清除');
  }

  /**
   * 监听语言变化
   * @param {Function} callback 回调函数
   */
  onLanguageChange(callback) {
    // 监听localStorage变化
    window.addEventListener('storage', (e) => {
      if (e.key === 'lang') {
        const newLang = this.getCurrentDisplayLanguage();
        console.log('📰 检测到语言变化:', newLang);
        callback(newLang);
      }
    });
  }
}

// 创建单例实例
const newsLanguageService = new NewsLanguageService();

export default newsLanguageService;
