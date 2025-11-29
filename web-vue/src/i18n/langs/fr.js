import frLocale from "element-plus/lib/locale/lang/fr";
import login from "../resource/French/login";
import home from "../resource/French/home";
import user from "../resource/French/user";
import hangqing from "../resource/French/hangqing";
import jiaoyi from "../resource/French/jiaoyi";
import c2c from "../resource/French/c2c";
import compositeHome from "../resource/French/compositeHome"; //综合盘的
import newHome from "../resource/French/newHome";
const fr = {
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
  ...frLocale,
};

export default fr;
