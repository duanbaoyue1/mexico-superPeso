<template>
  <van-pull-refresh class="home" :disabled="disabledPullRefresh" v-model="loading" success-text=" " loading-text=" " loosing-text=" " pulling-text=" " @refresh="onRefresh">
    <div class="home-title">
      Podemos originar
      <br />
      préstamos rápidamente
    </div>
    <div class="home-content">
      <div class="loan-wrapper" :class="'multiple_' + isMultiple">
        <div class="inner">
          <template>
            <div class="available-text">Cantidad disponible</div>
            <div class="number">
              <span class="dollar">$</span>
              {{ (isMultiple ? multipleCredit.remaining : curAvailableAmount) | formatMonex }}
              <m-icon type="superpeso/锁" v-if="showLock" :height="16" :width="14"></m-icon>
              <m-icon type="superpeso/刷新" v-else @click="updateData" :height="14" :width="16"></m-icon>
            </div>
          </template>
          <!-- <template>
            <div class="no-credit">Será diferente según el método de pago</div>
          </template> -->

          <div class="tips" :class="'multiple_' + isMultiple" v-if="!isMultiple">Dinero, cuando lo necesites.</div>
          <div class="tips" :class="'multiple_' + isMultiple" v-else @click="clickShowRecommend">
            <span>Soluciones personalizadas</span>
            <div :class="{ 'has-num': selectItems.length > 0 }">{{ selectItems.length }} products</div>
          </div>

          <div class="total-used">
            <div>
              <div class="label">Crédito total</div>
              <div class="number">
                <span>$</span>
                {{ (isMultiple ? multipleCredit.sumQuota : appMode.totalCredit) | formatMonex }}
              </div>
            </div>
            <div>
              <div class="label">Carta de crédito utilizada</div>
              <div class="number">
                <span>$</span>
                {{ (isMultiple ? multipleCredit.usedQuota : appMode.usedCredit) | formatMonex }}
              </div>
            </div>
          </div>
        </div>
        <div class="action-wrapper">
          <div class="tips">
            <div>
              <m-icon type="superpeso/Aplicación fácil" :width="40" :height="40" />
              Aplicación fácil
            </div>

            <div>
              <m-icon type="superpeso/Bajo tipo de inters" :width="40" :height="40" />
              Bajo tipo de interés
            </div>
            <div>
              <m-icon type="superpeso/Llegada rápida" :width="40" :height="40" />
              Llegada rápida
            </div>
          </div>
          <div class="action-btn" @click="clickApply">
            <div class="status-tips" v-if="btnTips" v-html="btnTips">sfdasdf</div>
            {{ isMultiple ? multipleCredit.button : actionText }}
          </div>
          <div class="action-tips" v-if="actionTips" v-html="actionTips"></div>
        </div>
      </div>
    </div>

    <van-action-sheet v-model="showRecommend" :safe-area-inset-bottom="false" close-on-click-action class="home-recommend">
      <div class="pop-content">
        <multi-recommend @hide="showRecommend = false" @update="updateMultiSelect" :list="multiRecommendList"></multi-recommend>
      </div>
    </van-action-sheet>
  </van-pull-refresh>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MultiRecommend from '@/components/multi-recommend.vue';
import eventTrack from '@/mixins/event-track.js';

