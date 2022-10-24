<template>
  <div class="back">
    <img class="img-name" :src="require('@/assets/img/' + typeInfo.titleImg)" />
    <div class="pro-tips">{{ typeInfo.tipsTop }}</div>

    <div class="content-area">
      <div class="date-choose">
        <div @click="preDay">&lt;前一天</div>
        <div class="date">
          <el-date-picker v-model="dataDate" value-format="yyyy-MM-dd" type="date" align="center" popper-class="define-date" :editable="false" :clearable="false" @change="changeDateNot" :picker-options="pickerOptionsNot" placeholder="选择日期"> </el-date-picker>
        </div>
        <div @click="lastDay">后一天&gt;</div>
      </div>
      <table-data :data="tableData" :isFirst="dataDate == tradeDates[0]"></table-data>
    </div>

    <div class="detail-data">
      <header>
        <div class="info">
          <div>{{ typeInfo.title }}</div>
          <div>实时监控强势股的低吸机会</div>
        </div>
        <div class="buy-area">
          <div class="buy" @click="toBuy">{{ this.bought ? '立即续费' : '立即购买' }}></div>
          <div class="expires" v-if="bought && endDate > 0">{{ endDate }}天到期</div>
        </div>
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
        <div class="more-data" v-if="tableData.length > 0" @click="showHisData">更多历史数据></div>
      </div>
    </div>
    <el-dialog :visible="agree" class="agree_list" v-if="agree">
      <div class="agreeB">
        <div class="title">用户订阅须知</div>
        <div class="bcent">
          1.本产品提供LEVEL2数据模型均依据盘末资金与往日资金量化对比计算而来，作为客观数据提供给用户。<br />
          2.客户在使用本产品前，必须仔细阅读相关说明书，了解其实际功能、使用方法、算法规则；<br />
          3.本产品不提供买入、卖出建议、股票池等投资建议，仅供客户参考，不能确保客户获得盈利或资金不受损失。客户应基于独立的判断，自行决定并承担损失。
        </div>
        <div class="back_argee" @click="toback">退出</div>
        <div class="argee1" id="agree" @click="agreeT">同意并使用</div>
      </div>
    </el-dialog>
    <el-dialog :visible="agree1" class="agree_list" v-if="agree1">
      <div class="agreeB">
        <div class="title">用户订阅须知</div>
        <div class="bcent">
          1.本产品提供LEVEL2数据模型均依据固定算法计算而来，作为客观数据提供给用户。<br />
          2.客户在使用本产品前，必须仔细阅读相关说明书，了解其实际功能、使用方法、算法规则；<br />
          3.本产品不提供买入、卖出建议、股票池等投资建议，仅供客户参考，不能确保客户获得盈利或资金不受损失。客户应基于独立的判断，自行决定并承担损失。
        </div>
        <a :href="toBuyCls"><div class="argee2" @click="toProduct">同意并使用</div></a>
      </div>
    </el-dialog>
    <video-module :videos="videos" class="video-module"></video-module>
    <module-tips1 class="module-tip" v-if="type == 'minuteLargeDdePulseQulet'"></module-tips1>
    <module-tips2 class="module-tip" v-if="type == 'minutePulseQulet'"></module-tips2>
    <module-tips3 class="module-tip" v-if="type == 'minuteUpShadow'"></module-tips3>
    <module-tips4 class="module-tip" v-if="type == 'minuteDivingGold'"></module-tips4>
    <buy-bottom :title="typeInfo.title" :text="typeInfo.btnDesc" :buyText="bought ? '立即续费' : '立即购买'" @tobuy="toBuy"></buy-bottom>
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
      isFirstTableData: true,
      timeInterval: '',
      // 视频列表
      videos: [],
      // 类型配置数据
      typeInfo: typeConfig[this.$route.query.type],
      // 当前选择日期
      dataDate: '',
      endDate: '', // 会员剩余日期
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
      agree: false,
      agree1: false,
      clsPro: '',
      toBuyCls: '',
      // 交易日历
      tradeDates: [],
      pickerOptionsNot: {
        disabledDate(date) {
          return self.dealPickerOptionsNot(date);
        },
      },
    };
  },

  watch: {
    dataDate(newDate, oldDate) {
      this.isFirstTableData = true;
      if (this.bought && newDate == this.tradeDates[0]) {
        if (!this.timeInterval) {
          this.timeInterval = setInterval(() => {
            this.isFirstTableData = false;
            this.getTableData();
          }, 15000);
        }
      } else {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
      }
    },
  },

  async mounted() {
    document.title = this.typeInfo.title;
    this.getVideoLists();
    this.getBestInfo();
    if (this.$route.query.wy == 1) {
      this.getUserBoughtInfo((data) => {
        this.bought = data.bought;
        this.logins = data.logins;
        console.log('this.bought', this.bought);
        this.endDate = data.endDate;
        this.getTradeDates();
      });
    } else {
      // 大单回调的产品购买链接
      if (this.type == 'minuteLargeDdePulseQulet') {
        this.clsPro = 27824;
        this.toBuyCls = 'cailianshe://payment?productId=' + 27824;
      } else if (this.type == 'minutePulseQulet') {
        // 强势回调
        this.clsPro = 27825;
        this.toBuyCls = 'cailianshe://payment?productId=' + 27825;
      } else if (this.type == 'minuteDivingGold') {
        this.clsPro = 27826;
        // 潜水捞金
        this.toBuyCls = 'cailianshe://payment?productId=' + 27826;
      }
      await this.getUserCls();
      this.getTradeDates();
    }
  },

  methods: {
    // 财联社方法
    toProduct() {
      // this.buy = true
      this.agree1 = false;
    },
    // 退出// 财联社方法
    toback() {
      var u = navigator.userAgent;
      // 安卓
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
      // IOS
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        window.wuyang.goToBack();
      } else if (isiOS) {
        window.webkit.messageHandlers.goToBack.postMessage('test');
      }
    },
    agreeT() {
      this.agree = false;
      console.log(this.agree);
      localStorage.setItem(this.type, '同意使用产品');
    },
    getUserCls() {
      return new Promise((resolve, reject) => {
        // 财联社权限判断
        let token = this.$route.query.token || '';
        let os = this.$route.query.os || '';
        this.bought = false;
        this.logins = false;
        axios({
          method: 'get',
          url: '/getui/cls/checkAuth?token=' + token + '&os=' + os + '&productId=' + this.clsPro,
        })
          .then((re) => {
            let res = re.data;
            if (res.code && res.code == 200) {
              if (res && res.data && res.data.bought && res.data.expiryDate && res.data.bought == true && res.data.expiryDate !== -1) {
                //已付费 未到期
                this.bought = true;
                this.logins = true;
                this.endDate = res.data.expiryDate;
                resolve();
              } else {
                // 如果没有点过同意协议就弹出让他点
                let agreeHt = localStorage.getItem(this.type);
                if (!agreeHt) {
                  this.agree = true;
                }
                resolve();
              }
            } else {
              let agreeHt = localStorage.getItem(this.type);
              if (!agreeHt) {
                this.agree = true;
              }
              resolve();
            }
          })
          .catch((res) => {
            let agreeHt = localStorage.getItem(this.type);
            if (!agreeHt) {
              this.agree = true;
            }
            resolve();
          });
      });
    },
    toBuy() {
              console.log(this.agree1)
      if (this.$route.query.wy == 1) {
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
      } else {
        this.agree1 = true
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
          }
          if (this.bought && !this.isFirstTableData && this.dataDate == this.tradeDates[0] && this.tableData.length > 0) {
            // 判断哪些本次新增的并提醒
            this.judgeNewTableAndVoice(this.tableData, oldTableData, this.typeInfo.voicePrefix);
          }
        })
        .catch((res) => {});
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
        this.$dm.alert('日期无效，请重新选择!', '温馨提示', {
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
      let routeInfo = this.$router.resolve({ name: 'More-Datas', query: { type: this.type, proId: this.proId, wy: this.$route.query.wy } });
      location.href = routeInfo.href;
    },
    changeDateNot(date) {
      this.dataDate = date;
      this.getTableData();
    },
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
  },
};
</script>

