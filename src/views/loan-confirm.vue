<template>
  <div class="loan-confirm content-area">
    <div class="loan-money">
      <div>
        <div>Monto del préstamo</div>
        <div>
          <span class="dollar">$</span>
          {{ orderInfo.estimatedRepaymentAmount }}
        </div>
      </div>
    </div>

    <div class="loan-info">
      <div class="item">
        <span>Monto total de recibo</span>
        <span>${{ orderInfo.actualAmount }}</span>
      </div>

      <div class="item border">
        <span>Monto total de reembolso</span>
        <span class="color-000">${{ orderInfo.approvalAmount }}</span>
      </div>
      <div class="item">
        <span>Fecha de aplicación</span>
        <span>{{ orderInfo.applyTime }}</span>
      </div>
      <div class="item border">
        <span>Fecha de reembolso</span>
        <span>{{ orderInfo.expectedRepaymentTime }}</span>
      </div>

      <div class="item">
        <span>Método de recibo</span>
        <span>{{ orderInfo.receiveWay == 0 ? 'Tarjeta de débito' : 'Clabe' }}</span>
      </div>
      <div class="item">
        <span>Banco de recibo</span>
        <span>{{ orderInfo.bankCardName }}</span>
      </div>
      <div class="item">
        <span>Número de cuenta bancaria de recibo</span>
        <span>{{ orderInfo.bankCardNo }}</span>
      </div>
    </div>

    <div class="loan-tips">
      Pago Directo
      <br />
      Usted recibirá el monto después de que su préstamo sea aprobado.
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Confirme el préstamo</button>
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
  created() {
    this.setTabBar({
      show: true,
      transparent: true,
      fixed: true,
      black: false,
      color: 'white',
      title: 'Confirmación del préstamo',
    });
  },
  data() {
    return {
      choosed: true,
      canSubmit: true,
      orderInfo: '',
      orderId: this.$route.query.orderId,
      saving: false,
    };
  },
  mounted() {
    document.body.style.backgroundColor = '#f9f9f9';
    this.eventTracker('confirm_access');
    this.getOrderInfo();
  },
  beforeDestroy() {
    this.setTabBar({
      color: 'black',
    });
  },
  methods: {
    checkAgreement() {
      this.openWebview(`${this.appGlobal.apiHost}/api/h5/contract?orderNo=${this.orderId}`);
    },
    togglePolicy() {
      this.choosed = !this.choosed;
    },
    async getOrderInfo() {
      try {
        this.showLoading();
        let data = await this.$http.post('/api/order/applyConfirmation', { orderId: this.orderId });
        this.orderInfo = data.data;
      } catch (error) {
      } finally {
        this.hideLoading();
      }
    },

    async submit() {
      this.eventTracker('confirm_submit');
      this.showLoading();
      let syncRes;
      try {
        // 1. 先同步数据
        try {
          syncRes = await this.judgeCanApply();
        } catch (error) {
          this.hideLoading();
          this.$toast('Carga fallida, inténtelo más tarde');
          return;
        }
        if (syncRes.success) {
          // 2. 真正的提交动作
          await this.$http.post(`/api/order/apply`, { orderId: this.orderId });
          // 成功或者失败的跳转
          this.innerJump('loan-success-multi', { orderId: this.orderId, single: true, systemTime: this.getLocalSystemTimeStamp() }, true);
        }
      } catch (error) {
        this.$toast(error.message || 'Carga fallida, inténtelo más tarde');
        setTimeout(() => {
          this.innerJump('loan-fail', { orderId: this.orderId }, true);
        }, 1000);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loan-confirm {
  padding: 16px 16px;
  padding-bottom: 90px;
  background-image: url(../assets/img/superpeso/贷款确认页.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 280px;
  background-color: #f9f9f9;

  .loan-money {
    width: 100%;
    height: 90px;
    background: #ffffff;
    border-radius: 14px;
    margin-top: 14px;
    box-sizing: border-box;
    padding: 16px;
    margin-bottom: 16px;
    font-size: 32px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #333333;
    line-height: 38px;
    text-align: center;
    .dollar {
      font-size: 14px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 20px;
    }
    div {
      div {
        &:first-child {
          font-size: 12px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
        }
      }
    }
  }
  .loan-tips {
    font-size: 14px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    margin-top: 24px;
  }
  .loan-info {
    padding: 24px 16px;
    padding-bottom: 8px;
    border-radius: 8px;
    background: #fff;
    .item {
      padding-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      &.border {
        border-bottom: 2px solid #eee;
        margin-bottom: 16px;
      }
      &.bank {
        flex-direction: column;
        align-items: baseline;
        span {
          margin-bottom: 8px;
        }
      }
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
          margin-right: 20px;
        }
        &:last-child {
          flex-shrink: 0;
        }
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f9f9f9;
  }
}
</style>
