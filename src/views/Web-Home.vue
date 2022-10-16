<template>
  <div class="back">
    <heard />
    <top-head :bought="bought" :typeInfo="typeInfo" @to-buy="toBuyP"></top-head>
    <div class="content-area">
      <div class="login-area">
        <div>
          <div class="date-choose">
            <div class="date">
              <span class="label">选择日期：</span>
              <el-date-picker v-model="dataDate" value-format="yyyy-MM-dd" type="date" align="center" popper-class="define-date" :editable="false" :clearable="false" @change="changeDateNot" :picker-options="pickerOptionsNot" placeholder="选择日期"> </el-date-picker>
            </div>
            <div class="btn" @click="preDay">前一天</div>
            <div class="btn" @click="lastDay">后一天</div>
            <div class="btn history" @click="showHisData">查看历史数据统计></div>
          </div>
          <table-data :data="tableData" :isFirst="dataDate == tradeDates[0]"></table-data>
          <best-info :bestInfo="bestInfo" v-if="bestInfo" class="best-info" style="margin: 10px auto 30px"></best-info>
          <video-module @play="playVideo" :videos="videos" class="video-module"></video-module>
        </div>
      </div>

      <module-tips1 class="module-tip" v-if="type == 'minuteLargeDdePulseQulet'"></module-tips1>
      <module-tips2 class="module-tip" v-else-if="type == 'minutePulseQulet'"></module-tips2>
      <module-tips3 class="module-tip" v-else-if="type == 'minuteUpShadow'"></module-tips3>
      <module-tips4 class="module-tip" v-else-if="type == 'minuteDivingGold'"></module-tips4>
      <pc-video-modal :initVideoIndex="initVideoIndex" :videos="videos" @close-play="closePlayVideo"></pc-video-modal>
    </div>
    <login ref="login" v-if="loginShow" />
    <payment-List ref="paymentList" :type="proId" />
  </div>
</template>

<script>
import paymentList from '@/components/paymentList.vue'; //支付
import ModuleTips1 from '@/components/module-tips1.vue';
import ModuleTips2 from '@/components/module-tips2.vue';
import ModuleTips3 from '@/components/module-tips3.vue';
import ModuleTips4 from '@/components/module-tips4.vue';
import TableData from '@/components/table-data.vue';
import typeConfig from '@/config/typeConfig.js';
import VideoModule from '@/components/video-module.vue';
import BestInfo from '@/components/best-info.vue';
import PcVideoModal from '@/components/pc-video-modal.vue';
import login from '@/components/login.vue';
import heard from '@/components/heard.vue';
import TopHead from '@/components/top-head.vue';

