const fs = require('fs');
const path = require('path');

// 定义所有语言的sidebar翻译
const sidebarTranslations = {
  'ko-KR.js': {
    trading: '거래',
    forexTrading: '외환 거래',
    cryptocurrency: '암호화폐',
    stockTrading: '주식 거래',
    commodityFutures: '상품 선물',
    services: '서비스',
    tradingPlatform: '거래 플랫폼',
    educationCenter: '교육 센터',
    marketAnalysis: '시장 분석',
    customerSupport: '고객 지원',
    account: '계정',
    login: '로그인',
    register: '등록'
  },
  'th-TH.js': {
    trading: 'การเทรด',
    forexTrading: 'การเทรดฟอเร็กซ์',
    cryptocurrency: 'สกุลเงินดิจิทัล',
    stockTrading: 'การเทรดหุ้น',
    commodityFutures: 'ฟิวเจอร์สสินค้าโภคภัณฑ์',
    services: 'บริการ',
    tradingPlatform: 'แพลตฟอร์มการเทรด',
    educationCenter: 'ศูนย์การศึกษา',
    marketAnalysis: 'การวิเคราะห์ตลาด',
    customerSupport: 'การสนับสนุนลูกค้า',
    account: 'บัญชี',
    login: 'เข้าสู่ระบบ',
    register: 'ลงทะเบียน'
  },
  'vi-VN.js': {
    trading: 'Giao dịch',
    forexTrading: 'Giao dịch Forex',
    cryptocurrency: 'Tiền điện tử',
    stockTrading: 'Giao dịch cổ phiếu',
    commodityFutures: 'Hàng hóa tương lai',
    services: 'Dịch vụ',
    tradingPlatform: 'Nền tảng giao dịch',
    educationCenter: 'Trung tâm giáo dục',
    marketAnalysis: 'Phân tích thị trường',
    customerSupport: 'Hỗ trợ khách hàng',
    account: 'Tài khoản',
    login: 'Đăng nhập',
    register: 'Đăng ký'
  },
  'de-DE.js': {
    trading: 'Trading',
    forexTrading: 'Forex Trading',
    cryptocurrency: 'Kryptowährung',
    stockTrading: 'Aktien Trading',
    commodityFutures: 'Rohstoff Futures',
    services: 'Dienstleistungen',
    tradingPlatform: 'Trading-Plattform',
    educationCenter: 'Bildungszentrum',
    marketAnalysis: 'Marktanalyse',
    customerSupport: 'Kundensupport',
    account: 'Konto',
    login: 'Anmelden',
    register: 'Registrieren'
  },
  'es-ES.js': {
    trading: 'Trading',
    forexTrading: 'Trading de Forex',
    cryptocurrency: 'Criptomonedas',
    stockTrading: 'Trading de Acciones',
    commodityFutures: 'Futuros de Commodities',
    services: 'Servicios',
    tradingPlatform: 'Plataforma de Trading',
    educationCenter: 'Centro de Educación',
    marketAnalysis: 'Análisis de Mercado',
    customerSupport: 'Soporte al Cliente',
    account: 'Cuenta',
    login: 'Iniciar Sesión',
    register: 'Registrarse'
  },
  'fr-FR.js': {
    trading: 'Trading',
    forexTrading: 'Trading Forex',
    cryptocurrency: 'Cryptomonnaie',
    stockTrading: 'Trading d\'Actions',
    commodityFutures: 'Futures de Matières Premières',
    services: 'Services',
    tradingPlatform: 'Plateforme de Trading',
    educationCenter: 'Centre d\'Éducation',
    marketAnalysis: 'Analyse de Marché',
    customerSupport: 'Support Client',
    account: 'Compte',
    login: 'Connexion',
    register: 'S\'inscrire'
  },
  'it-IT.js': {
    trading: 'Trading',
    forexTrading: 'Trading Forex',
    cryptocurrency: 'Criptovaluta',
    stockTrading: 'Trading Azionario',
    commodityFutures: 'Futures su Materie Prime',
    services: 'Servizi',
    tradingPlatform: 'Piattaforma di Trading',
    educationCenter: 'Centro Educativo',
    marketAnalysis: 'Analisi di Mercato',
    customerSupport: 'Supporto Clienti',
    account: 'Account',
    login: 'Accedi',
    register: 'Registrati'
  },
  'pt-PT.js': {
    trading: 'Trading',
    forexTrading: 'Trading Forex',
    cryptocurrency: 'Criptomoeda',
    stockTrading: 'Trading de Ações',
    commodityFutures: 'Futuros de Commodities',
    services: 'Serviços',
    tradingPlatform: 'Plataforma de Trading',
    educationCenter: 'Centro de Educação',
    marketAnalysis: 'Análise de Mercado',
    customerSupport: 'Suporte ao Cliente',
    account: 'Conta',
    login: 'Entrar',
    register: 'Registar'
  },
  'el-GR.js': {
    trading: 'Trading',
    forexTrading: 'Forex Trading',
    cryptocurrency: 'Κρυπτονομίσματα',
    stockTrading: 'Trading Μετοχών',
    commodityFutures: 'Μελλοντικά Εμπορεύματα',
    services: 'Υπηρεσίες',
    tradingPlatform: 'Πλατφόρμα Trading',
    educationCenter: 'Κέντρο Εκπαίδευσης',
    marketAnalysis: 'Ανάλυση Αγοράς',
    customerSupport: 'Υποστήριξη Πελατών',
    account: 'Λογαριασμός',
    login: 'Σύνδεση',
    register: 'Εγγραφή'
  }
};

// 更新每个语言文件
Object.entries(sidebarTranslations).forEach(([filename, translations]) => {
  const filePath = path.join(__dirname, 'src', 'i18n', filename);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 查找header部分的结束位置
    const headerEndMatch = content.match(/header:\s*\{[^}]*\},/);
    if (headerEndMatch) {
      const headerEndIndex = content.indexOf(headerEndMatch[0]) + headerEndMatch[0].length;
      
      // 构建sidebar部分
      const sidebarSection = `\n  // Sidebar\n  sidebar: {\n` +
        Object.entries(translations).map(([key, value]) => `    ${key}: '${value}'`).join(',\n') +
        `\n  },\n`;
      
      // 在header部分后插入sidebar部分
      content = content.slice(0, headerEndIndex) + sidebarSection + content.slice(headerEndIndex);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filename}`);
    } else {
      console.log(`Could not find header section in ${filename}`);
    }
  } else {
    console.log(`File not found: ${filename}`);
  }
});

console.log('Sidebar translations updated for all language files!');
