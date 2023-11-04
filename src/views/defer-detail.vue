<template>
  <div class="defer-detail content-area" v-show="loaded">
    <div class="defer-head">
      <p>Retraso de {{ detail.extendedTerm }} días</p>
      <p>Sólo necesita pagar ${{ detail.amount }} pesos hoy y luego puedes aplazar el pago durante {{ detail.extendedTerm }} días.</p>
    </div>

    <div class="step">
      <div class="step-item">
        <div class="text">Fecha de aplicación</div>
        <div class="date">{{ detail.startTime }}</div>
      </div>
      <div class="step-item">
        <div class="text">Fecha de vencimiento</div>
        <div class="date">{{ detail.updatedDueDate }}</div>
      </div>
    </div>

    <div class="order-info">
      <div class="period" @click="showMoreInfo = !showMoreInfo">
        <span class="fs-16 font-bold">Costes para reembolso diferido</span>
        <div>
          <m-icon class="icon" :class="{ open: showMoreInfo }" type="superpeso/向右" :width="16" :height="16" />
        </div>
      </div>
      <div class="order-info-more" v-show="showMoreInfo">
        <div class="fee">
          <div class="flex-between">
            <span>Tasa de interés</span>
            <span>$ {{ detail.interest }}</span>
          </div>
          <div class="flex-between">
            <span>Tarifa de servicio</span>
            <span>$ {{ detail.defermentFee }}</span>
          </div>
          <div class="flex-between">
            <span>Tarifa vencida</span>
            <span>$ {{ detail.overDueFee }}</span>
          </div>
        </div>

        <div class="flex-between">
          <span>Monto reembolsado</span>
          <span>$ {{ detail.receiveAmount }}</span>
        </div>

        <div class="flex-between">
          <span>monto de reembolso pendiente</span>
          <span>$ {{ detail.repaidAmount }}</span>
        </div>
        <div class="history" @click="goDeferPayHis" v-if="deferHis.length > 0">Ver el historial de pagos de reembolsos >></div>
      </div>
    </div>

    <div class="desc">Nota: Después de pagar los costes para reembolso diferido, la fecha de pago del reembolso se prorrogará 7 días, tras lo cual tendrá que reembolsar el principal + los nuevos intereses + la tasa de servicio</div>

    <div class="actions">
      <div class="btns">
        <button class="btn-default" @click="defer">Reembolso diferido</button>
      </div>
      <!-- <div class="help-center" @click="goHelpCenter">Help Center?</div> -->
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMoreInfo: false, // 是否显示更多信息
      orderId: this.$route.query.orderId,
      loaded: false,
      showPaymentTips: false,
      detail: '',
      orderUrl: '',
      deferHis: [],
      infoDetail: {},
    };
  },
  async mounted() {
    this.setEventTrackStartTime();

    this.setTabBar({
      show: true,
      transparent: true,
      fixed: true,
      color: 'white',
      title: 'Detalles del pedido',
      backCallback: () => {
        this.sendEventTrackData({ page: 'payment' });
        this.goAppBack();
      },
    });

    document.body.style.backgroundColor = '#f9f9f9';
    this.getDetail();
    // this.orderUrl = await this.getOrderRelateUrl(this.orderId);
  },
  beforeDestroy() {
    this.setTabBar({
      color: 'black',
    });
  },
  methods: {
    async getDeferHistory() {
      let res = await this.$http.post('/api/extension/repaymentHistory', {
        id: this.detail.extensionOrderBillId,
      });
      this.deferHis = res.data.list || [];
    },
    async selectBank(payType) {
      this.showPaymentTips = false;
      let title = payType == 'OnLine' ? 'Reembolso en línea' : 'Reembolso en tienda';
      // 更新埋点触发时间
      this.setEventTrackStartTime();
      this.sendEventTrackData({ leaveBy: 1, page: 'payment' });

      this.openWebview(`${this.appGlobal.apiHost}/api/extension/prepay?id=${this.detail.orderBillId}&payType=${payType}`, 0, title);
    },
    goDeferPayHis() {
      this.innerJump('pay-history', { id: this.detail.extensionOrderBillId, type: 'bill', productId: this.infoDetail.productId, orderStatus: this.infoDetail.orderStatus });
    },
    goFillUtr() {
      this.innerJump('utr', { orderId: this.orderId, type: 'defer' });
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl;
    },
    defer() {
      this.showPaymentTips = true;
    },
    async getDetail() {
      console.log('this.orderId', this.orderId);
      try {
        let data = await this.$http.post('/api/extension/detail', {
          id: this.orderId,
        });
        this.detail = data.data;
        this.getDeferHistory();
        let res = await this.$http.post(`/api/order/detail`, {
          orderId: this.orderId,
        });
        this.infoDetail = res.data;
        this.updateTrackerData({ key: 'productId', value: res.data.productId });
        this.updateTrackerData({ key: 'status', value: this.ORDER_STATUS_LIST[res.data.orderStatus] });
      } catch (error) {
        console.log(error);
        console.log('222222');
      } finally {
        this.loaded = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-success-container {
  width: 327px;
  border-radius: 12px;
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
.defer-detail {
  padding-bottom: 120px;
  background-image: url(../assets/img/superpeso/展期背景.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 232px;
  background-color: #f9f9f9;
  box-sizing: border-box;

  .defer-head {
    padding: 24px;
    padding-bottom: 16px;
    color: #333;
    text-align: center;
    p {
      margin-bottom: 0;
      font-size: 11px;
      font-weight: 400;
      line-height: 16px;
      word-break: break-word;
      margin-top: 0;
      &:first-child {
        max-width: 100%;
        margin-bottom: 7px;
        font-size: 16px;
        font-weight: 900;
        line-height: 20px;
      }
    }
  }

  .actions {
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    left: 0;
    right: 0;

    .btns {
      padding-top: 10px;
      padding-left: 16px;
      padding-right: 16px;
      display: flex;
      justify-content: space-between;
      .btn-default {
        background: #416cef;
        border-radius: 8px;
        height: 48px;
        border: none;
        color: #ffffff;
        font-weight: bold;
        font-size: 18px;
      }
      button {
        flex: 1;
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

  .order-info {
    background: #fff;
    padding: 24px 16px;
    background: #ffffff;
    border-radius: 8px;
    margin: 16px;
    margin-bottom: 16px;
    margin-top: 0;
    .history {
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 500;
      color: #ff4b3f;
      line-height: 24px;
      margin-top: 8px;
      text-align: right;
    }

    .period {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .dolar {
        color: #eaa411;
      }

      div {
        display: flex;
        align-items: center;
        .value {
          margin-left: 4px;
          margin-right: 0px;
          font-size: 24px;
          font-weight: bold;
          color: #eaa411;
          line-height: 24px;
        }
        .icon {
          margin-left: 8px;
          transition: all 0.3s;
          &.open {
            transform: rotate(90deg);
          }
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

    .order-info-more {
      margin-top: 24px;
      .fee {
        background: #ecfcf6;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
      }
    }

    .flex-between {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 400;
      color: #333;
      line-height: 18px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .desc {
    font-size: 14px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    margin-left: 16px;
    margin-right: 16px;
  }
  .step {
    width: 343px;
    background: #ffffff;
    border-radius: 8px;
    padding: 24px 16px;
    margin: 0 auto;
    box-sizing: border-box;
    padding-bottom: 0;
    position: relative;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      margin-bottom: 16px;
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
      img {
        width: 10px;
        height: 10px;
      }
      &:last-child {
        border-bottom: 2px solid #eee;
        padding-bottom: 16px;
        margin-bottom: 0;
      }
    }
  }
}
</style>
