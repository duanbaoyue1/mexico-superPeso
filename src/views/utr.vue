<template>
  <div class="utr content-area">
    <div class="utr-input">
      <div class="head flex-between">
        <span>UTR</span>
        <span class="color-red" @click="goUTRHelp()">How to check UTR?</span>
      </div>
      <input class="utr-value" v-model="utr" placeholder="Please enter UTR" />
      <m-icon type="handy/蓝右" class="right-icon" :width="12" :height="14" />
    </div>

    <div class="error-tips color-red fs-12" v-if="showError" :class="{ 'show-error': showError }">Please enter correct UTR.</div>

    <div class="repay">
      <div class="head">Repay</div>
      <div>
        1.When payment is completed,remember to fill in the UTR here;
        <br />
        2.If you haven't complete the payment, you can click
        <span class="here" @click="recreate">here</span>
        to repay;
        <br />
        3.If multiple payments are made, multiple UTRs can be submitted repeatedly”
      </div>
    </div>

    <div class="actions">
      <div class="btns">
        <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Confirm UTR</button>
      </div>
      <div class="help-center" @click="goAppBack">I don't get UTR?</div>
    </div>
  </div>
</template>

<script>
export default {
  watch: {
    utr() {
      this.canSubmit = this.utr.length == 12;
      this.showError = this.utr.length != 12;
    },
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'UTR',
    });
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      type: this.$route.query.type || 'repay',
      utr: '',
      showError: false,
      canSubmit: false,
      orderUrl: '',
    };
  },
  async mounted() {
    this.orderUrl = await this.getOrderRelateUrl(this.orderId);
  },
  methods: {
    recreate() {
      if (this.type == 'repay') {
        location.href = this.orderUrl.repaymentUrl;
      } else {
        location.href = this.orderUrl.extensionUrl;
      }
    },
    async submit() {
      try {
        let data = await this.$http.post(`/api/repayment/repayUTR`, {
          utr: this.utr,
          orderId: this.orderId,
        });
        console.log(data);
        if (data.returnCode == 2000) {
          this.$toast('Submitted successfully, UTR to be confirmed');
          setTimeout(() => {
            this.goAppBack();
          }, 1000);
        }
      } catch (error) {
        this.$toast(error.message);
      }
    },
    goUTRHelp() {
      this.innerJump('utr-help', { orderId: this.orderId });
    },
  },
};
</script>

<style lang="scss" scoped>
.utr {
  padding-top: 14px;
  padding-left: 24px;
  padding-right: 24px;

  &-input {
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 24px;
    position: relative;
    .right-icon {
      position: absolute;
      right: 16px;
      bottom: 18px;
    }

    .head {
      font-size: 16px;
      font-weight: 500;
      color: #000000;
      line-height: 18px;
      margin-bottom: 16px;
    }
    .utr-value {
      width: 220px;
      height: 18px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      box-sizing: border-box;
      border: none;
    }
  }
  .actions {
    position: fixed;
    padding: 10px 24px;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
    .bottom-submit-btn {
      margin: 0;
    }
    .btns {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      button {
        flex: 1;
        &:nth-child(2) {
          margin-left: 10px;
        }
        &:disabled {
          background: #e9e9e9;
          border: 1px solid #e9e9e9;
          color: #999999;
        }
      }
    }
    .help-center {
      font-size: 14px;
      font-weight: 500;
      color: #fc2214;
      line-height: 18px;
      text-align: center;
      text-decoration: underline;
    }
  }

  .error-tips {
    margin-top: -12px;
    margin-bottom: 20px;
    visibility: hidden;
    &.show-error {
      visibility: visible;
    }
  }
  .repay {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 24px;
    .head {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      margin-bottom: 10px;
    }
    .here {
      color: #fc2214;
      text-decoration: underline;
    }
  }
}
</style>
