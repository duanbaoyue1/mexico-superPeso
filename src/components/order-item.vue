<template>
  <div class="order-item">
    <div class="status" :class="'status-' + order.orderStatus">{{ statusText }}</div>
    <div class="info">
      <img :src="order.productIconImageUrl" />
      <div class="name">
        <div class="product">{{ order.productName }}</div>
        <div class="info-item">{{ dateText }} : {{ dateValue }}</div>
        <div class="info-item">
          {{ amountText }} :
          <span class="number">
            <span class="fs-12">$</span>
            {{ amountValue }}
          </span>
        </div>
      </div>
    </div>
    <div class="action">
      <button class="action-btn" :class="'action-btn-' + order.orderStatus" @click="goDetail">{{ order.orderStatusStr }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['order'],

  computed: {
    amountValue() {
      if (this.order.orderStatus == 80 || this.order.orderStatus == 90) {
        return this.order.repaymentAmount;
      } else {
        return this.order.approvalAmount;
      }
    },

    amountText() {
      if (this.order.orderStatus == 80 || this.order.orderStatus == 90) {
        return `Importe por reembolsar`;
      } else {
        return `Importe de préstamo`;
      }
    },
    dateValue() {
      if (this.order.orderStatus == 80 || this.order.orderStatus == 90 || this.orderStatus == 100 || this.orderStatus == 101) {
        return this.order.repaymentTime;
      } else {
        return this.order.applyTime;
      }
    },
    dateText() {
      if (this.order.orderStatus == 80 || this.order.orderStatus == 90 || this.orderStatus == 100 || this.orderStatus == 101) {
        return `Fecha de vencimiento`;
      } else {
        return `Fecha de aplicación`;
      }
    },
    statusText() {
      switch (this.order.orderStatus) {
        case 10:
          return 'Pendiente de aplicar';
        case 20:
          return 'Revisand';
        case 21:
          return 'Evaluando';
        case 30:
          return 'Aprobado';
        case 40:
          return 'Rechazad';
        case 70:
          return 'Desembolsand';
        case 80:
          return 'Reembolsando';
        case 90:
          return 'Atrasado';
        case 100:
          return 'Completado';
        case 101:
          return 'Completado';
        case 110:
          return 'Fracaso';
        default:
          return 'Evaluando';
      }
    },
  },

  methods: {
    goFillUtr() {
      this.innerJump('utr', { orderId: this.order.orderNo, type: 'repay' });
    },
    goDetail() {
      if (this.order.orderStatus == 10 || this.order.orderStatus == 100 || this.order.orderStatus == 101) {
        this.goHome();
      } else {
        this.innerJump('order-detail', { orderId: this.order.orderNo });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-item {
  width: 343px;
  background: #ffffff;
  border-radius: 16px;
  margin: 0 auto;
  padding: 16px 16px 14px;
  box-sizing: border-box;
  position: relative;
  border: 1px solid #eee;
  .action {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-btn {
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 500;
      color: #ffffff;
      line-height: 18px;
      background: #ffbc41;
      border-radius: 16px;
      border: none;
      width: 311px;
      height: 32px;
      background: #04ca1c;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;

      &-10 {
        background: #ffbc41;
      }
      &-20,
      &-21,
      &-30 {
        background: #f125a8;
      }
      &-40 {
        background: #ff1412;
      }
      &-70 {
        background: #3e56fe;
      }
      &-80,
      &-90 {
        background: #f15a25;
      }
      &-100,
      &-101,
      &-110 {
        background: #04ca1c;
      }
    }
  }
  .status {
    position: absolute;
    right: 14px;
    top: 14px;
    font-size: 10px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 500;
    color: #ffbc41;
    line-height: 12px;
    transform: scale(0.9);
    padding: 4px 12px;
    border-radius: 12px;
    border: 1px solid #ffbc41;

    &-10 {
      border-color: #ffbc41;
      color: #ffbc41;
    }
    &-20,
    &-21,
    &-30 {
      border-color: #f125a8;
      color: #f125a8;
    }
    &-40 {
      border-color: #ff1412;
      color: #ff1412;
    }
    &-70 {
      border-color: #3e56fe;
      color: #3e56fe;
    }
    &-80,
    &-90 {
      border-color: #f15a25;
      color: #f15a25;
    }
    &-100,
    &-101,
    &-110 {
      border-color: #04ca1c;
      color: #04ca1c;
    }
  }

  .info {
    display: flex;
    align-items: flex-start;
    padding-bottom: 16px;
    flex-grow: 1;
    img {
      width: 40px;
      height: 40px;
      display: block;
      margin-right: 16px;
    }
    .name {
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      flex-grow: 1;

      .info-item {
        margin-top: 8px;
        font-size: 10px;
        color: #999999;
        display: flex;
        justify-content: space-between;
        .number {
          font-size: 16px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #ff4b3f;
          line-height: 18px;
        }
      }
      .product {
        font-size: 14px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #000000;
        line-height: 20px;
      }

      .label {
        font-size: 10px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
        margin-right: 8px;
      }
      > div {
        &:first-child {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
