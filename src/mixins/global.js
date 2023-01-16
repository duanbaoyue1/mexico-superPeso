import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import { dateFormat } from '@/utils/mUtils';

export default {
  data() {
    return {};
  },

  computed: {
    ...mapState(['appGlobal', 'userInfo']),
  },

  filters: {
    nullFilter(item) {
      return item || '';
    },

    dateFormate(date, format = 'yyyy/MM/dd') {
      return dateFormat(date, format);
    },
  },

  methods: {
    ...mapActions(['showMessageBox', 'hideMessageBox']),
    async getUserInfo() {
      let data1 = await this.$http.post(`/clyb/iuurv`);
      let data2 = await this.$http.post(`/clyb/iuurf`);
      let userInfo = { ...data1.data, ...data2.data };
      console.log('set user info', userInfo);
      this.$store.commit('setUserInfo', userInfo);
    },

    validateEmail(email) {
      // 邮箱验证正则
      var reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      return reg.test(email);
    },

    mergeTwoArray(arr1, arr2) {
      let arr = [];
      arr1.forEach((item, index) => {
        arr.push({ ...item, ...arr2[index] });
      });
      return arr;
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
      let data1 = await this.$http.post(`/xiaqpdt/bmzxwlxmjhahv`);
      let data2 = await this.$http.post(`/xiaqpdt/bmzxwlxmjhahf`);
      let appMode = { ...data1.data, ...data2.data };
      return appMode;
    },

    async getOrderRelateUrl(orderId) {
      try {
        let data = await this.$http.post(`/zihai/mvecvmjtyyfojfp`, { orderId: orderId });
        return data.data;
      } catch (error) {
        console.error(error);
        return {};
      }
    },

    toAppMethod(name, params) {
      params = params || {};
      try {
        console.log('start method:', `${name}_${this.appGlobal.appName}`);
        wjs[`${name}_${this.appGlobal.appName}`](JSON.stringify(params));
      } catch (error) {
        console.error(error);
        console.log('no such method:', `${name}_${this.appGlobal.appName}`);
      }
    },

    bindAppCallbackMethod(name, callback) {
      try {
        window[`${name}_${this.appGlobal.appName}`] = function (recieveData) {
          recieveData = recieveData || '';
          console.log('receive app method', name);
          console.log(recieveData);
          callback && callback.apply(this, [JSON.parse(recieveData)]);
        };
      } catch (error) {
        console.log('no such callback method', `${name}_${this.appGlobal.appName}`);
      }
    },

    goPrivacy() {
      // TODO
    },
    goTerms() {
      // TODO
    },
    goHelpCenter() {
      this.$router.push({ name: 'help-center' });
    },
    todayHour() {
      var d = new Date();
      var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      var hourTime = hour + ':' + minute + ':' + second;
      return hourTime;
    },
    getCookie(name) {
      var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
      arr = document.cookie.match(reg);
      if (arr != null) return unescape(arr[2]);
      else return null;
    },
    delCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(name);
      if (cval != null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    },

    // 获取两个两个日期转换成天
    daysDistance(date1, date2) {
      //parse() 是 Date 的一个静态方法 , 所以应该使用 Date.parse() 来调用，而不是作为 Date 的实例方法。返回该日期距离 1970/1/1 午夜时间的毫秒数
      date1 = Date.parse(date1);
      date2 = Date.parse(date2);
      //计算两个日期之间相差的毫秒数的绝对值
      var ms = Math.abs(date2 - date1);
      //毫秒数除以一天的毫秒数,就得到了天数
      var days = Math.floor(ms / (24 * 3600 * 1000));
      return days;
    },

    goHome() {
      // App方法
      this.toAppMethod('goHome');
    },

    goAppBack() {
      this.toAppMethod('goBack');
    },

    parseQuery(query) {
      const arr1 = query.split('&');
      const arr = arr1.filter((item) => {
        return item.indexOf('=') > -1;
      });
      const allOptions = {};
      for (const i in arr) {
        const val = arr[i];
        const arr2 = val.split('=');
        allOptions[arr2[0]] = arr2[1];
      }
      return allOptions;
    },

    // 版本号比较
    versionCompare(x1, x2) {
      if (!x1 || !x2) return 0;
      const x1Arr = x1.split('.');
      const x2Arr = x2.split('.');
      let re = 0;
      for (const i in x1Arr) {
        const intX1 = parseInt(x1Arr[i]);
        const intX2 = parseInt(x2Arr[i]);

        if (intX1 > intX2) {
          re = 1;
          break;
        } else if (intX1 === intX2) {
          re = 0;
        } else if (intX1 < intX2) {
          re = -1;
          break;
        }
      }
      if (re === 0 && x2Arr.length > x1Arr.length) {
        return -1;
      }
      return re;
    },
  },
};
