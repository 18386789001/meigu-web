import koLocale from "element-plus/lib/locale/lang/ko";
import login from "../resource/Korean/login";
import home from "../resource/Korean/home";
import user from "../resource/Korean/user";
import hangqing from "../resource/Korean/hangqing";
import jiaoyi from "../resource/Korean/jiaoyi";
import c2c from "../resource/Korean/c2c";
import compositeHome from "../resource/Korean/compositeHome"; //综合盘的
import newHome from "../resource/Korean/newHome";
const ko = {
  ...login,
  ...compositeHome,
  message: {
    home: home,
    user: user,
    hangqing: hangqing,
    jiaoyi: jiaoyi,
    c2c: c2c,
  },
  newHome,
  common: {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    viewAll: 'View All'
  },
  ...koLocale,
};

export default ko;
