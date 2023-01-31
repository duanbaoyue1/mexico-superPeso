<template>
  <div class="utr">
    <div class="head flex-between">
      <span>UTR</span>
      <span class="color-red" @click="goUTRHelp()">How to check UTR?</span>
    </div>
    <input class="utr-value" v-model="utr" placeholder="Please enter UTR" />
    <div class="error-tips color-red fs-12" :class="{ 'show-error': showError }">Please enter correct UTR.</div>
    <div class="repay">
      <div class="head">Repay</div>
      <div>
        1.When payment is completed,remember to fill in the UTR here; <br />
        2.If you haven't complete the payment, you can click <span class="font-bold color-blue" @click="recreate">here</span> to repay; <br />
        3.If multiple payments are made, multiple UTRs can be submitted repeatedly”
      </div>
    </div>

    <div class="actions">
      <div class="btns">
        <button class="btn-default" :disabled="!canSubmit" @click="submit">Submit</button>
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
  data() {
    return {
      orderId: this.$route.query.orderId,
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
      location.href = this.orderUrl.repaymentUrl;
    },
    async submit() {
      try {
        let data = await this.$http.post(`/wvzlxylao/wvzlxjep`, {
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
  padding-top: 30px;
  padding-left: 20px;
  padding-right: 20px;

  .actions {
    position: fixed;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
    padding: 10px 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
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
      color: #1143a4;
      line-height: 18px;
      text-align: center;
      text-decoration: underline;
    }
  }

  .head {
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 18px;
    margin-bottom: 10px;
  }
  .utr-value {
    width: 320px;
    height: 60px;
    border-radius: 14px;
    border: 1px solid #cccccc;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    padding: 0 20px;
    box-sizing: border-box;
    margin-bottom: 12px;
  }
  .error-tips {
    margin-top: 12px;
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
  }
}
</style>
