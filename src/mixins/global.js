import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import { dateFormat } from '@/utils/mUtils';
import { ImagePreview } from 'vant';

export default {
  data() {
    return {};
  },

  computed: {
    ...mapState(['appGlobal', 'userInfo', 'tabBar', 'appMode', 'eventTrackerActionCnt', 'eventTrackStartTime']),
  },

  filters: {
    nullFilter(item) {
      return item || '';
    },

    phoneHideFilter(item) {
      if (!item) return '';
      return `${item.slice(0, 3)}****${item.slice(-3)}`;
    },

    dateFormate(date, format = 'yyyy/MM/dd') {
      return dateFormat(date, format);
    },

    formatMonex(num) {
      var result = [],
        counter = 0;
      num = (num || 0).toString().split('');
      for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) {
          result.unshift(',');
        }
      }
      return result.join('');
    },
  },

  beforeRouteLeave(to, from, next) {
    this.hideLoading();
    this.toAppMethod('physicalReturnKeyInterception', { isInterception: false });
    next();
  },

  methods: {
    ...mapActions(['showMessageBox', 'hideMessageBox', 'setTabBar', 'setAppMode', 'setRepaymentNum', 'updateToken', 'setEventTrackerActionCnt', 'setEventTrackStartTime']),
    async getUserInfo() {
      let data = await this.$http.post(`/api/user/info`);
      let userInfo = data.data;
      console.log('set user info', userInfo);
      this.$store.commit('setUserInfo', userInfo);
      return userInfo;
    },

    checkInApp() {
      return typeof wjs != 'undefined';
    },

    initInfoBackControl() {
      window.infoBtnCallBack = () => {
        this.showMessageBox({
          content: '¡Espere, todavía queda un paso para obtener el dinero!',
          confirmBtnText: 'OK',
          cancelBtnText: 'Renunciar',
          confirmCallback: () => {
            this.hideMessageBox();
          },
          cancelCallback: () => {
            this.hideMessageBox();
            this.goAppBack();
          },
          iconPath: 'superpeso/添加新收款方式-退出弹窗',
        });
      };
      this.setTabBar({
        backCallback: window.infoBtnCallBack,
      });
      this.toAppMethod('physicalReturnKeyInterception', { isInterception: true, fuName: 'infoBtnCallBack' });
    },

    previewImg(imgs, startIndex) {
      if (!imgs || !imgs.length || startIndex < 0) return;
      ImagePreview({
        images: imgs,
        startPosition: startIndex,
      });
    },

    validateEmail(email) {
      // 邮箱验证正则
      var reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      return reg.test(email);
    },

    getLocalSystemTimeStamp() {
      return new Date().getTime();
    },

    logout() {
      this.toAppMethod('outToLogin');
    },

    // 解压
    unzip(b64Data) {
      // const strData = atob(b64Data);
      const charData = b64Data.split('').map(function (x) {
        return x.charCodeAt(0);
      });
      const binData = new Uint8Array(charData);
      const data = pako.inflate(binData);
      const array = new Uint16Array(data);
      // 防止一次解压造成内存溢出，这里进行分段解压
      let result = '';
      let i = 0;
      const maxRange = 8 * 1024;
      for (i = 0; i < array.length / maxRange; i++) {
        result += String.fromCharCode.apply(null, array.slice(i * maxRange, (i + 1) * maxRange));
      }
      result += String.fromCharCode.apply(null, array.slice(i * maxRange));
      return decodeURIComponent(result);
    },

    // 压缩
    zip(str) {
      return pako.gzip(str, { to: 'string' });
    },

    /**
     *
     * @param {*} path
     * @param {*} query
     * @param {*} replace 是否替换当前路由
     */
    innerJump(path, query, replace = false) {
      query = query || {};
      query.appChecked = true;
      if (replace) {
        this.$router.replace({ name: path, query: query });
      } else {
        this.$router.push({ name: path, query: query });
      }
    },

    async getAppMode() {
      try {
        let data = await this.$http.post(`/api/product/appMaskModelNew`);
        let appMode = data.data;
        this.setAppMode(appMode);
        return appMode;
      } catch (error) {
        return {};
      }
    },

    openWebview(url, type = 0, title = '') {
      this.toAppMethod('inNewPage', { path: url, type: type, title: title });
    },

    async getOrderRelateUrl(orderId) {
      try {
        let data = await this.$http.post(`/api/order/getRepaymentUrl`, { orderId: orderId });
        return data.data;
      } catch (error) {
        console.error(error);
        return {};
      }
    },
    toAppMethod(name, params) {
      params = params || {};
      if (!this.checkInApp()) return;
      try {
        console.log('start method:', `${name}`);
        console.log('params:', JSON.stringify(params));
        wjs[`${name}`](JSON.stringify(params));
        return true;
      } catch (error) {
        console.log('no such method:', `${name}`);
        return false;
      }
    },
    goPrivacy() {
      this.innerJump('privacy');
    },
    goTerms() {
      this.innerJump('terms');
    },
    goHelpCenter() {
      this.innerJump('help-center');
    },
    // app埋点
    eventTracker(key) {
      this.toAppMethod('logDeed', { key: key });
    },
    sumArr(arr) {
      return arr.reduce(function (prev, cur) {
        return parseInt(prev) + parseInt(cur);
      }, 0);
    },
    goHome() {
      this.innerJump('home', {}, true);
    },
    goAppBack() {
      let prevPage = window.location.href;
      window.history.go(-1);
      // 如果500ms没有跳转成功则去首页
      setTimeout(function () {
        if (window.location.href == prevPage) {
          console.log('on goAppBack not go prev');
          this.goHome();
        }
      }, 500);
    },
  },
};
