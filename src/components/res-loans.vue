<template>
  <div class="res-loans-model" v-if="this.loans.length">
    <div v-for="(loan, index) in loans" :key="loan.id" class="loan-item">
      <img class="icon" :src="loan.productIconImageUrl" />
      <div class="info">
        <div class="name">{{ loan.productName }}</div>
        <div class="value">
          Importe de préstamo
          <span>
            <span class="dollar">$</span>
            {{ loan.approvalAmount }}
          </span>
        </div>

        <div class="action" :class="'order_' + loan.orderStatus" @click="goDetail(loan.orderNo)">{{ loan.orderStatusStr }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['systemTime'],

  computed: {
    orderStatusText() {
      return status => {
        switch (status) {
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
      };
    },
  },

  data() {
    return {
      loans: [],
    };
  },

  created() {
    this.getRes();
  },

  methods: {
    async getRes() {
      try {
        let res = await this.$http.post(`/api/order/applyResultOrderList`, {
          startApplyTime: this.systemTime,
        });
        this.loans = res.data.list || [];
      } catch (e) {}
    },

    goDetail(orderNo) {
      this.innerJump('order-detail', { orderId: orderNo });
    },
  },
};
</script>

<style lang="scss" scoped>
.res-loans-model {
  margin-top: 30px;
  .cc {
    width: 280px;
    margin: 0 auto;
    display: block;
    margin-bottom: 20px;
  }
  .res-total {
    width: 320px;
    background: #d8e4fb;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 16px 0px;
    margin: 0 auto;
    text-align: center;
    font-size: 12px;
    font-weight: 900;
    color: #333333;
    line-height: 14px;
    position: relative;
    span {
      font-size: 18px;
      color: #1143a4;
      font-weight: 900;
    }
    .tips {
      font-size: 10px;
      font-weight: 400;
      color: #999999;
      line-height: 12px;
      margin-top: 9px;
    }

    &::after {
      position: absolute;
      content: ' ';
      border-style: solid;
      border-width: 10px;
      border-color: transparent transparent #d8e4fb transparent;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .loan-item {
    width: 343px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 14px;
    border: 1px solid #eee;
    padding: 16px;
    height: 72px;
    box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 8px;
    position: relative;
    display: flex;
    align-items: center;
    .info {
      flex-grow: 1;
      .name {
        font-size: 14px;
        color: #333333;
        line-height: 20px;
        margin-bottom: 8px;
        font-weight: 900;
      }
      .value {
        font-size: 10px;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: 16px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #ff4b3f;
          line-height: 18px;
        }
        .dollar {
          font-size: 10px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #ff4b3f;
          line-height: 16px;
        }
      }
    }
    .icon {
      width: 40px;
      height: 40px;
      display: block;
      margin-right: 10px;
    }

    .action {
      position: absolute;
      right: 16px;
      top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 900;
      color: #ffffff;
      min-width: 80px;
      box-sizing: border-box;
      padding: 0 10px;
      height: 20px;
      background: #f125a8;
      border-radius: 14px;

      &.order_10 {
        background: #ffbc41;
      }
      &.order_20,
      &.order_21,
      &.order_30 {
        background: #f125a8;
      }
      &.order_40 {
        background: #ff1412;
      }
      &.order_70 {
        background: #3e56fe;
      }
      &.order_80,
      &.order_90 {
        background: #f15a25;
      }
      &.order_100,
      &.order_101 {
        background: #04ca1c;
      }
    }
  }
}
</style>