<style lang="scss">
.agree_list .el-dialog {
  width: 339px;
  background: #ffffff;
  border-radius: 12px;
  padding: 15px;
  box-sizing: border-box;
  padding-bottom: 40px;
  .el-dialog__body {
    padding-top: 10px;
    padding-left: 0;
    padding-right: 0;
  }
  .el-dialog__header {
    display: none;
  }
  .title {
    font-weight: bold;
    text-align: center;
    font-size: 14px;
    color: #cb020c;
  }
  .bcent {
    margin-top: 14px;
    font-size: 14px;
    color: #cb020c;
    line-height: 1.5;
  }
  .back_argee {
    width: 45%;
    line-height: 30px;
    background: #ddd;
    color: #333;
    text-align: center;
    border-radius: 15px;
    margin-left: 3%;
    float: left;
    text-align: center;
    margin-top: 10px;
    font-size: 13px;
  }
  .argee1 {
    line-height: 30px;
    margin-top: 10px;
    text-align: center;
    border-radius: 15px;
    width: 45%;
    float: right;
    margin-right: 3%;
    background-color: #cb020c;
    color: #fff;
    font-size: 13px;
  }
  .argee2 {
    line-height: 30px;
    margin-top: 20px;
    text-align: center;
    border-radius: 15px;
    width: 90%;
    float: left;
    margin-left: 5%;
    background-color: #cb020c;
    color: #fff;
    font-size: 13px;
  }
}
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

.detail-data {
  border-radius: 5px;
  padding: 10px;
  background: #fff;
  margin-bottom: 10px;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .buy-area {
      .buy {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #cf0f0a;
        line-height: 20px;
      }
      .expires {
        font-size: 12px;
        font-weight: 400;
        color: #969696;
        line-height: 17px;
      }
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

  .more-data {
    width: 140px;
    height: 24px;
    background: #f2f6f7;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    margin: 0 auto;
    text-align: center;
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
}

.content-area {
  border-radius: 5px;
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
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

.module-tip {
  margin-top: 10px;
}
</style>
