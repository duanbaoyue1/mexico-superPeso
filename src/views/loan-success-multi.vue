<template>
  <div class="loan multi">
    <div class="loan-tips">
      <m-icon class="icon" type="loan/success" :width="122" :height="109" />
      <div class="title">
        Congratulations
        <br />
        Your application is successful
      </div>
      <div class="apply" @click="check">Check Application</div>
    </div>

    <div class="other-loans" v-if="loans.length > 0">
      <div v-for="(loan, index) in loans" :key="loan.id" class="loan-item" :class="{ active: !loan.unChecked }" @click="checkLoan(index)">
        <img class="icon" :src="loan.icon" />
        <div class="name">{{ loan.productName }}</div>
        <div class="reloan-wrapper" v-show="loan.isReloan">
          <div class="reloan">Reloan</div>
        </div>
        <div class="label">Lending Company</div>
        <div class="value">{{ loan.companyName }}</div>
        <div class="label">Interest</div>
        <div class="value">{{ loan.interest }}%/Day</div>
        <div class="label">Max amount (₹)</div>
        <div class="value">{{ loan.maxAmount }}</div>
      </div>
    </div>

    <div class="bottom-action" v-if="loans.length > 0">
      <div class="btns">
        <button class="btn-line" @click="goHome">Back Home</button>
        <button class="btn-default" @click="applyMulti">Apply Immediately</button>
      </div>
      <div class="tips color-red">{{ checkedNums }} products selected, high pass rate, when apply together</div>
    </div>

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
          <div class="leave" @click="goAppBack">Leave</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      single: this.$route.query.single || false, // 是否是单推
      loans: [],
      count: 10,
      totalAmount: 0,
      checkedNums: 0,
      showBackControl: false,
      backInterval: null, // 回退倒计时
    };
  },
  mounted() {
    // TODO 测试
    this.toAppMethod('needBackControl', { need: true });

    this.getRecommendLoans();

    // 用户点击回退回调
    window.backBtnHandler = async data => {
      alert('检测到回调');
      this.showBackModal();
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
            this.getRecommendLoans();
          }
        } catch (error) {
          this.$toast(error.message);
        }
      }
    };
  },
  methods: {
    showBackModal() {
      this.count = 10;
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
        this.$loadingshow();
        let data1 = await this.$http.post(`/xiaqpdt/qvsxvbfzcdpo/pgwhv`);
        let data2 = await this.$http.post(`/xiaqpdt/qvsxvbfzcdpo/pgwhf`);
        this.loans = data2.data.mergPushProductList || [];
        if (this.loans.length) {
          this.toAppMethod('needBackControl', { need: true });
        }
        this.updateCheckedNum();
      } catch (error) {
      } finally {
        this.$loadinghide();
      }
    },
    check() {
      this.toAppMethod('goAllOrders', {});
    },
    checkLoan(index) {
      this.$set(this.loans, index, { ...this.loans[index], unChecked: !this.loans[index].unChecked });
      this.updateCheckedNum();
    },

    updateCheckedNum() {
      this.checkedNums = this.loans.filter(t => !t.unChecked).length;
    },

    async applyMulti() {
      this.toAppMethod('synData', {});
    },
  },
};
</script>

<style lang="scss" scoped>
.loan {
  padding-bottom: 120px;

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
    margin: 40px 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: -20px;

    .loan-item {
      width: 150px;
      background: #ffffff;
      border-radius: 14px;
      border: 2px solid #e3eafd;
      padding: 20px 0;
      margin-bottom: 20px;
      position: relative;
      .icon {
        width: 24px;
        height: 24px;
        display: block;
        margin: 0 auto;
        margin-bottom: 4px;
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

      .logo {
        margin: 0 auto;
      }
      .name {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin: 4px auto;
        text-align: center;
      }
      .reloan-wrapper {
        display: flex;
        box-sizing: border-box;
        justify-content: center;
        .reloan {
          height: 16px;
          border-radius: 10px;
          line-height: 1;
          text-align: center;
          border: 1px solid #ffbd5c;
          font-size: 10px;
          font-weight: 500;
          color: #ffbd5c;
          padding: 2px 10px 0px 10px;
          display: inline-block;
          margin-bottom: 20px;
        }
      }

      .label {
        font-size: 10px;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
        margin-bottom: 4px;
        text-align: center;
      }
      .value {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        line-height: 20px;
        margin-bottom: 10px;
        text-align: center;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
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
      margin-bottom: 60px;
    }
    .apply {
      width: 320px;
      height: 48px;
      background: #1143a4;
      border-radius: 14px;
      margin: 0 auto;
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
      margin-bottom: 40px;
    }
  }
}
</style>
