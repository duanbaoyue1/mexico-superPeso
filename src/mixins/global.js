import axios from 'axios';
import ttsRecorder from '../utils/tts-recorder';

export default {
  data() {
    return {
      isWechat: /MicroMessenger/i.test(navigator.userAgent),
      canvasCompressWidth: 0,
      canvasCompressHeight: 0,
      isPlayingWapVideo: false,  // 当前是否在播放wap端视频
      showShareCanvas: false,
    };
  },

  filters: {
    nullFilter(item) {
      return item || '';
    },
    percentFilter(value, fixedNum = 2) {
      if (value == -999) {
        return '-';
      }
      if (value > 0) {
        return `<span style="color: #e60100">+${parseFloat(value).toFixed(fixedNum)}%</span>`;
      } else if (value < 0) {
        return `<span style="color: #0cad00">${parseFloat(value).toFixed(fixedNum)}%</span>`;
      } else {
        return `<span>${value}</span>`;
      }
    },
  },

  methods: {
    openBoxWin() {
      this.$dm.alert('<ul><li style="color: #EA413C">统计范围：选取策略所有股票</li><li>次日开始一周内有2%以上的止盈机会则为胜</li><li>统计近一个月的胜率</li></ul>', '近一月个股胜率', {
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '我知道了',
        confirmButtonClass: 'alert-confirm',
        customClass: 'tips-toast',
        center: false,
      });
    },
    openBoxWinYield() {
      this.$dm.alert('<ul><li style="color: #EA413C">统计范围：选取策略所有股票</li><li>统计选出后至今的最高价 </li><li>将所有收益平均到每一天</li></ul>', '近一月平均日收益', {
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '我知道了',
        confirmButtonClass: 'alert-confirm',
        customClass: 'tips-toast',
        center: false,
      });
    },
    // toBuy() {
    //   if (this.$route.query.wy == 1) {
    //     // index首页
    //     window.uniWebViewF(function () {
    //       console.log(webUni.webView);
    //       var uniWebView = webUni.webView; //必须在这时候保存下来
    //       uniWebView.postMessage({
    //         data: {
    //           action: 'tobuy',
    //         },
    //       });
    //     });
    //   } else {
    //     this.$emit('')
    //     this.agree1 = true
    //   }
    // },
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

    judgeNewTableAndVoice(table, oldTable, typeText) {
      oldTable = oldTable || [];
      let oldIds = oldTable.map((t) => t.code);
      var tipsArray = [];
      table.forEach((item) => {
        if (oldIds.indexOf(item.code) == -1) {
          tipsArray.push(item.name);
        }
      });
      if (tipsArray.length > 0) {
        tipsArray = [typeText, ...tipsArray];
        this.playVoice(tipsArray.join(','));
      }
    },

    playVoice(text) {
      ttsRecorder.playVoice(text);
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
    getUserBoughtInfo(cb) {
      let bought = false,
        endDate = 0,
        logins = false;
      axios({
        method: 'post',
        url: '/userreg/ucenter/queryUserProduct',
      })
        .then((re) => {
          let res = re.data;
          if (res.code && res.code == 200) {
            logins = true; // 已登录
            var data = res.data;
            if (data.length == 0) {
              // 无权限
              bought = false;
            } else {
              for (let i = 0; i < data.length; i++) {
                if (data[i].id == this.proId || data[i].id == 1 || data[i].id == 2 || data[i].id == 3) {
                  var newdate = new Date();
                  var date = new Date(data[i].date);
                  if (date <= newdate) {
                    // 无权限
                    bought = false;
                  } else {
                    // 有权限
                    bought = true;
                    // 会员剩余日期
                    endDate = this.daysDistance(new Date(data[i].date), new Date());
                  }
                }
              }
            }
          } else if (res.code == -1) {
            bought = false;
            logins = false; // 未登录
            this.delCookie('login_token');
          } else {
            bought = false;
          }
          cb && cb({ bought, logins, endDate });
        })
        .catch((res) => {
          cb && cb({ bought, logins, endDate });
        });
    },

    playVideo(videoSrc) {
      if (this.isPlayingWapVideo) {
        return;
      }
      this.isPlayingWapVideo = true;
      try {
        const fullPageVideoInstance = this.$fullPageVideo.play(videoSrc);
        fullPageVideoInstance.$on('close', () => {
          this.$fullPageVideo.hide();
          this.isPlayingWapVideo = false;
        });
      } catch (error) {
        console.log(error);
      }
    },

    goHome() {
      this.$router.push({ name: 'Home' });
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
