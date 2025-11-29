import fs from 'fs';
import path from 'path';
import https from 'https';

// 简单可靠的图标源
function getIconUrls(symbol) {
  const lower = symbol.toLowerCase();
  const upper = symbol.toUpperCase();
  
  return [
    `https://cryptologos.cc/logos/${lower}-${lower}-logo.png`,
    `https://assets.coincap.io/assets/icons/${lower}@2x.png`,
    `https://bin.bnbstatic.com/static/assets/logos/${upper}.png`,
    `https://cryptoicons.org/api/icon/${lower}/200`
  ];
}

// 下载图标
async function downloadIcon(symbol, targetPath) {
  const urls = getIconUrls(symbol);
  
  for (const url of urls) {
    try {
      console.log(`🔍 尝试: ${url}`);
      await downloadFromUrl(url, targetPath);
      
      // 验证文件
      const stats = fs.statSync(targetPath);
      if (stats.size > 100) {
        console.log(`✅ 成功: ${symbol} (${stats.size} bytes)`);
        return true;
      } else {
        // 删除空文件
        fs.unlinkSync(targetPath);
      }
    } catch (error) {
      console.log(`❌ 失败: ${error.message}`);
      continue;
    }
  }
  
  throw new Error('所有URL都失败');
}

// 从URL下载
function downloadFromUrl(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 主函数
async function downloadSimpleIcons() {
  const targetDir = 'd:\\wwwroot\\dddd\\mt5\\template\\wap-vue\\public\\symbol';
  
  // 扩展的主流币种列表
  const symbols = [
    //目前的货币
    'XAUT','XHB','MLN','YFI','AVA','BCH','TRUMP','CYBER','EURQ','ARTY','ORCA',
    // 主要加密货币 (Top 20)
    'BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'DOT', 'AVAX', 'SHIB',
    'MATIC', 'LTC', 'UNI', 'LINK', 'ATOM', 'NEAR', 'FTM', 'ALGO', 'XLM', 'VET',
    
    // 稳定币
    'USDT', 'USDC', 'BUSD', 'DAI', 'FRAX', 'USDD', 'TUSD', 'USDP', 'GUSD', 'LUSD',
    
    // DeFi 代币
    'AAVE', 'MKR', 'COMP', 'SNX', 'CRV', 'SUSHI', 'YFI', 'BAL', 'REN', 'KNC',
    'ZRX', 'BAND', 'RSR', 'STORJ', 'ANT', 'BNT', 'LRC', 'NMR', '1INCH', 'ALPHA',
    
    // Layer 2 & 扩容方案
    'ARB', 'OP', 'IMX', 'LRC', 'MATIC', 'METIS', 'BOBA',
    
    // 智能合约平台
    'ETH', 'ADA', 'SOL', 'DOT', 'AVAX', 'NEAR', 'FTM', 'ALGO', 'ATOM', 'LUNA',
    'EGLD', 'HBAR', 'ICP', 'EOS', 'TRX', 'XTZ', 'WAVES', 'NEO', 'ONT', 'QTUM',
    
    // 存储 & 基础设施
    'FIL', 'AR', 'STORJ', 'SC', 'THETA', 'TFUEL', 'HNT', 'RNDR',
    
    // 游戏 & NFT
    'AXS', 'SLP', 'SAND', 'MANA', 'ENJ', 'CHZ', 'FLOW', 'WAX', 'GALA', 'ILV',
    'ALICE', 'TLM', 'SPS', 'GMT', 'GST', 'STEPN', 'APE', 'LOOKS', 'X2Y2',
    
    // Meme 币
    'DOGE', 'SHIB', 'FLOKI', 'BABYDOGE', 'ELON', 'DOGELON', 'KISHU', 'AKITA',
    
    // 交易所代币
    'BNB', 'FTT', 'CRO', 'LEO', 'OKB', 'HT', 'KCS', 'GT', 'MX',
    
    // 隐私币
    'XMR', 'ZEC', 'DASH', 'ZEN', 'FIRO', 'BEAM', 'GRIN',
    
    // 老牌币种
    'LTC', 'BCH', 'BSV', 'ETC', 'XRP', 'XLM', 'DOGE', 'ZEC', 'DASH',
    
    // 新兴热门
    'APT', 'SUI', 'OP', 'ARB', 'BLUR', 'PEPE', 'WOJAK', 'TURBO', 'AIDOGE',
    
    // 中国概念币
    'NEO', 'ONT', 'VET', 'QTUM', 'IOST', 'TRX', 'BTM', 'HC', 'ELA',
    
    // 企业级/机构币
    'XRP', 'XLM', 'HBAR', 'ALGO', 'VET', 'IOTA', 'QNT', 'CSPR',
    
    // 跨链桥接
    'WBTC', 'WETH', 'STETH', 'RETH', 'CBETH', 'FRXETH',
    
    // 收益农场
    'CAKE', 'BAKE', 'AUTO', 'BELT', 'BUNNY', 'EPS', 'MDX', 'XVS',
    
    // BSC 生态
    'CAKE', 'BAKE', 'AUTO', 'BELT', 'ALPACA', 'XVS', 'VAI', 'SXP', 'TWT',
    
    // Solana 生态
    'SOL', 'RAY', 'SRM', 'FIDA', 'ROPE', 'COPE', 'STEP', 'MEDIA', 'LIKE',
    
    // Polygon 生态
    'MATIC', 'QUICK', 'GHST', 'DQUICK', 'WMATIC',
    
    // Avalanche 生态
    'AVAX', 'JOE', 'PNG', 'QI', 'XAVA', 'YAK',
    
    // Fantom 生态
    'FTM', 'BOO', 'SPIRIT', 'LQDR', 'SCREAM', 'GEIST',
    
    // 预言机
    'LINK', 'BAND', 'TRB', 'API3', 'DIA', 'UMA',
    
    // 指数基金
    'DPI', 'MVI', 'BED', 'DATA', 'GMI',
    
    // 合成资产
    'SNX', 'MIR', 'LUNA', 'UST', 'ANCHOR', 'MINE',
    
    // 借贷协议
    'AAVE', 'COMP', 'MKR', 'CREAM', 'VENUS', 'BENQI', 'GEIST',
    
    // 保险协议
    'NXM', 'COVER', 'INS', 'INFI', 'ARMOR',
    
    // 衍生品
    'PERP', 'DYDX', 'GMX', 'GNS', 'KWENTA', 'LYRA',
    
    // 资产管理
    'YFI', 'YFII', 'FARM', 'HARVEST', 'PICKLE', 'BADGER',
    
    // 支付币
    'XRP', 'XLM', 'NANO', 'DASH', 'LTC', 'BCH', 'DOGE',
    
    // 物联网
    'IOTA', 'VET', 'HNT', 'IOTX', 'WTC', 'AMB',
    
    // 供应链
    'VET', 'WTC', 'TRAC', 'AMB', 'FOOD', 'SUPPLY',
    
    // 社交代币
    'CHZ', 'AUDIO', 'RALLY', 'WHALE', 'ALEX', 'MASK',
    
    // 元宇宙相关
    'SAND', 'MANA', 'AXS', 'GALA', 'ALICE', 'TLM', 'STARL', 'UFO', 'HERO'
  ];
  
  // 去重处理
  const uniqueSymbols = [...new Set(symbols)];
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  console.log(`🚀 开始下载 ${uniqueSymbols.length} 个主流币种图标...\n`);
  
  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  
  for (let i = 0; i < uniqueSymbols.length; i++) {
    const symbol = uniqueSymbols[i];
    const targetPath = path.join(targetDir, `${symbol.toLowerCase()}.png`);
    
    // 跳过已存在的文件
    if (fs.existsSync(targetPath)) {
      console.log(`⏭️  跳过已存在 (${i + 1}/${uniqueSymbols.length}): ${symbol.toLowerCase()}.png`);
      skippedCount++;
      continue;
    }
    
    try {
      console.log(`📥 下载中 (${i + 1}/${uniqueSymbols.length}): ${symbol}`);
      await downloadIcon(symbol, targetPath);
      successCount++;
    } catch (error) {
      console.log(`❌ ${symbol} 完全失败: ${error.message}`);
      failedCount++;
    }
    
    // 每10个币种后稍作休息，避免请求过于频繁
    if ((i + 1) % 10 === 0) {
      console.log(`\n⏸️  已处理 ${i + 1} 个币种，休息 2 秒...\n`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
  
  console.log('\n🎉 批量下载完成！');
  console.log(`📊 统计结果:`);
  console.log(`  • 总计币种: ${uniqueSymbols.length} 个`);
  console.log(`  • 下载成功: ${successCount} 个`);
  console.log(`  • 下载失败: ${failedCount} 个`);
  console.log(`  • 跳过已存在: ${skippedCount} 个`);
  console.log(`  • 成功率: ${((successCount / (uniqueSymbols.length - skippedCount)) * 100).toFixed(1)}%`);
  
  if (failedCount > 0) {
    console.log(`\n⚠️  失败的币种可以稍后重试下载`);
  }
}

downloadSimpleIcons();
