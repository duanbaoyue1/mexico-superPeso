import { mapState, mapMutations } from 'vuex';
import Vue from 'vue';

export default {
  data() {
    return {
      isWechat: /MicroMessenger/i.test(navigator.userAgent),
      canvasCompressWidth: 0,
      canvasCompressHeight: 0,
      showShareCanvas: false
    };
  },

  filters: {
    communityPurposeFilter(items) {
      const TARGETS = ['', '交友', '脱单', '拓展人脉'];
      let target = items.map(t => TARGETS[t]).join(' / ');
      return target;
    },
    discussCategoryFilter(item) {
      const CATEGORY_MAP = {
        1: '工作',
        2: '生活',
        3: '学习'
      };
      return CATEGORY_MAP[item];
    },
    ageFilter(age) {
      age = parseInt(age);
      if (age === 45) {
        age = '45+';
      }
      return age;
    },
    educationFilter(item) {
      const EDUCATION = { 0: '没有', 1: '高中', 2: '本科', 3: '学士前', 4: '硕士', 8: '博士', 9: '博士后', 16: '其他' };
      return EDUCATION[item];
    },
    nullFilter(item) {
      return item || '';
    },
    barCodeProductNameFilter(item) {
      return item.name || '';
    },

    percentFilter(value, fixedNum = 2) {
      if(value > 0) {
        return `<span style="color: #e60100">+${(value * 100).toFixed(fixedNum)}%</span>`
      } else if(value < 0) {
        return `<span style="color: #0cad00">-${(value * 100).toFixed(fixedNum)}%</span>`
      } else {
        return `<span>${value}</span>`
      }
    }
  },

  methods: {
    toBuy() {
      location.href = `cailianshe://payment?productId=${this.$route.query.proId}`;
    },

    playVideo(videoSrc) {
      const fullPageVideoInstance = this.$fullPageVideo.play(videoSrc);
      fullPageVideoInstance.$on('close', () => {
        this.$fullPageVideo.hide();
      });
    },

    goHome() {
      this.$router.push({ name: 'Home' });
    },

    parseQuery(query) {
      const arr = query.split('&');
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

    showToast(text, duration) {
      duration = duration || 2000;
    }
  }
};
