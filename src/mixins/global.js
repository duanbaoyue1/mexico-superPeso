export default {
  data() {
    return {
      isWechat: /MicroMessenger/i.test(navigator.userAgent),
      canvasCompressWidth: 0,
      canvasCompressHeight: 0,
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
        return `<span style="color: #e60100">+${value}%</span>`;
      } else if (value < 0) {
        return `<span style="color: #0cad00">${value}%</span>`;
      } else {
        return `<span>${value}</span>`;
      }
    },
  },

  methods: {
    toBuy() {
      window.uniWebViewF(function () {
        var uniWebView = webUni.webView; //必须在这时候保存下来
        uniWebView.postMessage({
          data: {
            action: 'tobuy',
          },
        });
      });
      // if (this.$route.query.wy == 1) {
      //   window.uniWebViewF(function(){
      //     var uniWebView = webUni.webView;//必须在这时候保存下来
      //     uniWebView.postMessage({
      //       data: {
      //         action: 'tobuy'
      //       }
      //     });
      //   })
      // } else {

      // }
    },

    playVideo(videoSrc) {
      try {
        const fullPageVideoInstance = this.$fullPageVideo.play(videoSrc);
        fullPageVideoInstance.$on('close', () => {
          this.$fullPageVideo.hide();
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
        return item.indexOf('=')>-1;
      })
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
