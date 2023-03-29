<template>
  <div class="loan multi">
    <div class="loan-tips">
      <m-icon class="icon" type="loan/success" :width="122" :height="109" />
      <div class="title" v-if="this.loans.length > 0">
        Congratulations
        <br />
        Your application is successful
      </div>
      <div v-if="!this.loans.length" class="apply" @click="check">View all orders</div>
      <div v-else class="apply" @click="applyMulti">Increase ₹{{ totalAmount }} Amount</div>
    </div>

    <div class="other-loans" v-if="loans.length > 0">
      <div class="tips">You are in our special VIP exclusive channel in view of your good qualification.</div>
      <div class="checked-num">
        Already Select
        <span>{{ checkedNums }} products</span>
      </div>
      <div v-for="(loan, index) in loans" :key="loan.id" class="loan-item" :class="{ active: !loan.unChecked }" @click="checkLoan(index)">
        <img class="icon" :src="loan.icon" />
        <div class="info">
          <div class="name">{{ loan.productName }}</div>
          <div class="value">
            Loan Amount (₹):
            <span>{{ loan.maxAmount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 没有推荐结果时显示 -->
    <res-loans v-else class="res-loans" :systemTime="systemTime"></res-loans>
    <google-feedback v-show="showGoogleFeed" :show.sync="showGoogleFeed"></google-feedback>

    <div class="control-back" v-if="showBackControl">
      <div class="content">
        <div class="head">
          <img :src="require('@/assets/img/tips@2x.png')" />
        </div>
        <div class="content">
          You are just one step away from a ₹{{ totalAmount }} credit limit, are you sure you want to give up your eligibility?
          <div class="count">
            Auto Abort after
            <span>{{ count }}S</span>
          </div>
        </div>
        <div class="action">
          <button class="btn-default" @click="showBackControl = false">Think again</button>
          <div class="leave" @click="leave">Leave</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ResLoans from '@/components/res-loans.vue';
import GoogleFeedback from '@/components/google-feedback.vue';
export default {
  components: {
    ResLoans,
    GoogleFeedback,
  },
  watch: {
    showGoogleFeed: {
      handler() {
        if (!this.showGoogleFeed && this.nextStep) {
          this.toAppMethod(this.nextStep, { closeCurPage: true });
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      needRecommend: JSON.parse(this.$route.query.needRecommend || true), // 是否需要推荐 从活动过来的不用推荐
      systemTime: this.$route.query.systemTime || '', // 上次订单时间
      single: JSON.parse(this.$route.query.single || false), // 是否是单推
      loans: [],
      count: 10,
      totalAmount: 0,
      checkedNums: 0,
      nextStep: '',
      showBackControl: false,
      backInterval: null, // 回退倒计时
      showGoogleFeed: false,
      isSysNeedGoogle: false,
    };
  },
  beforeRouteLeave(to, from, next) {
    this.toAppMethod('needBackControl', { need: false });
    next();
  },
  mounted() {
    this.toAppMethod('needBackControl', { need: true });

    // 从系统读取是否需要弹google窗
    // TODO

    if (this.needRecommend) {
      this.getRecommendLoans();
    }
    // 用户点击回退回调
    window.backBtnHandler = async data => {
      if (this.loans.length) {
        this.showBackModal();
      } else {
        this.nextStep = 'goBack';
        this.showGoogleFeed = true;
      }
    };

    // 银行卡选择后app抓取数据回调
    window.synDataCallback = async data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        let loanIds = this.loans.filter(t => !t.unChecked).map(t => t.id);
        try {
          let data1 = await this.$http.post(`/zihai/qvsxvbget/xiyymmst`, {
            orderNo: this.$route.query.orderId,
            productList: loanIds,
          });
          if (data1.returnCode == 2000) {
            await this.$http.post(`/zihai/qvsxvbget/bmzcx`, {
              orderIdList: data1.data.orderIdList,
            });
            this.$toast('Apply successfully');
            setTimeout(res => {
              this.getRecommendLoans();
            }, 1000);
          }
        } catch (error) {
          this.$toast(error.message);
        }
      }
    };
  },
  methods: {
    leave() {
      this.toAppMethod('needBackControl', { need: false });
      this.goHome();
    },
    showBackModal() {
      this.count = 10;
      window.clearInterval(this.backInterval);
      this.backInterval = null;
      this.backInterval = setInterval(() => {
        if (this.count == 0) {
          window.clearInterval(this.backInterval);
          this.backInterval = null;
        } else {
          this.count--;
        }
      }, 1000);
      this.showBackControl = true;
    },

    async getRecommendLoans() {
      try {
        this.showLoading();
        let data;
        if (this.single) {
          data = await this.$http.post(`/xiaqpdt/qwwdhvkzypaucoile`);
          this.loans = data.data.list || [];
          this.loans = this.loans.map(t => {
            t.maxAmount = t.minAmount;
            return t;
          });
        } else {
          data = await this.$http.post(`/xiaqpdt/qvsxvbfzcdpo/pgwhf`);
          this.loans = data.data.mergPushProductList || [];
        }
        this.updateCheckedNum();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    check() {
      // TODO
      this.toAppMethod('goAllOrders', { closeCurPage: true });
      // if (!this.loans.length) {
      //   this.nextStep = 'goAllOrders';
      //   this.showGoogleFeed = true;
      // } else {
      //   this.toAppMethod('goAllOrders', { closeCurPage: true });
      // }
    },
    checkLoan(index) {
      if (this.checkedNums == 1 && !this.loans[index].unChecked) return;
      this.$set(this.loans, index, { ...this.loans[index], unChecked: !this.loans[index].unChecked });
      this.updateCheckedNum();
    },

    updateCheckedNum() {
      this.checkedNums = this.loans.filter(t => !t.unChecked).length;
      this.totalAmount = this.sumArr(this.loans.filter(t => !t.unChecked).map(t => t.maxAmount));
    },

    async applyMulti() {
      this.toAppMethod('synData', {});
    },
  },
};
</script>

<style lang="scss" scoped>
.loan {
  .control-back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    > .content {
      width: 320px;
      height: 308px;
      padding: 20px;
      padding-top: 0;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 24px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .head {
        position: relative;
        height: 54px;
        img {
          border: 4px solid #fff;
          position: absolute;
          top: -27px;
          left: 50%;
          transform: translateX(-50%);
          width: 54px;
          border-radius: 100%;
          display: block;
          margin-bottom: 20px;
          background: #fff;
        }
      }
      .content {
        font-size: 17px;
        font-weight: 400;
        color: #000601;
        line-height: 24px;
        .count {
          font-size: 20px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #000601;
          line-height: 24px;
          margin-top: 20px;
          span {
            color: #1143a4;
            line-height: 24px;
            margin-left: 8px;
          }
        }
      }

      .action {
        margin-top: 34px;
        .btn-default {
          width: 100%;
          margin-bottom: 16px;
        }
        .leave {
          font-size: 17px;
          font-weight: 400;
          color: #999999;
          line-height: 24px;
          text-align: center;
        }
      }
    }
  }

  .bottom-action {
    width: 360px;
    height: 100px;
    background: #ffffff;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 20px 10px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: space-between;
      .btn-line {
        width: 120px;
      }
      .btn-default {
        width: 190px;
      }
    }
    .tips {
      font-size: 10px;
      font-weight: 400;
      line-height: 16px;
      margin-top: 10px;
      text-align: center;
    }
  }
  .other-loans {
    border-top: 6px solid #f4f4f4;
    margin: 30px 0px;
    padding: 0 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: -20px;
    padding-top: 30px;

    .tips {
      width: 320px;
      height: 76px;
      background: #d8e4fb;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      display: flex;
      align-items: center;
      padding: 0 20px;
    }

    .checked-num {
      margin: 20px 0;
      font-size: 16px;
      font-weight: 900;
      color: #333333;
      line-height: 24px;
      span {
        color: #1143a4;
        margin-left: 2px;
        text-decoration: underline;
      }
    }

    .loan-item {
      width: 320px;
      background: #ffffff;
      border-radius: 14px;
      border: 2px solid #e3eafd;
      padding: 20px;
      margin-bottom: 20px;
      position: relative;
      display: flex;
      align-items: center;
      .info {
        .name {
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
          margin-bottom: 8px;
        }
        .value {
          font-size: 10px;
          font-weight: 400;
          color: #999999;
          line-height: 12px;
          span {
            font-size: 16px;
            font-weight: bold;
            color: #333333;
            line-height: 20px;
          }
        }
      }
      .icon {
        width: 40px;
        height: 40px;
        display: block;
        margin-right: 10px;
      }
      &::after {
        position: absolute;
        content: ' ';
        top: -2px;
        right: -2px;
        width: 50px;
        height: 50px;
        background-image: url(../assets/img/loan/unchoose.png);
        background-repeat: no-repeat;
        background-size: contain;
      }

      &.active {
        border: 2px solid #1143a4;
        &::after {
          background-image: url(../assets/img/loan/choose.png);
        }
      }
    }
  }

  .loan-tips {
    padding-top: 100px;
    .icon {
      margin: 0 auto;
    }
    .title {
      margin-top: 30px;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      text-align: center;
    }
    .apply {
      width: 320px;
      height: 48px;
      background: #1143a4;
      border-radius: 14px;
      margin: 0 auto;
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
    }
  }

  &.multi {
    .loan-tips {
      padding-top: 40px;
    }
    .title {
      margin-bottom: 20px;
    }
  }
}
</style>
