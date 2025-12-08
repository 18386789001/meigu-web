<template>
  <div class="wallet-connect-dialog" v-if="visible" @click.self="handleClose">
    <div class="dialog-content">
      <!-- 标题栏 -->
      <div class="dialog-header">
        <h2 class="dialog-title">Connect Wallet</h2>
        <div class="close-btn" @click="handleClose">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- 钱包选项列表 -->
      <div class="wallet-list">
        <div class="wallet-item" @click="connectWallet('binance')">
          <div class="wallet-icon">
            <img src="/image/Binance_Wallet.svg" alt="Binance Wallet" />
          </div>
          <div class="wallet-name">Binance Wallet</div>
        </div>

        <div class="wallet-item" @click="connectWallet('bitget')">
          <div class="wallet-icon">
            <img src="/image/Bitget_Wallet.svg" alt="Bitget Wallet" />
          </div>
          <div class="wallet-name">Bitget Wallet</div>
        </div>

        <div class="wallet-item" @click="connectWallet('okx')">
          <div class="wallet-icon">
            <img src="/image/OKX_Wallet.svg" alt="OKX Wallet" />
          </div>
          <div class="wallet-name">OKX Wallet</div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="dialog-footer">
        <p class="footer-text">By connecting a wallet, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'connect']);

const handleClose = () => {
  emit('close');
};

const connectWallet = (walletType) => {
  // 触发钱包连接逻辑
  emit('connect', walletType);
  // 这里可以添加具体的钱包连接代码
  console.log('Connecting to wallet:', walletType);
};
</script>

<style scoped>
.wallet-connect-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.dialog-content {
  background: #1a1a1a;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #2a2a2a;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #2a2a2a;
  color: #ffffff;
}

.wallet-list {
  padding: 16px 0;
}

.wallet-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 0 16px;
}

.wallet-item:hover {
  background-color: #2a2a2a;
}

.wallet-icon {
  width: 32px;
  height: 32px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wallet-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.wallet-name {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
}

.dialog-footer {
  padding: 20px 24px;
  border-top: 1px solid #2a2a2a;
}

.footer-text {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin: 0;
  line-height: 1.4;
}

/* 白天模式样式适配 */
body.light .wallet-connect-dialog {
  background-color: rgba(0, 0, 0, 0.3);
}

body.light .dialog-content {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

body.light .dialog-header {
  border-bottom: 1px solid #e5e7eb;
}

body.light .dialog-title {
  color: #1a1a1a;
}

body.light .close-btn {
  color: #4b5563;
}

body.light .close-btn:hover {
  background-color: #f3f4f6;
  color: #1a1a1a;
}

body.light .wallet-item:hover {
  background-color: #f3f4f6;
}

body.light .wallet-name {
  color: #1a1a1a;
  font-weight: 600;
}

body.light .dialog-footer {
  border-top: 1px solid #e5e7eb;
}

body.light .footer-text {
  color: #4b5563;
}

/* 适配深色模式 */
@media (prefers-color-scheme: dark) {
  .wallet-connect-dialog {
    background-color: rgba(0, 0, 0, 0.7);
  }
}
</style>