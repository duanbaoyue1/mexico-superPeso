<template>
  <div class="order-detail" v-show="loadinged">
    <div class="step" :class="{ 'show-date': showDate }">
      <div class="step-item status" :class="'order_' + detail.orderStatus">
        <div class="step-line"></div>
        <div class="step-wrapper">{{ orderStatusText }}</div>
      </div>
      <div class="step-item">
        <div class="step-line"></div>
        <div class="step-wrapper">
          <div>
            <div class="head">
              <span>Application Date</span>
              <span>{{ detail.applyTime }}</span>
            </div>
            <div class="desc">
              <span>Product</span>
              <span>{{ detail.productName }}</span>
            </div>
            <div class="desc">
              <span>Lending Company</span>
              <span>{{ detail.companyName }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="step-item date" v-if="showDate">
        <div class="step-line"></div>
        <div class="step-wrapper head">
          <span>Due Date</span>
          <span>{{ detail.actualRepaymentTime || detail.expectedRepaymentTime }}</span>
        </div>
      </div>
    </div>

    <div class="order-info">
      <div class="flex-between">
        <span>Disbursal Bank</span>
        <span>{{ detail.bankCardName }}</span>
      </div>
      <div class="flex-between">
        <span>Account No.</span>
        <span>{{ detail.bankCardNo }}</span>
      </div>
      <div class="flex-between">
        <span>Loan ID</span>
        <span>{{ detail.orderNo }}</span>
      </div>
    </div>

    <div class="order-more">
      <div class="flex-between">
        <span>Loan Amount</span>
        <span class="font-bold color-000">
          ₹
          <span>{{ detail.approvalAmount }}</span>
        </span>
      </div>
      <div class="flex-between" v-if="detail.orderStatus >= 80">
        <span>Loan agreement</span>
        <div class="color-blue" @click="checkAgreement">
          check
          <m-icon class="icon" type="blue-right" :width="8" :height="12" />
        </div>
      </div>
      <div class="flex-between" v-if="detail.orderStatus >= 80">
        <span>Received</span>
        <span class="font-bold color-blue">
          ₹
          <span>{{ detail.actualAmount }}</span>
        </span>
      </div>
      <div class="flex-between" v-if="detail.penaltyInterest > 0">
        <span>Overdue fee</span>
        <span class="font-bold color-blue">
          ₹
          <span>{{ detail.penaltyInterest }}</span>
        </span>
      </div>
      <div class="flex-between" v-if="detail.orderStatus >= 80">
        <span>Repayment</span>
        <span class="font-bold color-orange align-end" style="line-height: 26px">
          ₹
          <span class="fs-24">{{ detail.estimatedRepaymentAmount }}</span>
        </span>
      </div>
      <div class="flex-between" v-if="detail.orderStatus >= 80" @click="goDeferHis">
        <span>History of deferment</span>
        <div class="color-blue">
          {{ deferTimes }} times
          <m-icon class="icon" type="blue-right" :width="8" :height="12" />
        </div>
      </div>
    </div>

    <div class="modal" v-if="showPaymentTips">
      <div class="modal-content payment-success-container">
        <div class="icon">
          <m-icon type="message/utr" :width="50" :height="50" />
        </div>
        <div class="content">
          When payment is completed,
          <br />
          remember to
          <a @click="goFillUtr">fill in the UTR</a>
          in this app.
        </div>
        <div class="action">
          <div class="confirm" @click="repay">Repay</div>
          <div class="cancel" @click="goTutorial">
            View tutorial
            <div class="tips">Must view before repay</div>
          </div>
        </div>
        <div class="policy" @click="choosed = !choosed" v-if="showAuto">
          <m-icon class="icon-i" :type="choosed ? 'radio-choosed' : 'radio-unchoose'" :width="14" :height="14" />
          <span>To reduce unnecessary operations, re-loan is automatically initiated after successful repayment, and significantly increased your loan limit.</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <div class="btns" v-if="detail.orderStatus == 100 || detail.orderStatus == 101 || detail.orderStatus == 40 || detail.orderStatus == 80 || detail.orderStatus == 90">
        <button class="btn-default" v-if="detail.orderStatus == 100 || detail.orderStatus == 101 || detail.orderStatus == 40" @click="goHome">More Loan Products</button>
        <template v-else-if="detail.orderStatus == 80 || detail.orderStatus == 90">
          <button class="btn-line" @click="applyDefer">Apply deferment</button>
          <button class="btn-default" @click="showPaymentTips = true">Repay Now</button>
        </template>
      </div>
      <div class="help-center" @click="goHelpCenter">Help Center?</div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    showDate() {
      return this.detail.orderStatus == 80 || this.detail.orderStatus == 90 || this.detail.orderStatus == 30 || this.detail.orderStatus == 70 || this.detail.orderStatus == 100 || this.detail.orderStatus == 101;
    },
    orderStatusText() {
      switch (this.detail.orderStatus) {
        case 20:
          return 'Reviewing';
        case 21:
          return 'Reviewing';
        case 30:
          return 'Disbursing';
        case 40:
          return 'Rejected';
        case 70:
          return 'Disbursing';
        case 80:
          return 'Pending Repayment';
        case 90:
          return 'Overdue';
        case 100:
          return 'Repayment Successful';
        case 101:
          return 'Repayment Successful';
        default:
          return 'Reviewing';
      }
    },
  },
  data() {
    // /**
    //  * 创建
    //  */
    // public final static int CREATE = 10;

    // /**
    //  * 审核中
    //  */
    // public final static int EXAMINE_WAIT = 20;

    // /**
    //  * 审核中
    //  */
    // public final static int AUTO_REPEAT_EXAMINE_WAIT = 21;

    // /**
    //  * 审核通过
    //  */
    // public final static int EXAMINE_PASS = 30;

    // /**
    //  * 审核拒绝
    //  */
    // public final static int EXAMINE_FAIL = 40;

    // /**
    //  * 等待放款
    //  */
    // public final static int WAIT_PAY = 70;

    // /**
    //  * 在途
    //  */
    // public final static int WAY = 80;

    // /**
    //  * 逾期
    //  */
    // public final static int DUE = 90;

    // /**
    //  * 结清
    //  */
    // public final static int COMPLETE = 100;

    // /**
    //  * 结清-有逾期
    //  */
    // public final static int DUE_COMPLETE = 101;

    // /**
    //  * 废弃订单
    //  */
    // public final static int ABANDONED = 110;

    return {
      loadinged: false,
      orderId: this.$route.query.orderId,
      choosed: true, // 是否勾选复贷
      showAuto: false, // 是否显示复贷
      showPaymentTips: false,
      detail: '',
      deferTimes: 0,
      orderUrl: '',
    };
  },

  mounted() {
    this.getDetail();
    this.getDeferTimes();
    this.queryOrderReloan();
  },

  methods: {
    async queryOrderReloan() {
      try {
        let data = await this.$http.post(`/zihai/ilktvuawcybpptzhytvwt`, { orderId: this.orderId });
        this.showAuto = data.data;
      } catch (error) {}
    },

    async repay() {
      // 更新复贷
      try {
        await this.$http.post(`/zihai/cmhlovawcybpptzhytvwtqoghpl`, { orderId: this.orderId, isOpen: this.choosed ? 1 : 0 });
      } catch (error) {}

      this.innerJump('utr', { nextUrl: this.orderUrl.repaymentUrl, orderId: this.orderId, type: 'repay' });
    },
    applyDefer() {
      this.innerJump('defer-detail', { orderId: this.orderId });
    },
    checkAgreement() {
      location.href = `${this.appGlobal.apiPrefix}/api/h5/contract?orderNo=${this.orderId}`;
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl;
    },
    goDeferHis() {
      this.innerJump('defer-history', { orderId: this.orderId });
    },
    goFillUtr() {
      this.innerJump('utr', { orderId: this.orderId, type: 'repay' });
    },

    async getDeferTimes() {
      let data = await this.$http.post(`/uzeaulazu/kgwhjiykpp`, {
        id: this.orderId,
      });
      this.deferTimes = data.data.num;
    },

    async getDetail() {
      try {
        let data2 = await this.$http.post(`/zihai/yvelgho`, {
          orderId: this.orderId,
        });
        let data1 = await this.$http.post(`/zihai/yvelghl`, {
          orderId: this.orderId,
        });

        this.detail = { ...data1.data, ...data2.data };
        console.log('order detail', this.detail);
        console.log('order status', this.detail.orderStatus);
        console.log('this.orderStatuste', this.orderStatusText);
        if (this.orderStatusText == 'Rejected' || this.orderStatusText == 'Repayment Successful' || this.orderStatusText == 'Pending Repayment' || this.orderStatusText == 'Overdue') {
          this.orderUrl = await this.getOrderRelateUrl(this.orderId);
        }
      } catch (error) {
      } finally {
        this.loadinged = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-success-container {
  width: 320px;
  padding: 50px 20px 20px;
  .policy {
    display: flex;
    align-items: flex-start;
    margin-top: 30px;
    font-size: 12px;
    font-weight: 400;
    color: #000601;
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
    bottom: -54px;
    left: 50%;
    transform: translateX(-50%);
  }
  .content {
    margin-bottom: 40px;
    font-size: 16px;
    font-weight: 400;
    color: #000601;
    a {
      color: #1143a4;
      text-decoration: underline;
    }
  }
  .action {
    > div {
      width: 280px;
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
        margin-top: 20px;
        background: #ffffff;
        position: relative;
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

.order-detail {
  padding-bottom: 100px;

  .actions {
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;

    .btns {
      padding-top: 10px;
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
      button {
        // width: 100%;
        flex: 1;
        &:nth-child(2) {
          margin-left: 10px;
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
  .order-more {
    background: #fff;
    padding: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    > div {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      > * {
        display: flex;
        align-items: center;
        .icon {
          margin-left: 2px;
        }
      }
    }
  }
  .order-info {
    background: #fff;
    border-bottom: 6px solid #f4f4f4;
    padding: 20px;
    > div {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .step {
    padding: 30px 20px 20px;
    background: #fff;
    border-bottom: 6px solid #f4f4f4;
    &.show-date {
      .step-line {
        &::after {
          height: 143px !important;
        }
      }
    }
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
      .desc {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          &:first-child {
            padding-right: 10px;
            flex-shrink: 0;
          }
        }
      }
    }
    .date {
      margin-top: 20px;
    }
    .status {
      font-size: 20px;
      font-weight: 900;
      color: #ff1412;
      line-height: 24px;
      margin-bottom: 30px;
      .step-line {
        background: #ff1412;
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

      &.order_20,
      &.order_21,
      &.order_30,
      &.order_70,
      &.order_80 {
        .step-line {
          background: #febc1d;
        }
        color: #febc1d;
      }
      &.order_40,
      &.order_90 {
        .step-line {
          background: #ff1412;
        }
        color: #ff1412;
      }
      &.order_100,
      &.order_101 {
        .step-line {
          background: #04ca1c;
        }
        color: #04ca1c;
      }
    }
  }
}
</style>
