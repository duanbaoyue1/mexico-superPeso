<template>
  <div class="back">
    <img class="img-name" :src="require('@/assets/img/' + typeInfo.titleImg)" />
    <div class="pro-tips">{{ typeInfo.tipsTop }}</div>
    <div v-if="!bought && !showData" class="not-login">
      <video-module :videos="videos" class="video-module"></video-module>
      <div class="detail-data">
        <header>
          <div class="info">
            <div>{{ typeInfo.title }}</div>
            <div>实时监控强势度的低吸机会</div>
          </div>
          <div class="buy" @click="toBuy">立即购买></div>
        </header>
        <div class="best-detail" v-if="bestInfo">
          <div>
            <div class="name">
              近期最强牛股: <span style="color: #ea413c">{{ bestInfo.bestStockName }} </span>
            </div>
            <div class="percent">
              <span :style="{ color: bestInfo.monthWinRate > 0 ? '#ea413c' : '#0cad00' }">{{ bestInfo.monthWinRate }}</span>
              <span>%</span>
            </div>
            <div class="tips">近一个月个股胜率<img @click="openBoxWin" :src="require('@/assets/img/tips@2x.png')" /></div>
          </div>
          <div>
            <div class="name">
              选出后最高涨幅:
              <span v-html="$options.filters.percentFilter(bestInfo.highestGain, 2, true)"></span>
            </div>
            <div class="percent">
              <span v-html="$options.filters.percentFilter(bestInfo.monthDayYieldRate, 2, true)"></span>
            </div>
            <div class="tips">近一个月平均日收益<img @click="openBoxWinYield" :src="require('@/assets/img/tips@2x.png')" /></div>
          </div>
        </div>
        <div>
          <table-data :showData="showData" :data="tableData" v-if="tableData.length > 0"></table-data>
          <div class="more-data" v-if="tableData.length > 0" @click="showHisData">更多历史数据></div>
        </div>
      </div>
    </div>
    <div v-else class="has-login">
      <div class="login-area">
        <div class="date-choose">
          <div @click="preDay">&lt;前一天</div>
          <div class="date">
            <el-date-picker v-model="dataDate" value-format="yyyy-MM-dd" type="date" align="center" popper-class="define-date" :editable="false" :clearable="false" @change="changeDateNot" :picker-options="pickerOptionsNot" placeholder="选择日期"> </el-date-picker>
          </div>
          <div @click="lastDay">后一天&gt;</div>
        </div>
        <table-data :showData="showData" :data="tableData" v-if="tableData.length > 0"></table-data>
        <div class="best-info" v-if="bestInfo">
          <div>
            近期最强牛股: <span style="color: #ea413c">{{ bestInfo.bestStockName }}</span>
          </div>
          <div>
            选出后最高涨幅:
            <span v-html="$options.filters.percentFilter(bestInfo.highestGain, 2, true)"></span>
          </div>
        </div>
      </div>
      <video-module :videos="videos" class="video-module"></video-module>
    </div>
    <module-tips1 class="module-tip" v-if="type == 'minuteLargeDdePulseQulet'"></module-tips1>
    <module-tips2 class="module-tip" v-if="type == 'minutePulseQulet'"></module-tips2>
    <module-tips3 class="module-tip" v-if="type == 'minuteUpShadow'"></module-tips3>
    <module-tips4 class="module-tip" v-if="type == 'minuteDivingGold'"></module-tips4>
    <buy-bottom v-if="!bought" :title="typeInfo.title" :text="typeInfo.btnDesc" :buyText="bought ? '立即续费' : '立即购买'" @click="toBuy"></buy-bottom>
  </div>
</template>

