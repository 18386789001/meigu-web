/**
 * 批量更新所有语言文件，添加Sidebar和NotFound翻译
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 新增的翻译内容
const newTranslations = {
  'zh-TW': {
    sidebar: {
      welcome: '歡迎來到JPMX',
      subtitle: '專業交易平台',
      searchPlaceholder: '搜尋幣種、功能、公告...',
      mainFeatures: '主要功能',
      tradingTools: '交易工具',
      supportServices: '支援服務',
      darkMode: '夜間模式',
      support247: '24/7客服支援',
      downloadApp: '下載APP',
      language: '語言',
      forex: '外匯交易',
      crypto: '數位貨幣',
      stocks: '股票交易',
      commodities: '商品期貨'
    },
    notFound: {
      title: '頁面未找到',
      description: '抱歉，您訪問的頁面不存在或已被移除',
      goHome: '返回首頁',
      goBack: '返回上頁'
    }
  },
  'ja-JP': {
    sidebar: {
      welcome: 'JPMXへようこそ',
      subtitle: 'プロフェッショナル取引プラットフォーム',
      searchPlaceholder: '通貨、機能、お知らせを検索...',
      mainFeatures: 'メイン機能',
      tradingTools: '取引ツール',
      supportServices: 'サポートサービス',
      darkMode: 'ダークモード',
      support247: '24/7カスタマーサポート',
      downloadApp: 'アプリをダウンロード',
      language: '言語',
      forex: 'FX取引',
      crypto: '暗号通貨',
      stocks: '株式取引',
      commodities: 'コモディティ'
    },
    notFound: {
      title: 'ページが見つかりません',
      description: '申し訳ございませんが、お探しのページは存在しないか削除されました',
      goHome: 'ホームに戻る',
      goBack: '前のページに戻る'
    }
  },
  'ko-KR': {
    sidebar: {
      welcome: 'JPMX에 오신 것을 환영합니다',
      subtitle: '전문 거래 플랫폼',
      searchPlaceholder: '통화, 기능, 공지사항 검색...',
      mainFeatures: '주요 기능',
      tradingTools: '거래 도구',
      supportServices: '지원 서비스',
      darkMode: '다크 모드',
      support247: '24/7 고객 지원',
      downloadApp: '앱 다운로드',
      language: '언어',
      forex: '외환 거래',
      crypto: '암호화폐',
      stocks: '주식 거래',
      commodities: '상품'
    },
    notFound: {
      title: '페이지를 찾을 수 없습니다',
      description: '죄송합니다. 찾으시는 페이지가 존재하지 않거나 삭제되었습니다',
      goHome: '홈으로 가기',
      goBack: '이전 페이지로'
    }
  },
  'th-TH': {
    sidebar: {
      welcome: 'ยินดีต้อนรับสู่ JPMX',
      subtitle: 'แพลตฟอร์มการซื้อขายมืออาชีพ',
      searchPlaceholder: 'ค้นหาสกุลเงิน คุณสมบัติ ประกาศ...',
      mainFeatures: 'คุณสมบัติหลัก',
      tradingTools: 'เครื่องมือการซื้อขาย',
      supportServices: 'บริการสนับสนุน',
      darkMode: 'โหมดมืด',
      support247: 'การสนับสนุนลูกค้า 24/7',
      downloadApp: 'ดาวน์โหลดแอป',
      language: 'ภาษา',
      forex: 'การซื้อขายฟอเร็กซ์',
      crypto: 'สกุลเงินดิจิทัล',
      stocks: 'การซื้อขายหุ้น',
      commodities: 'สินค้าโภคภัณฑ์'
    },
    notFound: {
      title: 'ไม่พบหน้า',
      description: 'ขออภัย หน้าที่คุณกำลังมองหาไม่มีอยู่หรือถูกลบแล้ว',
      goHome: 'กลับหน้าแรก',
      goBack: 'กลับหน้าก่อน'
    }
  },
  'vi-VN': {
    sidebar: {
      welcome: 'Chào mừng đến với JPMX',
      subtitle: 'Nền tảng giao dịch chuyên nghiệp',
      searchPlaceholder: 'Tìm kiếm tiền tệ, tính năng, thông báo...',
      mainFeatures: 'Tính năng chính',
      tradingTools: 'Công cụ giao dịch',
      supportServices: 'Dịch vụ hỗ trợ',
      darkMode: 'Chế độ tối',
      support247: 'Hỗ trợ khách hàng 24/7',
      downloadApp: 'Tải ứng dụng',
      language: 'Ngôn ngữ',
      forex: 'Giao dịch Forex',
      crypto: 'Tiền điện tử',
      stocks: 'Giao dịch cổ phiếu',
      commodities: 'Hàng hóa'
    },
    notFound: {
      title: 'Không tìm thấy trang',
      description: 'Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa',
      goHome: 'Về trang chủ',
      goBack: 'Quay lại'
    }
  },
  'de-DE': {
    sidebar: {
      welcome: 'Willkommen bei JPMX',
      subtitle: 'Professionelle Handelsplattform',
      searchPlaceholder: 'Währungen, Funktionen, Ankündigungen suchen...',
      mainFeatures: 'Hauptfunktionen',
      tradingTools: 'Handelstools',
      supportServices: 'Support-Services',
      darkMode: 'Dunkler Modus',
      support247: '24/7 Kundensupport',
      downloadApp: 'App herunterladen',
      language: 'Sprache',
      forex: 'Forex-Handel',
      crypto: 'Kryptowährung',
      stocks: 'Aktienhandel',
      commodities: 'Rohstoffe'
    },
    notFound: {
      title: 'Seite nicht gefunden',
      description: 'Entschuldigung, die gesuchte Seite existiert nicht oder wurde entfernt',
      goHome: 'Zur Startseite',
      goBack: 'Zurück'
    }
  },
  'es-ES': {
    sidebar: {
      welcome: 'Bienvenido a JPMX',
      subtitle: 'Plataforma de trading profesional',
      searchPlaceholder: 'Buscar divisas, funciones, anuncios...',
      mainFeatures: 'Características principales',
      tradingTools: 'Herramientas de trading',
      supportServices: 'Servicios de soporte',
      darkMode: 'Modo oscuro',
      support247: 'Soporte al cliente 24/7',
      downloadApp: 'Descargar app',
      language: 'Idioma',
      forex: 'Trading de Forex',
      crypto: 'Criptomonedas',
      stocks: 'Trading de acciones',
      commodities: 'Materias primas'
    },
    notFound: {
      title: 'Página no encontrada',
      description: 'Lo sentimos, la página que buscas no existe o ha sido eliminada',
      goHome: 'Ir al inicio',
      goBack: 'Volver'
    }
  },
  'fr-FR': {
    sidebar: {
      welcome: 'Bienvenue chez JPMX',
      subtitle: 'Plateforme de trading professionnelle',
      searchPlaceholder: 'Rechercher devises, fonctionnalités, annonces...',
      mainFeatures: 'Fonctionnalités principales',
      tradingTools: 'Outils de trading',
      supportServices: 'Services de support',
      darkMode: 'Mode sombre',
      support247: 'Support client 24/7',
      downloadApp: 'Télécharger l\'app',
      language: 'Langue',
      forex: 'Trading Forex',
      crypto: 'Cryptomonnaies',
      stocks: 'Trading d\'actions',
      commodities: 'Matières premières'
    },
    notFound: {
      title: 'Page non trouvée',
      description: 'Désolé, la page que vous recherchez n\'existe pas ou a été supprimée',
      goHome: 'Aller à l\'accueil',
      goBack: 'Retour'
    }
  },
  'it-IT': {
    sidebar: {
      welcome: 'Benvenuto in JPMX',
      subtitle: 'Piattaforma di trading professionale',
      searchPlaceholder: 'Cerca valute, funzionalità, annunci...',
      mainFeatures: 'Caratteristiche principali',
      tradingTools: 'Strumenti di trading',
      supportServices: 'Servizi di supporto',
      darkMode: 'Modalità scura',
      support247: 'Supporto clienti 24/7',
      downloadApp: 'Scarica app',
      language: 'Lingua',
      forex: 'Trading Forex',
      crypto: 'Criptovalute',
      stocks: 'Trading azionario',
      commodities: 'Materie prime'
    },
    notFound: {
      title: 'Pagina non trovata',
      description: 'Spiacenti, la pagina che stai cercando non esiste o è stata rimossa',
      goHome: 'Vai alla home',
      goBack: 'Indietro'
    }
  },
  'pt-PT': {
    sidebar: {
      welcome: 'Bem-vindo ao JPMX',
      subtitle: 'Plataforma de trading profissional',
      searchPlaceholder: 'Pesquisar moedas, funcionalidades, anúncios...',
      mainFeatures: 'Características principais',
      tradingTools: 'Ferramentas de trading',
      supportServices: 'Serviços de suporte',
      darkMode: 'Modo escuro',
      support247: 'Suporte ao cliente 24/7',
      downloadApp: 'Baixar app',
      language: 'Idioma',
      forex: 'Trading Forex',
      crypto: 'Criptomoedas',
      stocks: 'Trading de ações',
      commodities: 'Commodities'
    },
    notFound: {
      title: 'Página não encontrada',
      description: 'Desculpe, a página que procura não existe ou foi removida',
      goHome: 'Ir para início',
      goBack: 'Voltar'
    }
  },
  'el-GR': {
    sidebar: {
      welcome: 'Καλώς ήρθατε στο JPMX',
      subtitle: 'Επαγγελματική πλατφόρμα συναλλαγών',
      searchPlaceholder: 'Αναζήτηση νομισμάτων, λειτουργιών, ανακοινώσεων...',
      mainFeatures: 'Κύρια χαρακτηριστικά',
      tradingTools: 'Εργαλεία συναλλαγών',
      supportServices: 'Υπηρεσίες υποστήριξης',
      darkMode: 'Σκοτεινή λειτουργία',
      support247: 'Υποστήριξη πελατών 24/7',
      downloadApp: 'Λήψη εφαρμογής',
      language: 'Γλώσσα',
      forex: 'Συναλλαγές Forex',
      crypto: 'Κρυπτονομίσματα',
      stocks: 'Συναλλαγές μετοχών',
      commodities: 'Εμπορεύματα'
    },
    notFound: {
      title: 'Η σελίδα δεν βρέθηκε',
      description: 'Λυπούμαστε, η σελίδα που αναζητάτε δεν υπάρχει ή έχει αφαιρεθεί',
      goHome: 'Πήγαινε στην αρχική',
      goBack: 'Πίσω'
    }
  }
};

// 语言文件路径
const i18nDir = path.join(__dirname, 'src/i18n');

// 更新语言文件的函数
function updateLanguageFile(langCode, translations) {
  const filePath = path.join(i18nDir, `${langCode}.js`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${filePath}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 查找header部分的结束位置
    const headerEndRegex = /(\s+\/\/ Header[\s\S]*?},)/;
    const headerMatch = content.match(headerEndRegex);
    
    if (!headerMatch) {
      console.log(`⚠️  无法找到header部分: ${langCode}.js`);
      return;
    }
    
    // 构建新的翻译内容
    const sidebarTranslation = `
  
  // Sidebar
  sidebar: {
    welcome: '${translations.sidebar.welcome}',
    subtitle: '${translations.sidebar.subtitle}',
    searchPlaceholder: '${translations.sidebar.searchPlaceholder}',
    mainFeatures: '${translations.sidebar.mainFeatures}',
    tradingTools: '${translations.sidebar.tradingTools}',
    supportServices: '${translations.sidebar.supportServices}',
    darkMode: '${translations.sidebar.darkMode}',
    support247: '${translations.sidebar.support247}',
    downloadApp: '${translations.sidebar.downloadApp}',
    language: '${translations.sidebar.language}',
    forex: '${translations.sidebar.forex}',
    crypto: '${translations.sidebar.crypto}',
    stocks: '${translations.sidebar.stocks}',
    commodities: '${translations.sidebar.commodities}'
  },
  
  // Not Found Page
  notFound: {
    title: '${translations.notFound.title}',
    description: '${translations.notFound.description}',
    goHome: '${translations.notFound.goHome}',
    goBack: '${translations.notFound.goBack}'
  },`;
    
    // 在header部分后插入新的翻译
    const newContent = content.replace(headerEndRegex, `$1${sidebarTranslation}`);
    
    // 写入文件
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ 已更新: ${langCode}.js`);
    
  } catch (error) {
    console.error(`❌ 更新失败 ${langCode}.js:`, error.message);
  }
}

// 批量更新所有语言文件
console.log('🚀 开始批量更新语言文件...\n');

Object.keys(newTranslations).forEach(langCode => {
  updateLanguageFile(langCode, newTranslations[langCode]);
});

console.log('\n🎉 批量更新完成！');
console.log('\n📋 更新内容:');
console.log('- 添加了 sidebar 翻译（侧边栏相关）');
console.log('- 添加了 notFound 翻译（404页面相关）');
console.log('- 涵盖了所有支持的语言版本');
