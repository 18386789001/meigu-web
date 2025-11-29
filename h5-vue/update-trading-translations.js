import fs from 'fs';
import path from 'path';

// 新的翻译内容
const newTranslations = {
  'ja-JP': {
    // Trading stocks
    'trading.stocks.title': '株式取引',
    'trading.stocks.description': '世界主要株式市場',
    'trading.stocks.companies': '企業',
    'trading.stocks.trading': '取引',
    'trading.stocks.commission': '手数料',
    'trading.stocks.hotStocks': '人気株式',
    'trading.stocks.marketOpen': '市場開放',
    'trading.stocks.high': '高値',
    'trading.stocks.low': '安値',
    'trading.stocks.volume': '出来高',
    'trading.stocks.chart': 'チャート',
    'trading.stocks.trade': '取引',
    'trading.stocks.advantages': '取引の優位性',
    'trading.stocks.globalMarket': 'グローバル市場',
    'trading.stocks.globalMarketDesc': '世界主要取引所をカバー',
    'trading.stocks.analysis': 'プロ分析',
    'trading.stocks.analysisDesc': 'プロアナリストチーム',
    'trading.stocks.fastExecution': '高速執行',
    'trading.stocks.fastExecutionDesc': 'ミリ秒レベルの注文執行',
    'trading.stocks.lowCost': '低コスト',
    'trading.stocks.lowCostDesc': '超低手数料率',
    'trading.stocks.realTime': 'リアルタイムデータ',
    'trading.stocks.realTimeDesc': 'リアルタイム市場相場',
    'trading.stocks.professional': 'プロサービス',
    'trading.stocks.professionalDesc': 'プロ投資アドバイザー',
    
    // Stock company names
    'stocks.apple': 'アップル社',
    'stocks.microsoft': 'マイクロソフト社',
    'stocks.tesla': 'テスラ社',
    'stocks.amazon': 'アマゾン社',
    'stocks.google': 'グーグル社',
    'stocks.meta': 'メタ社',
    
    // Trading commodities
    'trading.commodities.title': '商品先物取引',
    'trading.commodities.description': '世界商品投資取引',
    'trading.commodities.commodities': '商品種類',
    'trading.commodities.trading': '取引時間',
    'trading.commodities.leverage': 'レバレッジ比率',
    'trading.commodities.categories': '商品分類',
    'trading.commodities.items': '種商品',
    'trading.commodities.hotCommodities': '人気商品',
    'trading.commodities.marketOpen': '市場開放',
    'trading.commodities.chart': 'チャート',
    'trading.commodities.trade': '取引',
    'trading.commodities.high': '高値',
    'trading.commodities.low': '安値',
    'trading.commodities.spread': 'スプレッド',
    'trading.commodities.advantages': '取引の優位性',
    'trading.commodities.diversified': '多様化投資',
    'trading.commodities.diversifiedDesc': '貴金属、エネルギー、農産物等をカバー',
    'trading.commodities.highLeverage': '高レバレッジ',
    'trading.commodities.leverageDesc': '最大1:100レバレッジ取引',
    'trading.commodities.hedging': 'ヘッジ保全',
    'trading.commodities.hedgingDesc': 'インフレリスクの効果的ヘッジ',
    'trading.commodities.categories.preciousMetals': '貴金属',
    'trading.commodities.categories.energy': 'エネルギー',
    'trading.commodities.categories.agricultural': '農産物',
    'trading.commodities.categories.industrialMetals': '工業金属',
    'trading.commodities.items.gold': '金',
    'trading.commodities.items.goldDesc': '現物金',
    'trading.commodities.items.silver': '銀',
    'trading.commodities.items.silverDesc': '現物銀',
    'trading.commodities.items.oil': '原油',
    'trading.commodities.items.oilDesc': '米国原油',
    'trading.commodities.items.naturalGas': '天然ガス',
    'trading.commodities.items.naturalGasDesc': '天然ガス先物',
    'trading.commodities.items.copper': '銅',
    'trading.commodities.items.copperDesc': '銅先物',
    'trading.commodities.items.wheat': '小麦',
    'trading.commodities.items.wheatDesc': '小麦先物',
    
    // Platform
    'platform.title': '取引プラットフォーム',
    'platform.description': 'プロ取引プラットフォーム、安定信頼',
    'platform.platforms': 'プラットフォーム',
    'platform.uptime': '安定性',
    'platform.support': 'サポート',
    'platform.availablePlatforms': '利用可能プラットフォーム',
    'platform.all': '全て',
    'platform.desktop': 'デスクトップ版',
    'platform.mobile': 'モバイル取引',
    'platform.web': 'Web取引',
    'platform.spread': 'スプレッド',
    'platform.leverage': 'レバレッジ',
    'platform.execution': '執行',
    'platform.download': 'ダウンロード',
    'platform.tryDemo': 'デモ試用',
    'platform.advantages': 'プラットフォームの優位性',
    'platform.reliable': '安定信頼',
    'platform.reliableDesc': '99.9%安定稼働',
    'platform.fast': '高速執行',
    'platform.fastDesc': 'ミリ秒レベル注文執行',
    'platform.secure': 'セキュリティ保護',
    'platform.secureDesc': '銀行レベルセキュリティ暗号化',
    'platform.multiDevice': 'マルチデバイス対応',
    'platform.multiDeviceDesc': 'マルチデバイス同期対応',
    'platform.mt5Desktop': 'プロデスクトップ取引プラットフォーム',
    'platform.mt5Mobile': 'モバイル取引アプリ',
    'platform.mt5Web': 'ウェブ版取引プラットフォーム',
    'platform.mt4Classic': 'クラシック取引プラットフォーム',
    'platform.platformTypes.desktop': 'デスクトップ版',
    'platform.platformTypes.mobile': 'モバイル版',
    'platform.platformTypes.web': 'ウェブ版',
    'platform.platformTypes.legacy': 'クラシック版',
    'platform.features.advancedCharts': '高度チャート分析',
    'platform.features.eaTrading': 'EA自動取引',
    'platform.features.multiAccount': 'マルチアカウント管理',
    'platform.features.marketDepth': '市場深度表示',
    'platform.features.realTimePush': 'リアルタイム相場プッシュ',
    'platform.features.oneClickTrading': 'ワンクリック取引',
    'platform.features.chartAnalysis': 'チャート分析',
    'platform.features.accountManagement': 'アカウント管理',
    'platform.features.noDownload': 'ダウンロード不要',
    'platform.features.crossPlatform': 'クロスプラットフォーム対応',
    'platform.features.realTimeSync': 'リアルタイム同期',
    'platform.features.cloudStorage': 'クラウドストレージ',
    'platform.features.classicInterface': 'クラシックインターフェース',
    'platform.features.stableReliable': '安定信頼',
    'platform.features.richIndicators': '豊富な指標',
    'platform.features.wideSupport': '幅広いサポート'
  },
  
  'ko-KR': {
    // Trading stocks
    'trading.stocks.title': '주식 거래',
    'trading.stocks.description': '글로벌 주요 주식 시장',
    'trading.stocks.companies': '회사',
    'trading.stocks.trading': '거래',
    'trading.stocks.commission': '수수료',
    'trading.stocks.hotStocks': '인기 주식',
    'trading.stocks.marketOpen': '시장 개방',
    'trading.stocks.high': '최고가',
    'trading.stocks.low': '최저가',
    'trading.stocks.volume': '거래량',
    'trading.stocks.chart': '차트',
    'trading.stocks.trade': '거래',
    'trading.stocks.advantages': '거래 우위',
    'trading.stocks.globalMarket': '글로벌 시장',
    'trading.stocks.globalMarketDesc': '글로벌 주요 거래소 커버',
    'trading.stocks.analysis': '전문 분석',
    'trading.stocks.analysisDesc': '전문 분석가 팀',
    'trading.stocks.fastExecution': '빠른 실행',
    'trading.stocks.fastExecutionDesc': '밀리초 수준 주문 실행',
    'trading.stocks.lowCost': '저비용',
    'trading.stocks.lowCostDesc': '초저 수수료율',
    'trading.stocks.realTime': '실시간 데이터',
    'trading.stocks.realTimeDesc': '실시간 시장 시세',
    'trading.stocks.professional': '전문 서비스',
    'trading.stocks.professionalDesc': '전문 투자 고문',
    
    // Stock company names
    'stocks.apple': '애플 회사',
    'stocks.microsoft': '마이크로소프트 회사',
    'stocks.tesla': '테슬라 회사',
    'stocks.amazon': '아마존 회사',
    'stocks.google': '구글 회사',
    'stocks.meta': '메타 회사',
    
    // Trading commodities
    'trading.commodities.title': '상품 선물 거래',
    'trading.commodities.description': '글로벌 상품 투자 거래',
    'trading.commodities.commodities': '상품 종류',
    'trading.commodities.trading': '거래 시간',
    'trading.commodities.leverage': '레버리지 비율',
    'trading.commodities.categories': '상품 분류',
    'trading.commodities.items': '종 상품',
    'trading.commodities.hotCommodities': '인기 상품',
    'trading.commodities.marketOpen': '시장 개방',
    'trading.commodities.chart': '차트',
    'trading.commodities.trade': '거래',
    'trading.commodities.high': '최고가',
    'trading.commodities.low': '최저가',
    'trading.commodities.spread': '스프레드',
    'trading.commodities.advantages': '거래 우위',
    'trading.commodities.diversified': '다양화 투자',
    'trading.commodities.diversifiedDesc': '귀금속, 에너지, 농산물 등 커버',
    'trading.commodities.highLeverage': '고레버리지',
    'trading.commodities.leverageDesc': '최대 1:100 레버리지 거래',
    'trading.commodities.hedging': '헤지 보전',
    'trading.commodities.hedgingDesc': '인플레이션 리스크 효과적 헤지',
    'trading.commodities.categories.preciousMetals': '귀금속',
    'trading.commodities.categories.energy': '에너지',
    'trading.commodities.categories.agricultural': '농산물',
    'trading.commodities.categories.industrialMetals': '산업 금속',
    'trading.commodities.items.gold': '금',
    'trading.commodities.items.goldDesc': '현물 금',
    'trading.commodities.items.silver': '은',
    'trading.commodities.items.silverDesc': '현물 은',
    'trading.commodities.items.oil': '원유',
    'trading.commodities.items.oilDesc': '미국 원유',
    'trading.commodities.items.naturalGas': '천연가스',
    'trading.commodities.items.naturalGasDesc': '천연가스 선물',
    'trading.commodities.items.copper': '구리',
    'trading.commodities.items.copperDesc': '구리 선물',
    'trading.commodities.items.wheat': '밀',
    'trading.commodities.items.wheatDesc': '밀 선물',
    
    // Platform
    'platform.title': '거래 플랫폼',
    'platform.description': '전문 거래 플랫폼, 안정 신뢰',
    'platform.platforms': '플랫폼',
    'platform.uptime': '안정성',
    'platform.support': '지원',
    'platform.availablePlatforms': '사용 가능한 플랫폼',
    'platform.all': '전체',
    'platform.desktop': '데스크톱 버전',
    'platform.mobile': '모바일 거래',
    'platform.web': '웹 거래',
    'platform.spread': '스프레드',
    'platform.leverage': '레버리지',
    'platform.execution': '실행',
    'platform.download': '다운로드',
    'platform.tryDemo': '데모 체험',
    'platform.advantages': '플랫폼 우위',
    'platform.reliable': '안정 신뢰',
    'platform.reliableDesc': '99.9% 안정 운영',
    'platform.fast': '빠른 실행',
    'platform.fastDesc': '밀리초 수준 주문 실행',
    'platform.secure': '보안 보호',
    'platform.secureDesc': '은행급 보안 암호화',
    'platform.multiDevice': '멀티 디바이스 지원',
    'platform.multiDeviceDesc': '멀티 디바이스 동기화 지원'
  }
};