<script>
import ModuleTips1 from '@/components/m/module-tips1.vue';
import ModuleTips2 from '@/components/m/module-tips2.vue';
import ModuleTips3 from '@/components/m/module-tips3.vue';
import ModuleTips4 from '@/components/m/module-tips4.vue';
import BuyBottom from '@/components/m/buy-bottom.vue';
import TableData from '@/components/m/table-data.vue';
import typeConfig from '@/config/typeConfig.js';
import VideoModule from '@/components/m/video-module.vue';
import axios from 'axios';
export default {
  components: {
    ModuleTips1,
    ModuleTips2,
    ModuleTips3,
    ModuleTips4,
    BuyBottom,
    TableData,
    VideoModule,
  },
  data() {
    let self = this;
    return {
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
      token: this.$route.query.token,
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
      pickerOptionsNot: {
        disabledDate(date) {
          return self.dealPickerOptionsNot(date);
        },
      },
    };
  },

  mounted() {
    window.token = (this.$cookieFun.getCookie('login_token') || '').replace(/"/g, '');
    console.log(window.token);
    document.title = this.typeInfo.title;
    this.getVideoLists();
    this.getBestInfo();
    this.init();
  },

  methods: {
    init() {
      axios({
        method: 'post',
        url: '/userreg/ucenter/queryUserProduct',
      }).then((re) => {
        let res = re.data;
        if (res.code && res.code == 200) {
          var data = res.data;
          if (data.length == 0) {
            // 无权限
            this.bought = false;
            this.showData = false;
          } else {
            for (let i = 0; i < data.length; i++) {
              if (data[i].id == this.proId || data[i].id == 1 || data[i].id == 2 || data[i].id == 3) {
                var newdate = new Date();
                var date = new Date(data[i].date);
                if (date <= newdate) {
                  // 无权限
                  this.bought = false;
                  this.showData = false;
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
        } else {
          this.bought = false;
          this.showData = false;
        }
        this.getTradeDates();
      });
    },
    toBuy() {
      // index首页
      window.uniWebViewF(function () {
        console.log(webUni.webView);
        var uniWebView = webUni.webView; //必须在这时候保存下来
        uniWebView.postMessage({
          data: {
            action: 'tobuy',
          },
        });
      });
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
        this.$http.get(`/core/api/best_times/home_list/`).then((res) => {
          if (res.data) {
            this.tableData = res.data.items || [];
          }
        });
      } else {
        this.$http.get(`/core/api/best_times/?date=${this.dataDate}`).then((res) => {
          if (res.data) {
            this.tableData = res.data.items || [];
          }
        });
      }
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
        this.$dm.alert('日期无交，请重新选择!', '温馨提示', {
          dangerouslyUseHTMLString: true,
          showClose: false,
          confirmButtonText: '我知道了',
          confirmButtonClass: 'alert-confirm',
          customClass: 'tips-toast',
          center: true,
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
    },
    openBoxWin() {
      this.$dm.alert('<ul><li style="color: #EA413C">1、统计范围：选取策略所有股票</li><li>2、统计选出后至今的最高价 </li><li>3、统计近一个月的胜率</li></ul>', '近一月个股胜率', {
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '我知道了',
        confirmButtonClass: 'alert-confirm',
        customClass: 'tips-toast',
        center: false,
      });
    },
    openBoxWinYield() {
      this.$dm.alert('<ul><li style="color: #EA413C">1、统计范围：选取策略所有股票</li><li>2、统计选出后至今的最高价 </li><li>3、将所有收益平均到每一天</li></ul>', '近一月平均日收益', {
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '我知道了',
        confirmButtonClass: 'alert-confirm',
        customClass: 'tips-toast',
        center: false,
      });
    },
  },
};
</script>

<style lang="scss">
.back {
  background-image: url('../../assets/img/back@2x.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  padding: 13px 13px 13px !important;
  background-color: #cf0f0a;
  padding-bottom: 63px !important;
  &.bought {
    padding-bottom: 13px !important;
  }
}

.el-date-editor {
  width: 110px !important;
  .el-input__inner {
    text-align: center;
    background: #fff8f6;
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
  }
}

.video-module {
  margin-bottom: 10px;
}
.pro-tips {
  font-size: 13px;
  font-weight: 400;
  color: #ffffff;
  line-height: 18px;
  margin-bottom: 13px;
  margin-top: 15px;
}

.img-name {
  margin: 17px auto 0px;
  width: 210px;
  display: block;
}

.not-login {
  .detail-data {
    border-radius: 5px;
    padding: 10px;
    background: #fff;
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      .buy {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #cf0f0a;
        line-height: 20px;
      }
      .info {
        div {
          font-size: 14px;
          font-weight: 500;
          color: #000000;
          line-height: 20px;
          margin-bottom: 3px;
          &:last-child {
            font-size: 12px;
            font-weight: 400;
            color: #333333;
            line-height: 17px;
            margin-bottom: 0;
          }
        }
      }
    }
    .best-detail {
      display: flex;
      flex: 1;
      > div {
        flex: 1;
        text-align: center;
        .name {
          font-size: 12px;
          font-weight: 400;
          color: #666666;
          line-height: 17px;
          margin-bottom: 10px;
        }
        .percent {
          font-size: 14px;
          font-weight: 600;
          color: #e60100;
          line-height: 20px;
          margin-bottom: 5px;
        }
        .tips {
          font-size: 12px;
          font-weight: 400;
          color: #969696;
          margin-bottom: 10px;
          height: 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 12px;
            margin-left: 5px;
          }
        }
      }
    }
    .more-data {
      font-size: 10px;
      font-weight: 400;
      color: #333333;
      line-height: 12px;
      padding: 4px 0;
      margin: 0 auto;
      border: 1px solid #ebeef5;
      border-top: none;
      text-align: center;
    }
  }
}

.has-login {
  .login-area {
    border-radius: 5px;
    background: #fff;
    padding: 10px;
    .date-choose {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 16px;
      margin-bottom: 10px;
      .date {
        height: 24px;
        border-radius: 3px;
        padding: 0 5px;
        font-size: 15px;
        color: #cf0f0a;
        display: flex;
        align-items: center;
        img {
          width: 14px;
          display: block;
          margin-right: 4px;
        }
      }
    }
    .best-info {
      margin-top: 10px;
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      line-height: 17px;
      display: flex;
      justify-content: space-between;
    }
  }
}
.module-tip {
  margin-top: 10px;
}
</style>
