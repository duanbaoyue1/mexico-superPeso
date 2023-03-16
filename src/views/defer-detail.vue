<template>
  <div class="defer-detail" v-show="loaded">
    <div class="defer-head">
      <p>Defer for {{ detail.extendedTerm }} days</p>
      <p>Only pay for ₹{{ detail.amount }} today and you can defer {{ detail.extendedTerm }} days.</p>
    </div>
    <div class="step">
      <div class="step-item status">
        <div class="step-line"></div>
        <div class="step-wrapper">
          <div>
            <div class="head">
              <span>Application Date</span>
              <span>{{ detail.startTime }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="step-item">
        <div class="step-line"></div>
        <div class="step-wrapper">
          <div>
            <div class="head">
              <span>Due Date</span>
              <span>{{ detail.updatedDueDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="order-info">
      <div class="period">
        <span class="fs-16 font-bold">Repayment this period</span>
        <div>
          <span class="color-orange">₹</span>
          <span class="value">{{ detail.amount }}</span>
          <!-- <m-icon class="icon" type="gray-down" :width="16" :height="12" /> -->
        </div>
      </div>
      <div class="flex-between">
        <span>Interest</span>
        <span>₹ {{ detail.interest }}</span>
      </div>
      <div class="flex-between">
        <span>Deferment fee</span>
        <span>₹ {{ detail.defermentFee }}</span>
      </div>
      <div class="flex-between">
        <span>Overdue fee</span>
        <span>₹ {{ detail.overDueFee }}</span>
      </div>
    </div>

    <div class="desc">Description: After paying deferment fee, the repayment due date will be defered by 7 days. After 7-day derferment, you need to repay the principal + the interest of the new period + the service fee.</div>

    <div class="actions">
      <div class="btns">
        <button class="btn-default" @click="defer">Defer the repayment</button>
      </div>
    </div>

    <div class="modal" v-if="showPaymentTips">
      <div class="modal-content payment-success-container">
        <m-icon class="close" type="close" :width="15" :height="15" @click="showPaymentTips = false" />
        <div class="icon">
          <m-icon type="message/utr" :width="50" :height="50" />
        </div>
        <div class="content">
          <div class="remember">Remember</div>
          When payment is completed,
          <br />
          remember to
          <a @click="goFillUtr">fill in the UTR</a>
          in this app
        </div>
        <div class="action">
          <div class="cancel" @click="goTutorial">Tutorial</div>
          <div class="confirm" @click="repay">Repay</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {},
  data() {
    return {
      orderId: this.$route.query.orderId,
      loaded: false,
      showPaymentTips: false,
      detail: '',
      orderUrl: '',
    };
  },
  async mounted() {
    this.getDetail();
    this.orderUrl = await this.getOrderRelateUrl(this.orderId);
  },
  methods: {
    goFillUtr() {
      this.innerJump('utr', { orderId: this.orderId, type: 'defer' });
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl;
    },
    defer() {
      this.showPaymentTips = true;
    },
    async repay() {
      this.innerJump('utr', { nextUrl: this.orderUrl.extensionUrl, orderId: this.orderId, type: 'defer' });
    },
    async getDetail() {
      console.log('this.orderId', this.orderId);
      try {
        let data1 = await this.$http.post('/uzeaulazu/yvelghl', {
          id: this.orderId,
        });
        let data2 = await this.$http.post('/uzeaulazu/yvelgho', {
          id: this.orderId,
        });
        this.detail = {
          ...data1.data,
          ...data2.data,
        };
      } catch (error) {
      } finally {
        this.loaded = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-success-container {
  width: 320px;
  padding: 50px 10px 20px;
  .policy {
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    font-weight: 400;
    margin: 30px 10px 0;
    color: #000601;
    .m-icon {
      margin-top: -2px;
    }
    span {
      margin-left: 0px;
      transform: scale(0.9);
      margin-top: -10px;
    }
  }
  .icon {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 100%;
    padding: 5px;
  }
  .close {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  .content {
    margin-bottom: 30px;
    font-size: 16px;
    line-height: 30px;
    font-weight: 400;
    color: #000601;
    text-align: center;
    .remember {
      font-size: 20px;
      font-weight: bold;
      color: #000601;
      line-height: 24px;
      margin-bottom: 10px;
    }
    a {
      color: #1143a4;
      text-decoration: underline;
    }
  }
  .action {
    margin: 0 10px;
    display: flex;
    justify-content: space-between;
    > div {
      width: 172px;
      height: 48px;
      background: #1143a4;
      border-radius: 14px;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
      border: 1px solid #1143a4;
      display: flex;
      justify-content: center;
      align-items: center;
      &.cancel {
        border: 1px solid #1143a4;
        color: #1143a4;
        background: #ffffff;
        position: relative;
        width: 88px;
        .tips {
          position: absolute;
          top: -10px;
          right: -8px;
          width: 140px;
          height: 20px;
          background: #ed5949;
          border-radius: 24px 24px 24px 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
          font-weight: bold;
          color: #ffffff;
          line-height: 12px;
          transform: scale(0.9);
        }
      }
    }
  }
}

.defer-detail {
  padding-bottom: 100px;
  padding-top: 30px;

  .defer-head {
    margin: 20px;
    p {
      margin-bottom: 0;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      line-height: 25px;
      word-break: break-word;
      &:first-child {
        margin-bottom: 10px;
        font-size: 20px;
        font-weight: 900;
        color: #333333;
        line-height: 26px;
      }
    }
  }

  .actions {
    position: fixed;
    padding: 10px 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    .btns {
      display: flex;
      justify-content: space-between;
      button {
        flex: 1;
      }
    }
  }

  .order-info {
    background: #fff;
    padding: 20px;
    background: #ffffff;
    border-radius: 14px;
    border: 1px solid #cccccc;
    margin: 20px;
    margin-top: 0;

    .period {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      div {
        display: flex;
        align-items: flex-end;
        .value {
          margin-left: 4px;
          margin-right: 0px;
          font-size: 24px;
          font-weight: bold;
          color: #fe5404;
          line-height: 24px;
        }
        .icon {
          margin-top: -4px;
        }
      }

      .value {
        font-size: 20px;
        font-weight: 900;
        color: #333333;
        line-height: 24px;
        margin-right: 5px;
      }
    }

    > div {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #000;
      line-height: 18px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .desc {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    margin: 20px;
    word-break: break-word;
  }
  .step {
    padding: 0px 20px 20px;
    background: #fff;
    &-item {
      display: flex;
      .step-wrapper {
        flex-grow: 1;
      }
      .step-line {
        position: relative;
        width: 10px;
        height: 10px;
        background: #1143a4;
        margin-right: 7px;
        border-radius: 100%;
        margin-top: 6px;
      }
      .head {
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
      }
    }
    .status {
      font-size: 20px;
      font-weight: 900;
      color: #ff1412;
      line-height: 24px;
      margin-bottom: 30px;
      .step-line {
        background: #e6ebf5;
        &::after {
          position: absolute;
          content: ' ';
          width: 2px;
          height: 50px;
          background: #e6ebf5;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