// 언어 파일 업데이트 함수
function updateLanguageFile(langCode, translations) {
  const filePath = path.join('src', 'i18n', `${langCode}.js`);
  
  try {
    // 파일 읽기
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 각 번역 키-값 쌍을 파일에 추가
    Object.entries(translations).forEach(([key, value]) => {
      const keyPath = key.split('.');
      
      // 간단한 키 추가 로직 (기존 구조를 유지하면서)
      if (!content.includes(`${key}:`)) {
        // 적절한 위치를 찾아 키를 추가
        const insertPoint = findInsertionPoint(content, keyPath);
        if (insertPoint !== -1) {
          const indent = getIndentation(content, insertPoint);
          const newLine = `${indent}${keyPath[keyPath.length - 1]}: '${value}',\n`;
          content = content.slice(0, insertPoint) + newLine + content.slice(insertPoint);
        }
      }
    });
    
    // 파일 쓰기
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${langCode}.js`);
    
  } catch (error) {
    console.error(`❌ Error updating ${langCode}.js:`, error.message);
  }
}

// 삽입 지점 찾기 함수
function findInsertionPoint(content, keyPath) {
  // 간단한 구현: 파일 끝에서 두 번째 줄에 삽입
  const lines = content.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('};')) {
      return content.lastIndexOf(lines[i]);
    }
  }
  return -1;
}

// 들여쓰기 가져오기 함수
function getIndentation(content, position) {
  const lines = content.slice(0, position).split('\n');
  const lastLine = lines[lines.length - 1];
  const match = lastLine.match(/^(\s*)/);
  return match ? match[1] : '  ';
}

// 메인 실행
console.log('🚀 Updating trading translations...');

Object.entries(newTranslations).forEach(([langCode, translations]) => {
  updateLanguageFile(langCode, translations);
});

console.log('✨ Translation update completed!');
