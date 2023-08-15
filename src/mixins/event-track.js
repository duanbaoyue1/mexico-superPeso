import axios from 'axios';

const PAGE_MAP = {
  home: {
    page: 2,
    modular: 1,
  },
  'loan-success-multi': {
    page: 2,
    modular: 1,
  },
  identity: {
    page: 3,
    modular: 1,
  },
  information: {
    page: 3,
    modular: 1,
  },
  contacts: {
    page: 3,
    modular: 1,
  },
  'complete-bank': {
    page: 3,
    modular: 1,
  },
  'loan-confirm': {
    page: 4,
    modular: 1,
  },
  'order-list': {
    page: 5,
    modular: 2,
  },
  repayment: {
    page: 5,
    modular: 2,
  },
  'order-detail': {
    page: 6,
    modular: 2,
  },
  'defer-detail': {
    page: 6,
    modular: 2,
  },
  mine: {
    page: 8,
    modular: 3,
  },
};

const DATA_API_HOST = process.env.VUE_APP_UPLOAD_DATA_APIPREFIX;

export default {
  data() {
    return {
      pageStartTime: 0,
      pageEndTime: 0,
      duration: 0,
      touchMoved: false,
      dataSended: false,
      actionCnt: 0,
      leaveBy: 2,
      productId: '',
    };
  },
  activated() {
    window.actionCnt = 0;
    this.dataSended = false;
  },
  mounted() {
    window.actionCnt = 0;
    this.dataSended = false;
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log('page start time:', new Date().getTime());
      vm.pageStartTime = new Date().getTime();
    });
  },
  beforeRouteLeave(to, from, next) {
    console.log('page leave time:', new Date().getTime());
    if (!this.dataSended) {
      if ((from.name == 'identity' && to.name == 'information') || (from.name == 'information' && to.name == 'contacts') || (from.name == 'contacts' && to.name == 'complete-bank')) {
        // 这些条件不发送
      } else {
        this.sendEventTrackData({});
      }
    }
    next();
  },
  methods: {
    updateTrackerData({ key, value }) {
      this[key] = value;
    },

    sendEventTrackData({ leaveBy }) {
      // 页面类型
      let pageModule = PAGE_MAP[this.$route.name];
      if (!pageModule) {
        console.error('page not found!!!');
      }
      this.pageEndTime = new Date().getTime();
      this.duration = (this.pageEndTime - this.pageStartTime) / 1000;
      // 调用app方法
      let sendData = {
        userId: this.appGlobal.userId,
        appName: this.appGlobal.appName,
        appVersion: this.appGlobal.appVersion + "",
        modular: pageModule.modular,
        page: pageModule.page,
        startTime: this.pageStartTime,
        endTime: this.pageEndTime,
        duration: parseInt((this.pageEndTime - this.pageStartTime) / 1000),
        packageId: this.appGlobal.packageId, // TODO
        leaveBy: this.leaveBy, //
        productId: this.productId,
        actionCnt: window.actionCnt,
      };
      if (typeof leaveBy != 'undefined') {
        sendData.leaveBy = leaveBy;
      }
      this.dataSended = true;
      try {
        // console.log('send data:', sendData);
        // axios.post(`${DATA_API_HOST}/operate/india`, sendData);
      } catch (error) {
        console.error('event data send error!', error);
      }
    },
    addActionCnt() {
      window.actionCnt++;
    },
    touchstart() {
      this.touchMoved = false;
    },
    touchmove() {
      this.touchMoved = true;
    },
    touchend(e) {
      // if (this.touchMoved) {
      this.addActionCnt();
      // }
    },
  },
};
