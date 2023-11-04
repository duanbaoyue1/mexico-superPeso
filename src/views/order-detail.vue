<template>
  <div class="order-detail content-area" :class="'order_' + detail.orderStatus">
    <div class="status-text">
      <m-icon type="superpeso/订单等待" v-if="detail.orderStatus == 70 || detail.orderStatus == 80 || detail.orderStatus == 20 || detail.orderStatus == 21" :width="24" :height="24" />
      <m-icon type="superpeso/订单完成" v-else-if="detail.orderStatus == 30 || detail.orderStatus == 100 || detail.orderStatus == 101" :width="24" :height="24" />
      <m-icon type="superpeso/逾期" v-else-if="detail.orderStatus == 90" :width="24" :height="24" />
      <m-icon type="superpeso/订单失败" v-else :width="24" :height="24" />
      {{ orderStatusText }}
      <div class="status-desc">{{ orderStatusDesc }}</div>
    </div>

    <div class="order-info-wrapper">
      <div class="order-info" v-if="detail.orderStatus == 80 || detail.orderStatus == 90">
        <div class="flex-between">
          <span>Monto de reembolso</span>
          <span class="fs-18 fw-900 color-red">$ {{ detail.remainingRepaymentAmount }}</span>
        </div>
        <div class="flex-between">
          <span>Fecha de vencimiento</span>
          <span>{{ detail.expectedRepaymentTime || detail.actualRepaymentTime }}</span>
        </div>
      </div>

      <div class="order-info">
        <div class="flex-between">
          <span>ID del préstamo</span>
          <span>{{ detail.orderNo }}</span>
        </div>
        <div class="flex-between">
          <span>Monto del préstamo</span>
          <span>$ {{ detail.approvalAmount }}</span>
        </div>
        <div class="flex-between">
          <span>Monto total de recibo</span>
          <span>$ {{ detail.actualAmount }}</span>
        </div>
      </div>

      <div class="order-info">
        <div class="flex-between">
          <span>Tasa de interés</span>
          <span>$ {{ detail.interest }}</span>
        </div>
        <div class="flex-between">
          <span>Tarifa de servicio</span>
          <span>
            <span>$ {{ detail.incidentalAmount }}</span>
          </span>
        </div>
        <div class="flex-between" v-if="detail.penaltyInterest > 0">
          <span>Tarifa vencida</span>
          <span>$ {{ detail.penaltyInterest }}</span>
        </div>

        <div class="flex-between" v-if="detail.orderStatus != 40 && detail.orderStatus != 20 && detail.orderStatus != 21">
          <span>Monto total de reembolso</span>
          <span>$ {{ detail.estimatedRepaymentAmount }}</span>
        </div>
      </div>

      <div class="order-info" v-if="showDate">
        <div class="flex-between">
          <span>Monto reembolsado</span>
          <span>$ {{ detail.actualRepaymentAmount }}</span>
        </div>
        <div class="flex-between">
          <span>Monto de reembolso pendiente</span>
          <span>$ {{ detail.remainingRepaymentAmount }}</span>
        </div>
      </div>

      <div class="order-info" v-if="detail.repayRecord && detail.repayRecord.length > 0">
        <div class="flex-between" @click="goPayHis">
          <span class="color-333">Historial de transacciones</span>
          <div class="color-blue font-bold">
            <m-icon class="icon" type="right" :width="8" :height="12" />
          </div>
        </div>
      </div>

      <div class="order-info" v-if="deferTimes > 0 || (showDate && detail.showExtension == 1)">
        <div class="flex-between" @click="goDeferHis">
          <span class="color-333">Historial de reembolso diferido</span>
          <div>
            <span class="veces">{{ deferTimes }} veces</span>
            <m-icon class="icon" type="right" :width="8" :height="12" />
          </div>
        </div>
      </div>

      <div class="order-info" v-if="(detail.orderStatus >= 80 || detail.orderStatus == 30 || detail.orderStatus == 70) && detail.bankCardNo">
        <div class="flex-between">
          <span>Banco de recibo</span>
          <span>{{ detail.bankCardName }}</span>
        </div>
        <div class="flex-between">
          <span>Método de recibo</span>
          <span>{{ detail.receiveWay == 0 ? 'Tarjeta de débito' : 'Clabe' }}</span>
        </div>
        <div class="flex-between bank-no">
          <span>Número de cuenta bancaria de recibo</span>
          <span>{{ detail.bankCardNo }}</span>
        </div>
      </div>

      <div class="order-info">
        <div class="flex-between">
          <span>Fecha de aplicación</span>
          <span class="fw-500">{{ detail.applyTime }}</span>
        </div>
        <div class="flex-between" v-if="showDate && detail.loanTime">
          <span>Fecha de recibo</span>
          <span class="fw-500">{{ detail.loanTime }}</span>
        </div>
        <div class="flex-between" v-if="detail.orderStatus == 100 || detail.orderStatus == 101">
          <span>Fecha de reembolso</span>
          <span class="fw-500">{{ detail.actualRepaymentTime || detail.expectedRepaymentTime }}</span>
        </div>
      </div>
    </div>

    <div class="modal" v-if="showPaymentTips">
      <div class="modal-content payment-success-container">
        <m-icon class="close" type="close" :width="15" :height="15" @click="showPaymentTips = false" />
        <m-icon class="icon" type="superpeso/还款方式" />
        <div class="content">
          <div class="head">Método de reembolso</div>
          <div class="banks">
            <div class="default" @click="selectBank('OnLine')">
              En línea
              <span>Recomendado</span>
            </div>
            <div @click="selectBank('OffLine')">Tienda</div>
          </div>
        </div>
        <div class="policy" v-if="showAuto">
          <m-icon class="icon-i" :type="choosed ? 'hucha/授权页选中' : 'hucha/授权页未选中'" :width="28" :height="14" @click="choosed = !choosed" />
          <span>Para reducir las operaciones innecesarias, el représtamo se iniciará automáticamente después del reembolso exitoso, y aumentará significativamente su límite de préstamo.</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <div class="btns" v-if="detail.orderStatus == 110 || detail.orderStatus == 80 || detail.orderStatus == 90">
        <button class="btn-default" v-if="detail.orderStatus == 110" @click="goCompleteBank">Cambio de cuenta de cobro</button>
        <template v-else-if="detail.orderStatus == 80 || detail.orderStatus == 90">
          <button class="btn-line" @click="applyDefer">Reembolso diferido</button>
          <button class="btn-default" @click="showPaymentTips = true">Ir a reembolsar</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