export default {
  mixins: [eventTrack],
  components: {
    MultiRecommend,
  },
  data() {
    return {
      showLock: false,
      disabledPullRefresh: false,
      created: false,
      query: this.$route.query,
      from: this.$route.query.from,
      loading: false,
      selectItems: [], // 多推选中的产品
      multiRecommendList: [], // 多推的产品
      isMultiple: !!localStorage.getItem('app-is-multi'), // 是否多推首页
      showRecommend: false,
      actionText: 'Aplicar ahora',
      btnTips: '',
      actionTips: '',
      actionCallback: null, // 按纽回调
      multipleCredit: {},
    };
  },
  computed: {
    curAvailableAmount() {
      if (typeof this.appMode.availableCredit != 'undefined' && this.appMode.availableCredit) {
        return this.appMode.availableCredit;
      } else if (typeof this.appMode.amount != 'undefined') {
        return this.appMode.amount;
      } else {
        return '';
      }
    },
  },

  watch: {
    'appMode.maskModel': {
      async handler(newVal, oldVal) {
        if (newVal != oldVal && this.appMode && typeof this.appMode.maskModel != 'undefined') {
          if (this.appMode.maskModel == 1) {
            // 多推
            localStorage.setItem('app-is-multi', true);
            this.isMultiple = true;
            await this.getMultiRecommendItems();
          } else {
            // 现金贷
            this.isMultiple = false;
            localStorage.removeItem('app-is-multi');
          }
          this.updateTextAndAction();
          this.startSyncData();
        }
      },
      deep: true,
      immediate: true,
    },
    showRecommend: {
      async handler(newVal, oldVal) {
        this.disabledPullRefresh = !!this.showRecommend;
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    if (this.from == 'bridge' && !this.query.reload) {
      location.replace(location.href + '&reload=true');
    }
    this.setGlobalData();
    this.getCommonParametersKey();
  },

  mounted() {
    if (!this.checkInApp()) {
      window.getCommonParametersCallback();
    }
  },
  activated() {
    this.setTabBar({
      show: false,
    });
    if (this.checkInApp() && !this.created) {
      return;
    }
    this.eventTracker('home_access');
    console.log('home activated and refresh data!');
    this.updateData();
  },
  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),

    // 调用app方法获取所有参数
    getCommonParametersKey() {
      window.getCommonParametersCallback = async data => {
        console.log('app 回调 getCommonParametersKeyCallback', data);
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        data = data || {};
        delete data.apiHost;
        if (data.appVersionCode) {
          if (+data?.appVersionCode > +this.$route.query.appVersion) {
            this.hideLoading();
            this.toAppMethod('inLoginPage');
            return;
          }
          data.appVersion = data.appVersionCode;
        }
        if (data.appVersionName) {
          data.appVersionV = data.appVersionName;
        }
        this.setAppGlobal(data);
        this.updateData();
        this.created = true;
      };
      this.toAppMethod('commonParametersMaps', { fuName: 'getCommonParametersCallback' });
    },

    clickShowRecommend() {
      if (!this.selectItems || this.selectItems.length == 0) {
        return;
      }
      this.showRecommend = true;
    },

    async updateData() {
      try {
        this.showLoading();
        await this.getUserInfo();
        await this.getAppMode();
        if (this.appMode.maskModel == 1) {
          await this.getMultiRecommendItems();
        }
        this.updateTextAndAction();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },

    updateTextAndAction() {
      // 清除数据
      this.btnTips = '';
      this.actionTips = '';
      this.showLock = false;
      this.actionText = 'Aplicar ahora';
      this.actionCallback = () => {
        this.$toast('Por favor, inténtelo de nuevo！');
      };

      if (this.appMode.maskModel == 1) {
        this.actionText = this.multipleCredit.button || 'Aplicar ahora';
        if (this.actionText == 'Aplicar ahora') {
          // 有可借
          this.actionCallback = async () => {
            // 多推
            if (this.selectItems.length > 0) {
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
                // 2. 真正提交
                if (syncRes.success) {
                  let res = await this.$http.post(`/api/order/mergePush/preApply`, {
                    productList: this.selectItems.map(t => t.id),
                  });
                  if (res.returnCode == 2000) {
                    await this.$http.post(`/api/order/mergePush/apply`, {
                      orderIdList: res.data.orderIdList,
                    });
                    this.$toast('Solicitud enviada con éxito');
                    setTimeout(res => {
                      this.innerJump('loan-success-multi', { systemTime: this.getLocalSystemTimeStamp() });
                    }, 1500);
                  }
                }
              } catch (error) {
                this.$toast(error.message);
              } finally {
                this.hideLoading();
              }
            }
          };
        } else if (this.actionText == 'Ir a reembolsar') {
          this.showLock = true;
          this.actionTips = 'Demasiados préstamos ahora. Por favor, pagar primero y desbloquear una mayor cantidad del préstamo.';
          // 有待还款或逾期，无可借
          this.actionCallback = () => {
            this.innerJump('repayment');
          };
        } else if (this.actionText == 'En revisión' || this.actionText == 'Desembolsando') {
          this.showLock = true;
          // 无可借，订单全部放款中或者审核中
          this.actionCallback = () => {
            this.innerJump('order-list');
          };
        } else if (this.actionText == 'Rechazo') {
          // 无可借，订单全被拒绝
          this.showLock = true;
          this.actionCallback = () => {
            this.$toast('Por favor, inténtelo de nuevo después de 0:00');
          };
        }
      } else if (this.appMode.maskModel == 3 || this.appMode.maskModel == 0) {
        this.actionText = this.appMode.button || 'Aplicar ahora';
        //未认证跳转
        if (this.appMode.addInfoAuth == 0) {
          this.btnTips = 'Casi:95%';
          this.actionCallback = () => {
            this.innerJump('information', { orderId: this.appMode.orderId });
          };
        } else if (this.appMode.basicInfoAuth == 0) {
          this.btnTips = 'Casi:96%';
          this.actionCallback = () => {
            this.innerJump('contacts', { orderId: this.appMode.orderId });
          };
        } else if (this.appMode.identityAuth == 0) {
          this.btnTips = 'Casi:97%';
          this.actionCallback = () => {
            this.innerJump('identity', { orderId: this.appMode.orderId });
          };
        } else if (this.appMode.remittanceAccountAuth == 0) {
          this.btnTips = 'Casi:98%';
          if (this.appMode.maskModel == 3) {
            this.actionCallback = () => {
              this.innerJump('add-bank', { orderId: this.appMode.orderId, from: 'order' });
            };
          } else {
            this.actionCallback = () => {
              this.innerJump('complete-bank', { orderId: this.appMode.orderId, from: 'order' });
            };
          }
        } else if (this.appMode.orderId && typeof this.appMode.orderStatus != 'undefined') {
          // 默认都跳订单详情页
          this.actionCallback = () => {
            this.innerJump('order-detail', { orderId: this.appMode.orderId });
          };
          if (this.appMode.orderStatus == 20 || this.appMode.orderStatus == 21) {
            // 订单审核中
            this.showLock = true;
          } else if (this.appMode.orderStatus == 80 || this.appMode.orderStatus == 90) {
            // 待还款 | 逾期
            this.showLock = true;
            this.actionTips = 'Primer Ministro y desbloquee un monte de Prestamo mas alto.';
          } else if (this.appMode.orderStatus == 40) {
            // 拒绝
            this.actionCallback = () => {
              this.$toast('Por favor, inténtelo de nuevo después de 0:00!');
            };
          } else if (this.appMode.orderStatus == 30 || this.appMode.orderStatus == 70) {
            // 放款中
            // this.actionText = 'Desembolsando';
          } else {
            this.btnTips = 'Casi:99%';
            this.actionCallback = () => {
              this.innerJump('loan-confirm', { orderId: this.appMode.orderId });
            };
          }
        }
      } else if (this.appMode.maskModel == 2) {
        this.actionText = 'Rechazo';
        this.actionCallback = () => {
          this.$toast('Por favor, inténtelo de nuevo después de 0:00!');
        };
      }
    },

    setGlobalData() {
      if (this.from == 'bridge') {
        this.setAppGlobal(this.query);
      }
      this.setAppChecked(true);
    },

    async getMultiRecommendItems() {
      try {
        let res = await this.$http.post(`/api/product/mergeProduct/list`);
        this.updateMultiSelect(res.data.mergPushProductList || []);
        this.multiRecommendList = res.data.mergPushProductList || [];
        this.setRepaymentNum(res.data.repaymentNum);
        this.multipleCredit = {
          usedQuota: res.data.usedQuota,
          sumQuota: res.data.sumQuota,
          remaining: res.data.remaining,
          repaymentNum: res.data.repaymentNum,
          button: res.data.button,
        };
      } catch (error) {}
    },

    async onRefresh() {
      try {
        await this.getAppMode();
        this.updateTextAndAction();
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    },

    updateMultiSelect(selectItems) {
      this.selectItems = selectItems;
      let totalValue = selectItems.reduce((prev, cur, index, arr) => {
        return prev + parseInt(cur.minAmount);
      }, 0);
      this.$set(this.multipleCredit, 'remaining', totalValue);
    },

    async clickApply() {
      this.eventTracker('home_apply');
      if (this.actionCallback) {
        this.actionCallback();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-recommend {
  height: 80%;
  border-radius: 16px 16px 0px 0px !important;
  .pop-content {
    position: relative;
    height: 100%;
    overflow: hidden;
    .close {
      position: absolute;
      top: 16px;
      right: 24px;
    }
  }
}

.home {
  height: 100%;
  box-sizing: border-box;
  background-attachment: local;
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 420px;

  &-title {
    margin: 60px 16px;
    font-size: 24px;
    font-family: Impact;
    color: #333333;
    line-height: 24px;
    letter-spacing: 3px;
    margin-bottom: 16px;
  }

  &-content {
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    padding-bottom: 24px;

    .loan-wrapper {
      width: 343px;
      height: 392px;
      margin: 0 auto;

      &.multiple_false {
        background-position: bottom;
        background-repeat: no-repeat;
        background-size: 343px 94px;
      }

      .action-wrapper {
        margin: 32px 0px;
        .tips {
          margin-left: 12px;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #000000;
          line-height: 14px;
          img {
            display: block;
            margin: 0 auto;
            margin-bottom: 8px;
          }
        }
        .action-btn {
          margin-top: 32px;
          width: 343px;
          height: 48px;
          background: #416cef;
          border-radius: 8px;
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          .status-tips {
            position: absolute;
            background: #e73122;
            padding: 8px;
            border-radius: 10px 10px 0 10px;
            font-size: 10px;
            font-weight: 400;
            color: #fff;
            line-height: 12px;
            font-size: 10px;
            font-weight: 400;
            line-height: 12px;
            right: -3px;
            bottom: 32px;
            transform: scale(0.9);
          }
        }
        .action-tips {
          font-size: 13px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 500;
          margin-top: 10px;
          color: #fa0000;
          line-height: 20px;
        }
      }

      .inner {
        width: 100%;
        background: #416cef;
        border-radius: 8px;
        padding-top: 24px;
        box-sizing: border-box;
        position: relative;
        color: #fff;

        .no-credit {
          font-size: 24px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #ffffff;
          line-height: 28px;
          width: 260px;

          margin: 0 auto;
          margin-bottom: 32px;
        }

        .available-text {
          font-size: 18px;
          font-weight: 900;
          line-height: 24px;
          text-align: center;
        }
        .number {
          margin-top: 8px;
          font-size: 46px;
          font-family: Roboto-Regular;
          font-weight: bold;
          line-height: 54px;
          text-align: center;
          height: 52px;
          display: flex;
          justify-content: center;
          align-items: baseline;
          .dollar {
            font-size: 24px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 500;
            color: #ffffff;
            line-height: 32px;
            margin-right: 6px;
          }
          img {
            margin-left: 6px;
          }
        }

        .tips {
          width: 263px;
          height: 38px;
          background: #1c1c1c;
          border-radius: 4px;
          font-size: 16px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 500;
          color: #ffffff;
          line-height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 24px auto auto;
          position: relative;

          &.multiple_true {
            width: 311px;
            justify-content: space-between;
            padding-left: 8px;
            padding-right: 28px;
            font-size: 14px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 500;
            color: #ffffff;
            line-height: 20px;
            background-image: url(../../assets/img/superpeso/白右.png);
            background-repeat: no-repeat;
            background-size: 16px 16px;
            background-position: 290px 10px;
            box-sizing: border-box;

            div {
              font-size: 10px;
              font-family: Roboto-Regular, Roboto;
              font-weight: 500;
              color: #ffffff;
              line-height: 12px;
              padding: 6px 8px;
              transform: scale(0.9);
              color: #7e7e7e;
              background: #545454;
              border-radius: 15px;
              &.has-num {
                background: #e73122;
                color: #fff;
              }
            }
          }
        }

        .total-used {
          width: 343px;
          height: 90px;
          background: #1c1c1c;
          border-radius: 0px 0px 8px 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 32px;
          margin-top: 24px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #333333;
          line-height: 36px;
          padding-top: 16px;
          padding-bottom: 24px;
          box-sizing: border-box;
          color: #fff;
          > div {
            flex: 1;
            text-align: center;
            position: relative;
            &:first-child {
              &::after {
                position: absolute;
                content: ' ';
                width: 1px;
                height: 42px;
                border-right: 1px solid #5f5f5f;
                top: 50%;
                transform: translateY(-50%);
                right: 0;
              }
            }
          }
          .label {
            font-size: 12px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            color: #ffffff;
            line-height: 18px;
            margin-bottom: 8px;
          }
          .number {
            font-size: 20px;
            font-family: Roboto-Regular;
            font-weight: bold;
            color: #ffffff;
            line-height: 24px;
            height: initial;
            span {
              font-size: 12px;
              font-family: Roboto-regular, Roboto;
              font-weight: bold;
              color: #ffffff;
              line-height: 16px;
              margin-right: 0px;
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
}
</style>
