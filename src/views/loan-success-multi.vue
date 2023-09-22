<template>
  <div class="loan multi content-area">
    <div class="loan-tips">
      <m-icon class="icon" type="superpeso/完成" :width="56" :height="56" />
      <div class="title" v-if="this.loans.length > 0">
        <div>Enhorabuena</div>
        Su solicitud ha sido aceptada
      </div>
      <div v-else class="title">
        <div>Solicitud enviada con éxito</div>
        La aplicación se revisará en 3-5 minutos y puede extenderse en el tiempo ocupado. Preste atención a la notificación del mensaje.
      </div>
      <div v-if="!this.loans.length" class="apply" @click="check">Consultar la solicitud</div>
      <div v-else class="apply" @click="applyMulti">Aumento $ {{ totalAmount }} Cantidad</div>
    </div>

    <div class="other-loans" v-if="loans.length > 0">
      <div class="tips">Usted está en nuestro canal exclusivo VIP en vista de su buena calificación.</div>
      <div class="checked-num">Ya ha seleccionado {{ checkedNums }} productos</div>
      <div v-for="(loan, index) in loans" :key="loan.id" class="loan-item" :class="{ active: !loan.unChecked }" @click="checkLoan(index)">
        <img class="icon" :src="loan.icon" />
        <div class="info">
          <div class="name">{{ loan.productName }}</div>
          <div class="value">
            <label>Importe de préstamo</label>
            <span>${{ loan.minAmount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 没有推荐结果时显示 -->
    <res-loans v-else class="res-loans" :systemTime="systemTime"></res-loans>
    <google-feedback v-show="showGoogleFeed" :show.sync="showGoogleFeed"></google-feedback>

    <div class="control-back" v-if="showBackControl">
      <div class="content">
        <div class="head">
          <img :src="require('@/assets/img/superpeso/倒计时10s弹窗.png')" />
        </div>
        <div class="content">
          Estás a un paso de pasar directamente al límite de 4.000 pesos, ¿seguro que quieres renunciar a tu derecho?
          <div class="count">
            ¡Auto-abortar después de
            <span>{{ count }}s</span>
          </div>
        </div>
        <div class="action">
          <button class="btn-default" @click="showBackControl = false">Piénsalo otra vez</button>
          <button class="btn-default cancel" @click="leave">Renunciar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ResLoans from '@/components/res-loans.vue';
import GoogleFeedback from '@/components/google-feedback.vue';
export default {
  components: {
    ResLoans,
    GoogleFeedback,
  },
  watch: {
    showGoogleFeed: {
      handler() {
        if (!this.showGoogleFeed && this.nextStep) {
          if (this.nextStep == 'goBack') {
            this.goAppBack();
          } else if (this.nextStep == 'goAllOrders') {
            this.innerJump('order-list', {}, true);
          }
        }
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Solicitud de préstamo',
      backCallback: window.loanBtnCallback,
    });
  },

  data() {
    window.loanBtnCallback = async () => {
      if (this.loans.length > 0) {
        this.showBackModal();
      } else if (await this.getNeedGoogle()) {
        this.nextStep = 'goBack';
        this.showGoogleFeed = true;
      } else {
        this.goAppBack();
      }
    };
    return {
      needRecommend: JSON.parse(this.$route.query.needRecommend || true), // 是否需要推荐 从活动过来的不用推荐
      systemTime: this.$route.query.systemTime || '', // 上次订单时间
      single: JSON.parse(this.$route.query.single || false), // 是否是单推
      loans: [],
      count: 10,
      totalAmount: 0,
      checkedNums: 0,
      nextStep: '',
      showBackControl: false,
      backInterval: null, // 回退倒计时
      showGoogleFeed: false,
    };
  },
  mounted() {
    this.toAppMethod('physicalReturnKeyInterception', { isInterception: true, fuName: 'loanBtnCallback' });

    if (this.needRecommend) {
      this.getRecommendLoans();
    }
  },
  methods: {
    leave() {
      this.toAppMethod('physicalReturnKeyInterception', { isInterception: false });
      this.goHome();
    },
    showBackModal() {
      this.count = 10;
      window.clearInterval(this.backInterval);
      this.backInterval = null;
      this.backInterval = setInterval(() => {
        if (this.count == 0) {
          window.clearInterval(this.backInterval);
          this.backInterval = null;
        } else {
          this.count--;
        }
      }, 1000);
      this.showBackControl = true;
    },

    async getNeedGoogle() {
      try {
        let res = await this.$http.post(`/api/popup/favourableComment`);
        if (res.returnCode == 2000) {
          return res.data;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },

    async getRecommendLoans() {
      try {
        this.showLoading();
        let data;
        if (this.single) {
          data = await this.$http.post(`/api/product/maskRecommendList`);
          this.loans = data.data.list || [];
          this.loans = this.loans.map(t => {
            t.maxAmount = t.minAmount;
            return t;
          });
        } else {
          data = await this.$http.post(`/api/product/mergeProduct/list`);
          this.loans = data.data.mergPushProductList || [];
        }
        this.updateCheckedNum();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    async check() {
      // 没有贷款产品且需要google弹窗
      if (!this.loans.length && (await this.getNeedGoogle())) {
        this.nextStep = 'goAllOrders';
        this.showGoogleFeed = true;
      } else {
        this.innerJump('order-list', {}, true);
      }
    },

    checkLoan(index) {
      if (this.checkedNums == 1 && !this.loans[index].unChecked) return;
      this.$set(this.loans, index, { ...this.loans[index], unChecked: !this.loans[index].unChecked });
      this.updateCheckedNum();
    },

    updateCheckedNum() {
      this.checkedNums = this.loans.filter(t => !t.unChecked).length;
      this.totalAmount = this.sumArr(this.loans.filter(t => !t.unChecked).map(t => t.minAmount));
    },

    async applyMulti() {
      let loanIds = this.loans.filter(t => !t.unChecked).map(t => t.id);
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
          // 2. 真正提交
          let res = await this.$http.post(`/api/order/mergePush/preApply`, {
            orderNo: this.$route.query.orderId,
            productList: loanIds,
          });
          if (res.returnCode == 2000) {
            await this.$http.post(`/api/order/mergePush/apply`, {
              orderIdList: res.data.orderIdList,
            });
            this.$toast('Solicitud enviada con éxito');
            setTimeout(res => {
              this.getRecommendLoans();
            }, 1000);
          }
        }
      } catch (error) {
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loan {
  .control-back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 222;

    > .content {
      width: 327px;
      padding: 24px 24px;
      padding-top: 0;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 16px;
      position: absolute;
      top: 55%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: relative;
      .head {
        position: relative;
        height: 54px;
        img {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 327px;
          display: block;
          margin-bottom: 20px;
        }
      }
      .close {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 2;
      }
      .content {
        font-size: 16px;
        font-weight: 500;
        color: #000601;
        line-height: 24px;
        margin-top: 8px;

        .count {
          font-size: 14px;
          font-family: Roboto-Black, Roboto;
          font-weight: 900;
          color: #333333;
          line-height: 24px;
          margin-top: 24px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          margin-bottom: 40px;

          span {
            width: 100px;
            height: 44px;
            background: #43e0a2;
            border-radius: 8px;
            font-size: 18px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            color: #333333;
            line-height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 24px;
          }
        }
      }

      .action {
        .btn-default {
          width: 279px;
          height: 40px;
          background: #416cef;
          border-radius: 8px;
          border: none;
          color: #fff;
          font-size: 16px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #ffffff;
          line-height: 20px;
          &.cancel {
            color: #b0b0b0;
            background: transparent;
            margin-top: 10px;
            font-weight: 400;
            margin-bottom: -10px;
          }
        }
      }
    }
  }

  .bottom-action {
    width: 360px;
    height: 100px;
    background: #ffffff;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 20px 10px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: space-between;
      .btn-line {
        width: 120px;
      }
      .btn-default {
        width: 190px;
      }
    }
    .tips {
      font-size: 10px;
      font-weight: 400;
      line-height: 16px;
      margin-top: 10px;
      text-align: center;
    }
  }
  .other-loans {
    margin: 16px 0px;
    padding: 0 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: -20px;
    padding-bottom: 10px;

    .tips {
      width: 343px;
      background: #fa0000;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      line-height: 20px;
      display: flex;
      align-items: center;
      padding: 8px;
    }

    .checked-num {
      border-top: 4px solid #eee;
      padding-top: 24px;
      margin: 24px 0 24px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      color: #333333;
      line-height: 24px;
      width: 200%;
      margin-left: -16px;
      margin-right: -16px;
      padding-left: 16px;
      padding-right: 16px;
    }

    .loan-item {
      width: 343px;
      height: 72px;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #f3f3f3;
      padding: 16px;
      box-sizing: border-box;
      margin-bottom: 16px;
      position: relative;
      display: flex;
      align-items: center;

      .info {
        flex-grow: 1;
        .name {
          font-size: 14px;
          font-family: Roboto-Black, Roboto;
          font-weight: 900;
          color: #000000;
          line-height: 20px;
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
            font-weight: bold;
            color: #ff4b3f;
            line-height: 20px;
          }
        }
      }
      .icon {
        width: 40px;
        height: 40px;
        display: block;
        margin-right: 10px;
      }
      &::after {
        position: absolute;
        content: ' ';
        top: 16px;
        right: 16px;
        width: 24px;
        height: 24px;
        background-repeat: no-repeat;
        background-size: contain;
      }

      &.active {
        border: 1px solid #333333;
      }
    }
  }

  .loan-tips {
    padding-top: 100px;
    .icon {
      margin: 0 auto;
    }
    .title {
      margin-top: 16px;
      font-size: 13px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #a7a7a7;
      line-height: 15px;
      text-align: center;
      margin-left: 32px;
      margin-right: 32px;
      div {
        font-size: 16px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #2a303c;
        line-height: 20px;
        margin-bottom: 10px;
      }
    }
    .apply {
      width: 343px;
      height: 48px;
      border-radius: 8px;
      margin: 0 auto;
      background: #416cef;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
      margin-top: 40px;
    }
  }

  &.multi {
    .loan-tips {
      padding-top: 32px;
    }
    .title {
      margin-bottom: 16px;
    }
  }
}
</style>
