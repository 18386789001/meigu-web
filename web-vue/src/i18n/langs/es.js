// 西班牙语
import esLocale from "element-plus/lib/locale/lang/es";
import login from "../resource/Spain/login";
import home from "../resource/Spain/home";
import user from "../resource/Spain/user";
import hangqing from "../resource/Spain/hangqing";
import jiaoyi from "../resource/Spain/jiaoyi";
import c2c from "../resource/Spain/c2c";
import compositeHome from "../resource/Spain/compositeHome";
import newHome from "../resource/Spain/newHome";
const es = {
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
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    viewAll: 'View All'
  },
  ...esLocale,
};

export default es;