const COLOR_MAPS = {
  40: 'rgb(255 75 56)',
  110: 'rgb(255 75 56)',
  90: 'rgb(255 75 56)',
  30: 'rgb(51 186 13)',
  100: 'rgb(51 186 13)',
  101: 'rgb(51 186 13)',
};

export default {
  computed: {
    showDate() {
      return this.detail.orderStatus == 80 || this.detail.orderStatus == 90 || this.detail.orderStatus == 100 || this.detail.orderStatus == 101;
    },
    orderStatusText() {
      switch (this.detail.orderStatus) {
        case 20:
          return 'Bajo revisión';
        case 21:
          return 'Bajo revisión';
        case 30:
          return 'Aprobado';
        case 40:
          return 'Rechazado';
        case 70:
          return 'Pagando';
        case 80:
          return 'En reembolso';
        case 90:
          return 'Atrasado';
        case 100:
          return 'Completado';
        case 101:
          return 'Completado';
        case 110:
          return 'Transferencia fallida';
        default:
          return '';
      }
    },
    orderStatusDesc() {
      switch (this.detail.orderStatus) {
        case 20:
          return 'En revisión, espere pacientemente';
        case 21:
          return 'En revisión, espere pacientemente';
        case 30:
          return 'El pedido ya está aprobado. Por favor confirme lo antes posible';
        case 40:
          return 'El pedido ya está cancelada';
        case 70:
          return 'Está pagando, por favor espere pacientemente';
        case 80:
          return 'Ha recibido con éxito el dinero';
        case 90:
          return 'Está atrasado en reembolsar, por favor reembolse lo antes posible';
        case 100:
          return 'Ha pagado con éxito';
        case 101:
          return 'Ha pagado con éxito';
        case 110:
          return 'Pago fallido, vuelva a aplicar y vincule la cuenta de pago correcta';
        default:
          return '';
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
      orderId: this.$route.query.orderId,
      choosed: false, // 是否勾选复贷
      showAuto: false, // 是否显示复贷
      showPaymentTips: false,
      detail: '',
      deferTimes: 0,
      orderUrl: '',
    };
  },

  mounted() {
    this.setEventTrackStartTime();

    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      color: 'white',
      title: 'Detalles del pedido',
      backgroundColor: 'rgb(255 182 53)',
      backCallback: () => {
        this.sendEventTrackData({});
        this.goAppBack();
      },
    });
    this.getDetail();
    this.getDeferTimes();
    this.queryOrderReloan();
    document.body.style.backgroundColor = '#f9f9f9';
  },

  beforeDestroy() {
    this.setTabBar({
      color: 'black',
      backgroundColor: '#fff',
    });
  },

  methods: {
    goCompleteBank() {
      this.innerJump('complete-bank', { orderId: this.orderId, from: 'mine' });
    },
    async queryOrderReloan() {
      try {
        // 判断全局状态
        let data = await this.$http.post(`/api/order/isOpenOrderAutoRepeat`, { orderId: this.orderId });
        this.showAuto = data.data;

        // 查询当前订单是否开启自动复贷
        data = await this.$http.post(`/api/order/getOrderIsOpenOrderAutoRepeat`, { orderId: this.orderId });
        if (data.data != null && typeof data.data != 'undefined') {
          this.choosed = data.data;
        }
      } catch (error) {}
    },

    async selectBank(payType) {
      this.showPaymentTips = false;
      // 更新复贷
      try {
        await this.$http.post(`/api/order/updateOrderAutoRepeatStatus`, { orderId: this.orderId, isOpen: this.choosed ? 1 : 0 });
      } catch (error) {}
      let title = payType == 'OnLine' ? 'Reembolso en línea' : 'Reembolso en tienda';
      // 离开
      this.sendEventTrackData({ leaveBy: 1 });

      // 支付
      this.setEventTrackStartTime();
      this.sendEventTrackData({ leaveBy: 1, page: 'payment' });

      this.openWebview(`${this.appGlobal.apiHost}/api/repayment/prepay?id=${this.detail.orderBillId}&payType=${payType}`, 0, title);
    },

    goPayHis() {
      this.innerJump('pay-history', { id: this.orderId, type: 'order', productId: this.detail.productId, orderStatus: this.detail.orderStatus });
    },

    applyDefer() {
      this.innerJump('defer-detail', { orderId: this.orderId });
    },
    checkAgreement() {
      this.openWebview(`${this.appGlobal.apiHost}/api/h5/contract?orderNo=${this.orderId}`);
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl;
    },
    goDeferHis() {
      this.innerJump('defer-history', { orderId: this.orderId, productId: this.detail.productId, orderStatus: this.detail.orderStatus });
    },
    goFillUtr() {
      this.innerJump('utr', { orderId: this.orderId, type: 'repay' });
    },

    async getDeferTimes() {
      let data = await this.$http.post(`/api/extension/historyNum`, {
        id: this.orderId,
      });
      this.deferTimes = data.data.num;
    },

    async getDetail() {
      this.showLoading();
      try {
        let res = await this.$http.post(`/api/order/detail`, {
          orderId: this.orderId,
        });
        this.detail = res.data;
        this.setTabBar({
          transparent: false,
          backgroundColor: COLOR_MAPS[this.detail.orderStatus] || 'rgb(255 182 53)',
        });
        this.updateTrackerData({ key: 'productId', value: this.detail.productId });
        this.updateTrackerData({ key: 'status', value: this.ORDER_STATUS_LIST[this.detail.orderStatus] });
        if (this.orderStatusText == 'Rejected' || this.orderStatusText == 'Repayment Successful' || this.orderStatusText == 'Pending Repayment' || this.orderStatusText == 'Overdue') {
          this.orderUrl = await this.getOrderRelateUrl(this.orderId);
        }
      } catch (error) {
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-success-container {
  width: 327px;
  border-radius: 12px;

  .policy {
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    font-weight: 400;
    margin: 0px 24px 0;
    color: #000601;
    position: relative;
    span {
      margin-left: 0px;
      transform: scale(0.9);
      margin-top: -10px;
    }
  }

  .icon {
    position: absolute;
    top: -48px;
    left: 50%;
    transform: translateX(-50%);
    background: transparent;
    width: 327px !important;
    height: 96px !important;
  }
  .close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
  }
  .content {
    padding-top: 70px;
    text-align: center;
    padding-bottom: 16px;
    .head {
      font-size: 18px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 24px;
    }
    .banks {
      > div {
        margin: 0 16px;
        padding-top: 36px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        &.default {
          position: relative;
          span {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 96px;
            height: 20px;
            border-radius: 10px 10px 10px 0px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ec4655;
          }
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

.order-detail {
  padding-bottom: 24px;
  background-image: url(../assets/img/superpeso/订单背景1.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 279px;
  background-color: #f9f9f9;
  box-sizing: border-box;
  background-attachment: local;

  &.order_40,
  &.order_110,
  &.order_90 {
    background-image: url(../assets/img/superpeso/订单背景2.png);
  }

  &.order_30,
  &.order_100,
  &.order_101 {
    background-image: url(../assets/img/superpeso/订单背景3.png);
  }
  &.order_110,
  &.order_80,
  &.order_90 {
    padding-bottom: 120px;
  }

  .actions {
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.08);
    .btns {
      padding-top: 16px;
      padding-left: 16px;
      padding-right: 16px;
      display: flex;
      justify-content: space-between;

      .btn-default {
        background: #416cef;
        border-radius: 25px;
        height: 48px;
        color: #ffffff;
        font-weight: bold;
        font-size: 16px;
        border: none;
        border-radius: 8px;
        border: 1px solid #416cef;
      }
      .btn-line {
        border-radius: 25px;
        font-weight: bold;
        font-size: 16px;
        color: #999;
        border-radius: 8px;
        border: 1px solid #999999;
      }
      button {
        // width: 100%;
        flex: 1;
        &:nth-child(2) {
          margin-left: 10px;
        }
      }
    }
  }
  .status-text {
    font-size: 24px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 500;
    color: #ffffff;
    line-height: 24px;
    margin: 16px auto 16px;
    padding: 16px;
    width: 343px;
    text-align: center;
    background: #ffffff;
    border-radius: 8px;
    min-height: 102px;
    color: #2a303c;
    font-size: 16px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 500;
    color: #2a303c;
    line-height: 20px;
    .status-desc {
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 14px;
    }

    img {
      margin: 0 auto 4px;
    }
  }

  .pay-wrapper {
    margin: 16px;
    padding: 16px;
    background: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    .pay-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;
      font-size: 11px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #bcbcbc;
      line-height: 13px;
      > div {
        &:last-child {
          text-align: right;
        }
      }
      .money {
        font-size: 27px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #356dfe;
        line-height: 32px;
      }
      .date {
        font-size: 20px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 500;
        color: #333333;
        line-height: 30px;
      }
    }
    button {
      width: 311px;
      height: 48px;
      background: #c9e9ff;
      border-radius: 22px;
      border: none;
      font-size: 20px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: #0098ff;
      line-height: 24px;
      &.confirm {
        background: linear-gradient(135deg, #1fb2fd 0%, #3767fe 100%);
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
        margin-bottom: 16px;
        color: #fff;
      }
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
  .order-info-wrapper {
    position: relative;
    padding: 24px 16px;
    padding-top: 30px;
    width: 343px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 8px;

    .back {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 359px;
    }
    .order-info {
      margin: 0 auto;
      margin-bottom: 16px;
      border-bottom: 1px solid #eee;
      padding-bottom: 16px;
      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;
      }

      .bank-no {
        flex-direction: column;
        align-items: flex-start;
        span {
          &:last-child {
            margin-left: 0 !important;
            margin-top: 6px;
          }
        }
      }

      > div {
        margin-bottom: 16px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        .veces {
          font-size: 10px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 500;
          color: #ffffff;
          line-height: 12px;
          background: #e73122;
          padding: 6px 8px;
          transform: scale(0.9);
          border-radius: 20px;
          margin-right: 8px;
        }
        div {
          display: flex;
          align-items: center;
        }
        &:last-child {
          margin-bottom: 0;
        }
        > span {
          white-space: nowrap;
          &.color-333 {
            color: #333;
          }
          &:last-child {
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>
