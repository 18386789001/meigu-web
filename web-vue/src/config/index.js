
let env_url = ''
if (import.meta.env.MODE === 'development') {
   // 开发环境使用相对路径，通过Vite代理转发到生产环境
   env_url = ""; 
} else {
  env_url = window.location.host;
}
let ENV_DEV = "http://" + env_url + "/"; // dev
let ENV_PROD = "https://" + env_url + "/"; // prod

let HOST_URL = "";
let BASE_URL = ""; // 默认本地接口地址
let WS_URL = "";

if (import.meta.env.MODE === 'development') {
  // 开发环境使用相对路径
  HOST_URL = "";
  BASE_URL = "/";
  WS_URL = `wss://jpmx.xyz/api/websocket`;
} else {
  // 生产环境使用HTTPS协议
  HOST_URL = "https://" + env_url;
  BASE_URL = ENV_PROD;
  WS_URL = `wss://${env_url}/api/websocket`;
}

export default {
  HOST_URL,
  BASE_URL,
  WS_URL,
};
