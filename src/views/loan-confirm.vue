<template>
  <div class="loan-confirm">
    <div class="head">
      <m-icon class="icon" type="loan/repayment" :width="30" :height="24" />
      Repayment
    </div>
    <div class="loan-info">
      <div class="item">
        <span>Loan Amount</span>
        <span class="fs-24 font-bold color-000">₹{{ orderInfo.actualAmount }}</span>
      </div>
      <div class="item">
        <span>Application Date</span>
        <span>{{ orderInfo.applyTime  }}</span>
      </div>
      <div class="item">
        <span>Due Date</span>
        <span>{{ orderInfo.expectedRepaymentTime }}</span>
      </div>
      <div class="item">
        <span>Wallet Number</span>
        <span>{{ orderInfo.bankCardNo }}</span>
      </div>
      <div class="item">
        <span>Wallet Method</span>
        <span>{{ orderInfo.bankCardName }}</span>
      </div>
    </div>

    <div class="loan-desc">The specific amount will be confirmed after reviewing. If your order is approved, we will charge the processing fee, including the service fee (no more than 7%), review fee (8%-15%), and GST(18%) This page is for reference only. The amount will be credited to your account directly after approval.</div>

    <div class="submit">
      <button :disabled="!canSubmit" @click="submit">Submit</button>
      <div class="policy" @click="togglePolicy">
        <m-icon class="icon" :type="choosed ? 'radio-choosed' : 'radio-unchoose'" :width="14" :height="14" />
        I have read and agreed to the &nbsp;<span @click="checkAgreement">loan Agreement</span></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    choosed: {
      handler() {
        this.canSubmit = !!this.choosed;
      },
      deep: true,
    },
  },
  data() {
    return {
      choosed: true,
      canSubmit: true,
      orderInfo: '',
      orderId: this.$route.query.orderId
    };
  },
  mounted() {
    this.getOrderInfo();
  },
  methods: {
    checkAgreement() {
      location.href = `${this.appGlobal.apiPrefix}/api/h5/contract?orderNo=${this.orderId}`;
    },
    togglePolicy() {
      this.choosed = !this.choosed;
    },
    async getOrderInfo() {
      let data = await this.$http.post('/zihai/bmzcxadafkbywtijqa', { orderId: this.orderId });
      let data2 = await this.$http.post('/zihai/bmzcxadafkbywtijqz', { orderId: this.orderId });
      this.orderInfo = { ...data.data, ...data2.data };
      console.log(this.orderInfo);
    },
    async submit() {
      try {
        await this.$http.post(`/zihai/bmzcx`, { orderId: this.orderId });
        // 成功或者失败的跳转
        this.innerJump('loan-success', { orderId: this.orderId }, true);
      } catch (error) {
        this.$toast(error.message);
        setTimeout(() => {
          this.innerJump('loan-fail', { orderId: this.orderId }, true);
        }, 1000)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loan-confirm {
  background: #f4f4f4;
  .head {
    padding: 20px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    line-height: 24px;
    background: #fff;
    .icon {
      margin-right: 20px;
    }
  }
  .loan-desc {
    margin-top: 6px;
    padding: 20px;
    font-size: 10px;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    background: #fff;
  }
  .loan-info {
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    background: #fff;
    .item {
      padding-top: 10px;
      padding-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        &:first-child {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          line-height: 18px;
        }
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    button {
      margin: 20px 20px 10px;
      height: 48px;
      width: 320px;
      border-radius: 14px;
      font-size: 18px;
      font-weight: 900;
      background: #1143a4;
      color: #fff;
      line-height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      box-sizing: border-box;
      padding: 0;
      &:disabled {
        background: #e9e9e9;
        color: #999999;
      }
    }

    .policy {
      padding: 0 20px;
      font-size: 10px;
      font-weight: 400;
      color: #000000;
      line-height: 16px;
      display: flex;
      align-items: center;
      transform: scale(0.9);
      margin-bottom: 10px;
      width: 110%;
      margin-left: -5%;
      .icon {
        margin-right: 10px;
      }
      span {
        color: #1143a4;
      }
    }
  }
}
</style>
