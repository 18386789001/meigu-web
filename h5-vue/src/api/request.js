import axios from 'axios';
import { ElMessage } from 'element-plus';
import config from '@/config';

// 创建axios实例
const request = axios.create({
  baseURL: config.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加语言参数
    const language = localStorage.getItem('lang') || 'zh-CN';
    config.params = {
      ...config.params,
      language
    };
    
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    const { data } = response;
    
    // 统一处理响应数据
    if (data.code === 200) {
      return data;
    } else {
      ElMessage.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }
  },
  error => {
    console.error('响应错误:', error);
    
    let message = '网络错误';
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          message = '未授权，请重新登录';
          // 清除token并跳转到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          break;
        case 403:
          // 检查是否是认证过期错误
          if (data?.msg && (data.msg.includes('账号已过期') || data.msg.includes('已经在其他地方登录'))) {
            message = '您的账号已过期或已在其他设备登录，请重新登录';
          } else {
            message = data?.msg || '拒绝访问';
          }
          // 清除认证信息
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          // 延迟跳转到登录页
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = data?.message || `请求失败 (${status})`;
      }
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时';
    } else if (error.message.includes('Network Error')) {
      message = '网络连接失败';
    }
    
    ElMessage.error(message);
    return Promise.reject(error);
  }
);

export default request;
