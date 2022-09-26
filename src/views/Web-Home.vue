<template>
  <div class="back">
    <div class="top-header">
      <div class="width-container">
        <div class="pro-info">
          <img class="img-name" :src="require('@/assets/img/' + typeInfo.titleWebImg)" />
          <div class="pro-tips">{{ typeInfo.tipsTop }}</div>
        </div>
        <div class="buy-info">
          <div id="price">1688元/月</div>
          <div class="buy-btn" @click="toBuyP">季付、半年、年付更优惠<img :src="require('@/assets/img/web/buy-btn@2x.png')" /></div>
        </div>
      </div>
    </div>

    <div class="content-area">
      <div class="login-area">
        <div v-if="!bought && !showData">
          <video-module @play="playVideo" :videos="videos" class="video-module"></video-module>
          <best-info :bestInfo="bestInfo" v-if="bestInfo" class="best-info" style="margin: 30px auto 10px;"></best-info>
          <table-data :showData="showData" :data="tableData" v-if="tableData.length > 0"></table-data>
          <div class="more-data" v-if="tableData.length > 0" @click="showHisData">更多历史数据></div>
        </div>

        <div v-else>
          <div class="date-choose">
            <div class="date">
              <span class="label">选择日期：</span>
              <el-date-picker v-model="dataDate" value-format="yyyy-MM-dd" type="date" align="center" popper-class="define-date" :editable="false" :clearable="false" @change="changeDateNot" :picker-options="pickerOptionsNot" placeholder="选择日期"> </el-date-picker>
            </div>
            <div class="btn" @click="preDay">前一天</div>
            <div class="btn" @click="lastDay">后一天</div>
          </div>
          <table-data :showData="showData" :data="tableData" v-if="tableData.length > 0"></table-data>
          <best-info :bestInfo="bestInfo" v-if="bestInfo" class="best-info" style="margin: 10px auto 30px;"></best-info>
          <video-module @play="playVideo" :videos="videos" class="video-module"></video-module>
        </div>
      </div>

      <module-tips1 class="module-tip" v-if="type == 'minuteLargeDdePulseQulet'"></module-tips1>
      <module-tips2 class="module-tip" v-if="type == 'minutePulseQulet'"></module-tips2>
      <module-tips3 class="module-tip" v-if="type == 'minuteUpShadow'"></module-tips3>
      <module-tips4 class="module-tip" v-if="type == 'minuteDivingGold'"></module-tips4>
      <pc-video-modal :initVideoIndex="initVideoIndex" :videos="videos"></pc-video-modal>
    </div>
    <login ref="login" v-if="loginShow" />
  </div>
</template>

