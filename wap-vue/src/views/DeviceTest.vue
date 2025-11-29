<!-- 设备检测测试页面 -->
<template>
  <div class="device-test-page">
    <div class="test-container">
      <h2>设备检测测试</h2>
      
      <div class="device-info">
        <h3>当前设备信息</h3>
        <div class="info-item">
          <label>用户代理:</label>
          <span>{{ userAgent }}</span>
        </div>
        <div class="info-item">
          <label>屏幕尺寸:</label>
          <span>{{ screenSize }}</span>
        </div>
        <div class="info-item">
          <label>触摸支持:</label>
          <span>{{ touchSupport }}</span>
        </div>
        <div class="info-item">
          <label>设备类型:</label>
          <span :class="deviceTypeClass">{{ deviceType }}</span>
        </div>
        <div class="info-item">
          <label>是否跳转PC端:</label>
          <span :class="redirectClass">{{ shouldRedirect }}</span>
        </div>
      </div>
      
      <div class="test-buttons">
        <button @click="testRedirect" class="btn btn-primary">
          测试跳转到PC端
        </button>
        <button @click="refreshInfo" class="btn btn-secondary">
          刷新信息
        </button>
      </div>
      
      <div class="url-params">
        <h3>URL参数测试</h3>
        <p>添加以下参数可以控制跳转行为：</p>
        <ul>
          <li><code>?mobile=true</code> - 强制使用移动端</li>
          <li><code>?wap=true</code> - 强制使用移动端</li>
          <li><code>?skip_pc_redirect=true</code> - 跳过PC端跳转</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { isPCDevice, shouldRedirectToPC } from '@/utils/deviceDetection.js';

export default {
  name: 'DeviceTestPage',
  data() {
    return {
      userAgent: '',
      screenSize: '',
      touchSupport: '',
      deviceType: '',
      shouldRedirect: ''
    };
  },
  computed: {
    deviceTypeClass() {
      return {
        'pc': this.deviceType === 'PC端',
        'mobile': this.deviceType === '移动端'
      };
    },
    redirectClass() {
      return {
        'yes': this.shouldRedirect === '是',
        'no': this.shouldRedirect === '否'
      };
    }
  },
  mounted() {
    this.refreshInfo();
  },
  methods: {
    refreshInfo() {
      this.userAgent = navigator.userAgent.substring(0, 100) + '...';
      this.screenSize = `${window.screen.width} × ${window.screen.height}`;
      this.touchSupport = ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? '是' : '否';
      this.deviceType = isPCDevice() ? 'PC端' : '移动端';
      this.shouldRedirect = shouldRedirectToPC() ? '是' : '否';
    },
    testRedirect() {
      if (shouldRedirectToPC()) {
        window.location.href = 'https://jpmx.xyz/#/home';
      } else {
        alert('当前设备不需要跳转到PC端');
      }
    }
  }
};
</script>

<style scoped lang="scss">
.device-test-page {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.test-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

h3 {
  color: #555;
  margin: 20px 0 15px 0;
  border-bottom: 2px solid #007bff;
  padding-bottom: 8px;
}

.device-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
  
  label {
    font-weight: 600;
    color: #666;
    min-width: 120px;
    margin-right: 15px;
  }
  
  span {
    color: #333;
    flex: 1;
    word-break: break-all;
    
    &.pc {
      color: #28a745;
      font-weight: 600;
    }
    
    &.mobile {
      color: #007bff;
      font-weight: 600;
    }
    
    &.yes {
      color: #dc3545;
      font-weight: 600;
    }
    
    &.no {
      color: #28a745;
      font-weight: 600;
    }
  }
}

.test-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.btn-primary {
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  }
  
  &.btn-secondary {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  }
}

.url-params {
  background: #e9ecef;
  border-radius: 8px;
  padding: 20px;
  
  p {
    margin: 0 0 15px 0;
    color: #666;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      color: #555;
      
      code {
        background: #f8f9fa;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        color: #e83e8c;
      }
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .test-container {
    margin: 10px;
    padding: 20px;
  }
  
  .info-item {
    flex-direction: column;
    
    label {
      min-width: auto;
      margin-bottom: 5px;
    }
  }
  
  .test-buttons {
    flex-direction: column;
  }
}
</style>
