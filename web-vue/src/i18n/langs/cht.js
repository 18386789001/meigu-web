import twLocale from "element-plus/lib/locale/lang/zh-tw";
import login from "../resource/China_tw/login";
import home from "../resource/China_tw/home";
import user from "../resource/China_tw/user";
import hangqing from "../resource/China_tw/hangqing";
import jiaoyi from "../resource/China_tw/jiaoyi";
import c2c from "../resource/China_tw/c2c";
import compositeHome from "../resource/China_tw/compositeHome"; //综合盘的
import newHome from "../resource/China_tw/newHome";
const tw = {
  ...compositeHome,
  ...login,
  message: {
    home,
    user,
    hangqing,
    jiaoyi,
    c2c,
  },
  newHome,
  common: {
    login: '登錄',
    register: '註冊',
    logout: '退出登錄',
    viewAll: '查看全部'
  },
  ...twLocale,
};

export default tw;