export default {
  components: {
    ModuleTips1,
    ModuleTips2,
    ModuleTips3,
    ModuleTips4,
    TableData,
    VideoModule,
    BestInfo,
    PcVideoModal,
    login,
    paymentList,
    heard,
    TopHead,
  },
  data() {
    let self = this;
    return {
      timeInterval: '',
      initVideoIndex: -1,
      // 视频列表
      videos: [],
      // 类型配置数据
      typeInfo: typeConfig[this.$route.query.type],
      // 当前选择日期
      dataDate: '',
      endDate: '', // 会员剩余日期
      // 产品id , 以便于购买跳转
      proId: this.$route.query.proId,
      token: '',
      // 产品类型
      type: this.$route.query.type,
      // 是否购买
      bought: false, // 是否登陆
      // 列表数据
      tableData: [],
      // 股票最佳信息
      bestInfo: '',
      // 交易日历
      tradeDates: [],
      loginShow: false, // 登录显示
      logins: false,
      pickerOptionsNot: {
        disabledDate(date) {
          return self.dealPickerOptionsNot(date);
        },
      },
    };
  },
  watch: {
    dataDate(newDate, oldDate) {
      if (this.bought && newDate == this.tradeDates[0]) {
        if (!this.timeInterval) {
          this.timeInterval = setInterval(() => {
            this.getTableData();
          }, 15000);
        }
      } else {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
      }
    },
  },

  mounted() {
    document.title = this.typeInfo.title;
    window.token = (this.$cookieFun.getCookie('login_token') || '').replace(/"/g, '');
    this.getVideoLists();
    this.getBestInfo();
    this.getUserBoughtInfo((data) => {
      this.bought = data.bought;
      this.logins = data.logins;
      this.endDate = data.endDate;
      this.getTradeDates();
    });
  },

  methods: {
    showHisData() {
      window.scroll(0, 0);
      let routeInfo = this.$router.resolve({ name: 'Web-More-Datas', query: { type: this.type, proId: this.proId, wy: this.$route.query.wy } });
      location.href = routeInfo.href;
    },

    playVideo(index) {
      this.initVideoIndex = index;
    },

    closePlayVideo() {
      this.initVideoIndex = -1;
    },

    toBuyP() {
      // 未登录
      if (this.logins == false) {
        this.loginShow = true;
      } else {
        setTimeout(() => {
          this.$refs.paymentList.showPayInfoDialog();
        });
      }
    },

    // 日期选择 非交易日不可选
    dealPickerOptionsNot(date) {
      let year = date.getFullYear();
      let mounth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var str = year + '-' + mounth + '-' + day;
      var todayDateTime = this.todayHour();
      if (todayDateTime > '12:00:00') {
        return this.tradeDates.indexOf(str) === -1;
      } else {
        return this.tradeDates.indexOf(str) === -1 || str === this.todayDate();
      }
    },
    // 当前时间的日期String 2021-07-15
    todayDate() {
      var date = new Date();
      var year = date.getFullYear();
      var mouth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      var curTime = year + '-' + mouth + '-' + day;
      return curTime;
    },
    // 当前日期的时分秒
    todayHour() {
      var d = new Date();
      var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      var hourTime = hour + ':' + minute + ':' + second;
      return hourTime;
    },
    getTableData() {
      let oldTableData = [...this.tableData];
      this.$http
        .get(`/core/api/best_times/?date=${this.dataDate}`)
        .then((res) => {
          if (res.data) {
            this.tableData = res.data.items || [];
          } else {
            this.tableData = [];
          }
          if (this.bought && oldTableData.length > 0 && this.tableData.length > 0 && this.dataDate == this.tradeDates[0]) {
            // 判断哪些本次新增的并提醒
            this.judgeNewTableAndVoice(this.tableData, oldTableData, this.typeInfo.voicePrefix);
          }
        })
        .catch((res) => {
          this.tableData = [];
        });
    },
    
    getVideoLists() {
      this.$http.get(`/core/api/videos/?page_size=1000`).then((res) => {
        this.videos = res.data.items;
      });
    },
    getBestInfo() {
      this.$http.get(`/core/api/best_times/best_info/`).then((res) => {
        this.bestInfo = res.data;
      });
    },
    getTradeDates() {
      this.$http.get(`/core/api/best_times/trade_days/`).then((res) => {
        this.tradeDates = res.data.items;
        if (this.bought) {
          this.dataDate = this.tradeDates[0];
        } else {
          this.dataDate = this.tradeDates[6];
        }
        this.getTableData();
      });
    },
    preDay() {
      let idx = this.tradeDates.indexOf(this.dataDate);
      if (idx == this.tradeDates.length - 1) {
        this.$dm.alert('日期无效，请重新选择!', '温馨提示', {
          dangerouslyUseHTMLString: true,
          showClose: false,
          confirmButtonText: '我知道了',
          confirmButtonClass: 'alert-confirm',
          customClass: 'tips-toast-web',
          center: true,
        });
        return;
      }
      this.dataDate = this.tradeDates[idx + 1];
      this.getTableData();
    },
    lastDay() {
      let idx = this.tradeDates.indexOf(this.dataDate);
      if (idx == 0) {
        this.$dm.alert('日期无效，请重新选择!', '温馨提示', {
          dangerouslyUseHTMLString: true,
          showClose: false,
          confirmButtonText: '我知道了',
          confirmButtonClass: 'alert-confirm',
          customClass: 'tips-toast-web',
          center: true,
        });
        return;
      }
      this.dataDate = this.tradeDates[idx - 1];
      this.getTableData();
    },
    changeDateNot(date) {
      this.dataDate = date;
      this.getTableData();
    },
  },
};
</script>

<style lang="scss">
.back {
  background: #0f0f12;
}

.content-area {
  background: #15171e;
  width: 1200px;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: -35px;
  padding: 30px;
  .more-data {
    padding: 8px 0;
    margin: 0 auto;
    border: 1px solid #666;
    border-top: none;
    text-align: center;
    font-size: 14px;
    color: #eb333b;
    line-height: 19px;
    cursor: pointer;
  }
}

.video-module {
  margin-bottom: 10px;
}

.img-name {
  height: 52px;
  display: block;
}

.date-choose {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 400;
  color: #666666;
  line-height: 16px;
  margin-bottom: 15px;
  position: relative;

  .date {
    display: flex;
    align-items: center;
    .el-date-editor {
      height: 36px;
      width: 160px;
      background: #fff8f6;
      border-radius: 18px;
      padding: 0 5px;
      color: #cf0f0a;
      display: flex;
      align-items: center;
      cursor: pointer;
      .el-input__inner {
        text-align: center;
        background: #fff8f6;
        cursor: pointer;
        border: none;
        font-size: 15px;
        font-weight: 400;
        color: #cf0f0a;
        line-height: 18px;
        height: 24px;
        padding-left: 22px !important;
        padding-right: 0px !important;
      }
      .el-icon-date {
        color: #cf0f0a;
        display: flex;
        align-items: center;
        margin-left: 30px;
        width: 18px;
      }
    }

    .label {
      color: #fff;
      margin-right: 5px;
      font-size: 14px;
    }

    img {
      width: 14px;
      display: block;
      margin-right: 4px;
    }
  }
  .btn {
    width: 90px;
    height: 36px;
    background: #f5f5f5;
    border-radius: 18px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    cursor: pointer;
    &:hover {
      color: #cf0f0a;
    }
    &.history {
      width: 153px;
      position: absolute;
      right: 0;
      border: 1px solid #cea58d;
      color: #cea58d;
      background: transparent;
      &:hover {
        background: #cea58d;
        color: #fff;
      }
    }
  }
}

.module-tip {
  margin-top: 30px;
}
</style>