<script>
import ModuleTips1 from '@/components/module-tips1.vue';
import ModuleTips2 from '@/components/module-tips2.vue';
import ModuleTips3 from '@/components/module-tips3.vue';
import ModuleTips4 from '@/components/module-tips4.vue';
import TableData from '@/components/table-data.vue';
import typeConfig from '@/config/typeConfig.js';
import VideoModule from '@/components/video-module.vue';
import BestInfo from '@/components/best-info.vue';
import PcVideoModal from '@/components/pc-video-modal.vue';
import axios from 'axios';
import login from '@/components/login.vue';
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
    login
  },
  data() {
    let self = this;
    return {
      initVideoIndex: -1,
      // 视频列表
      videos: [],
      // 类型配置数据
      typeInfo: typeConfig[this.$route.query.type],
      // 当前选择日期
      dataDate: '',
      endDate: '', // 会员剩余日期
      // 是否处于显示模式，未购买也可能进这个模式
      showData: false,
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
        }
      }
    };
  },
  mounted() {
    document.title = this.typeInfo.title;
    this.token = this.$cookieFun.getCookie("login_token")
    this.getVideoLists();
    this.getBestInfo();
    this.inti();
  },

  methods: {
    inti() {
      let url = ''
      if (process.env.NODE_ENV == 'development') {
        url = 'https://www.clswy.cn'
      }
      axios({
        method: 'post',
        url: url + '/userreg/ucenter/queryUserProduct'
      }).then(re => {
        let res = re.data
        if (res.code && res.code == 200) {
          this.logins = true // 已登录
          var data = res.data;
          if (data.length == 0) {
            // 无权限
            this.bought = false;
          } else {
            for (let i = 0; i < data.length; i++) {
              if (data[i].id == 21 || data[i].id == 1 || data[i].id == 2 || data[i].id == 3) {
                var newdate = new Date();
                var date = new Date(data[i].date);
                if (date <= newdate) {
                  // 无权限
                  this.bought = false;
                } else {
                  // 有权限
                  this.bought = true;
                  this.showData = true;
                  // 会员剩余日期
                  this.endDate = this.daysDistance(new Date(data[i].date), new Date());
                }
              }
            }
          }
        }else if (res.code == -1) {
           this.bought = false;
           this.logins = false // 未登录
        } else {
          this.bought = false;
        }
        this.getTradeDates();
      });
    },

    playVideo(index) {
      this.initVideoIndex = index;
    },

    toBuyP() {
      // 未登录
      if (this.logins == false) {
        this.loginShow = true
      }
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
      if (!this.bought && !this.showData) {
        // 通用数据查看
        this.$http.get(`/core/api/best_times/home_list/`).then(res => {
          if (res.data) {
            this.tableData = res.data.items || [];
          }
        });
      } else {
        this.$http.get(`/core/api/best_times/?date=${this.dataDate}`).then(res => {
          if (res.data) {
            this.tableData = res.data.items || [];
          }
        });
      }
    },
    getVideoLists() {
      this.$http.get(`/core/api/videos/?page_size=1000`).then(res => {
        this.videos = res.data.items;
      });
    },
    getBestInfo() {
      this.$http.get(`/core/api/best_times/best_info/`).then(res => {
        this.bestInfo = res.data;
      });
    },
    getTradeDates() {
      this.$http.get(`/core/api/best_times/trade_days/`).then(res => {
        this.tradeDates = res.data.items;
        if (this.bought) {
          this.dataDate = this.tradeDates[0];
        } else {
          this.dataDate = this.tradeDates[5];
        }
        this.getTableData();
      });
    },
    preDay() {
      let idx = this.tradeDates.indexOf(this.dataDate);
      if (idx == this.tradeDates.length - 1) {
        this.$dm.alert('日期无交，请重新选择!', '温馨提示', {
          dangerouslyUseHTMLString: true,
          showClose: false,
          confirmButtonText: '我知道了',
          confirmButtonClass: 'alert-confirm',
          customClass: 'tips-toast',
          center: true
        });
        return;
      }
      this.dataDate = this.tradeDates[idx + 1];
      this.getTableData();
    },
    lastDay() {
      let idx = this.tradeDates.indexOf(this.dataDate);
      if (idx == 0) {
        this.$dm.alert('日期无交，请重新选择!', '温馨提示', {
          dangerouslyUseHTMLString: true,
          showClose: false,
          confirmButtonText: '我知道了',
          confirmButtonClass: 'alert-confirm',
          customClass: 'tips-toast',
          center: true
        });
        return;
      }
      this.dataDate = this.tradeDates[idx - 1];
      this.getTableData();
    },
    showHisData() {
      window.scroll(0, 0);
      this.showData = true;
      this.getTableData();
    },
    changeDateNot(date) {
      this.dataDate = date;
      this.getTableData();
    }
  }
};
</script>

<style lang="scss">
.width-container {
  width: 1200px;
  margin: 0 auto;
}

.back {
  background: #0f0f12;
}

.top-header {
  background-image: url('../assets/img/web/beijing@2x.png');
  height: 260px;
  background-size: cover;
  background-repeat: no-repeat;
  height: 260px;
  > div {
    padding-top: 39px;
    padding-left: 30px;
    padding-right: 30px;
    position: relative;
    display: flex;
    justify-content: space-between;
    .pro-info {
      width: 600px;
    }
    .buy-info {
      text-align: right;
      #price {
        font-size: 40px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #ffffff;
        line-height: 52px;
        margin-bottom: 31px;
      }
      .buy-btn {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #ffffff;
        line-height: 21px;
        cursor: pointer;
        img {
          width: 180px;
          margin-left: 10px;
        }
      }
    }
    .pro-tips {
      font-size: 16px;
      font-weight: 400;
      color: #adadad;
      line-height: 21px;
      margin-top: 30px;
    }
  }
}

.content-area {
  background: #15171e;
  width: 1200px;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: -35px;
  padding: 30px;
  .more-data {
    padding: 6px 0;
    margin: 0 auto;
    border: 1px solid #ddd;
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
  }
}

.module-tip {
  margin-top: 30px;
}

.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  .content {
    width: 1140px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #2d2d2d;
    .header {
      display: flex;
      justify-content: space-between;
      padding: 15px 20px;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      line-height: 24px;
      img {
        width: 20px;
        cursor: pointer;
      }
    }

    .video-container {
      display: flex;
      height: 450px;
      .players {
        width: 800px;
        height: 450px;
      }
      .video-list {
        background: #2d2d2d;
        border-top: 1px solid #3c3c3c;
        > div {
          height: 50px;
          width: 340px;
          border-bottom: 1px solid #3c3c3c;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 15px;
          font-size: 14px;
          color: #969696;
          cursor: pointer;
          line-height: 19px;
          img {
            width: 18px;
          }
          &.active {
            background: #1e1e1e;
            color: #ffcfa3;
          }
          &:hover {
            color: #ffcfa3;
          }
        }
      }
    }
  }
}
</style>
