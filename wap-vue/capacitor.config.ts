import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.forex.app', // 修改为您的应用ID
  appName: 'Forex Trading', // 修改为您的应用名称
  webDir: '../../jar/syn', // 对应 vite.config.js 的 outDir
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
