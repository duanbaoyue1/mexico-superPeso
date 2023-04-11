<template>
  <van-pull-refresh class="home" v-model="loading" @refresh="onRefresh">
    <div class="home-content">
      <div class="loan-wrapper" :class="'multiple_' + isMultiple">
        <div class="inner">
          <div class="available-text">Available Amount (₹)</div>
          <div class="number">{{ appMode.availableCredit || 10000 }}</div>
          <div class="total-used">
            <div>
              <div class="label">Total Credit (₹)</div>
              <div class="number">{{ appMode.totalCredit }}</div>
            </div>
            <div>
              <div class="label">Used Credit (₹)</div>
              <div class="number">{{ appMode.usedCredit }}</div>
            </div>
          </div>
          <div class="action-btn" @click="clickApply">
            <div class="status-tips" v-if="btnTips">{{ btnTips }}</div>
            {{ actionText }}
          </div>
        </div>

        <div class="multi-select" v-if="isMultiple" @click="showRecommend = true">
          <span>Customized Solutions</span>
          <div>
            <span :class="{ 'has-num': selectProductsNum > 0 }">{{ selectProductsNum }} products</span>
            <m-icon type="handy/蓝右" :width="12" :height="14" />
          </div>
        </div>
      </div>
    </div>

    <van-action-sheet v-model="showRecommend" close-on-click-action>
      <div class="pop-content">
        <m-icon class="close" type="handy/关闭弹窗" :width="20" :height="20" @click="showRecommend = false" />
        <multi-recommend @update="updateMultiSelect"></multi-recommend>
      </div>
    </van-action-sheet>
  </van-pull-refresh>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MultiRecommend from '@/components/multi-recommend.vue';

export default {
  components: {
    MultiRecommend,
  },
  data() {
    return {
      query: this.$route.query,
      from: this.$route.query.from,
      loading: false,
      selectProductsNum: 0,
      selectItem: [], // 多推选中的产品
      isMultiple: true, // 是否多推首页
      showRecommend: false,
      actionText: 'Apply',
      btnTips: '',
      actionCallback: null, // 按纽回调
    };
  },
  computed: {},

  watch: {
    'appMode.maskModel': {
      async handler(newVal, oldVal) {
        if (this.appMode && typeof this.appMode.maskModel != 'undefined') {
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
  },
  async created() {
    this.setGlobalData();
    this.getCommonParametersKey();
  },

  mounted() {},

  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),

    // 调用app方法获取所有参数
    getCommonParametersKey() {
      window.getCommonParametersCallback = async data => {
        console.log('app 回调 getCommonParametersKeyCallback', data);
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }

        delete data.apiHost;
        data.appVersion = data.appVersionCode;
        data.appVersionV = data.appVersionName;
        this.setAppGlobal(data);
        try {
          this.showLoading();
          await this.getUserInfo();
          await this.getAppMode();
        } catch (error) {
        } finally {
          this.hideLoading();
        }
      };
      this.toAppMethod('getCommonParameters', { fuName: 'getCommonParametersCallback' });
    },

    updateTextAndAction() {
      // 清除数据
      this.btnTips = '';
      this.actionText = 'Apply';
      this.actionCallback = () => {
        this.$toast('please try later!');
      };

      if (this.appMode.maskModel == 1) {
        this.actionText = this.appMode.button;
        if (this.appMode.button == 'Apply') {
          // 有可借
          this.actionCallback = async () => {
            // 多推
            if (this.selectProductsNum > 0) {
              // 直接申请多推
              try {
                let res = await this.$http.post(`/api/order/mergePush/apply`, {
                  orderIdList: this.selectItem.map(t => t.id),
                });
                if (res.returnCode == 2000) {
                  this.innerJump('loan-success-multi', { systemTime: new Date().getTime() });
                }
              } catch (error) {
                this.$toast(error.message);
              }
            }
          };
        } else if (this.appMode.button == 'Repay') {
          // 有待还款或逾期，无可借
          this.actionCallback = () => {
            this.innerJump('repayment');
          };
        } else if (this.appMode.button == 'Reviewing' || this.appMode.button == 'Disbursing') {
          // 无可借，订单全部放款中或者审核中
          this.actionCallback = () => {
            this.innerJump('order-list');
          };
        } else if (this.appMode.button == 'Rejected') {
          // 无可借，订单全被拒绝
          this.actionCallback = () => {
            this.$toast('The order was rejected. Please try again after 0:00');
          };
        }
      } else if (this.appMode.maskModel == 3) {
        this.actionText = 'Apply';
        //未认证跳转
        if (this.appMode.identityAuth == 0) {
          this.btnTips = '95%';
          this.actionCallback = () => {
            this.innerJump('identity');
          };
        } else if (this.appMode.basicInfoAuth == 0) {
          this.btnTips = '96%';
          this.actionCallback = () => {
            this.innerJump('information');
          };
        } else if (this.appMode.addInfoAuth == 0) {
          this.btnTips = '97%';
          this.actionCallback = () => {
            this.innerJump('contacts');
          };
        } else if (this.appMode.remittanceAccountAuth == 0) {
          this.btnTips = '98%';
          this.actionCallback = () => {
            this.innerJump('complete-bank', { orderId: this.appMode.orderId });
          };
        } else {
          this.btnTips = '99%';
          this.actionCallback = () => {
            this.innerJump('loan-confirm', { orderId: this.appMode.orderId });
          };
        }
      } else if (this.appMode.maskModel == 0) {
        // 现金贷 已经存在订单
        if (this.appMode.orderId && typeof this.appMode.orderStatus != 'undefined') {
          // 默认都跳订单详情页
          this.actionCallback = () => {
            this.innerJump('order-detail', { orderId: this.appMode.orderId });
          };

          if (this.appMode.orderStatus == 20 || this.appMode.orderStatus == 21) {
            // 订单审核中
            this.actionText = 'Reviewing';
          } else if (this.appMode.orderStatus == 80 || this.appMode.orderStatus == 90) {
            // 待还款 | 逾期
            this.actionText = 'Repay';
          } else if (this.appMode.orderStatus == 40) {
            // 拒绝
            this.actionText = 'Rejected';
            this.actionCallback = () => {
              this.$toast('The order was rejected. Please try again after 0:00!');
            };
          } else if (this.appMode.orderStatus == 30 || this.appMode.orderStatus == 70) {
            // 放款中
            this.actionText = 'Disbursing';
          } else {
            // TODO 其它状态是不是跳申请页
          }
        } else {
          // TODO 其它状态
        }
      } else if (this.appMode.maskModel == 2) {
        this.actionText = 'Rejected';
        this.actionCallback = () => {
          this.$toast('The order was rejected. Please try again after 0:00!');
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
        this.selectProductsNum = (res.data.mergPushProductList || []).length;
      } catch (error) {}
    },

    async onRefresh() {
      try {
        await this.getAppMode();
      } catch (error) {
      } finally {
        this.$toast('刷新成功');
        this.loading = false;
      }
    },

    updateMultiSelect(selectItem) {
      console.log(selectItem);
      this.selectItem = selectItem;
      this.selectProductsNum = selectItem.length;
      // TODO 这里需要确认
      this.appMode.availableCredit = selectItem.reduce((prev, cur, index, arr) => {
        return prev + parseInt(cur.maxAmount);
      }, 0);
    },

    async clickApply() {
      if (this.actionCallback) {
        this.actionCallback();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pop-content {
  position: relative;
  .close {
    position: absolute;
    top: 16px;
    right: 24px;
  }
}
.home {
  height: 100%;

  &-content {
    height: 100%;
    background-image: url(../../assets/img/handy/首页背景带字.png);
    background-position: top;
    background-repeat: no-repeat;
    background-size: 375px 420px;
    background-color: #f6f6f6;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 160px 0 0;

    .loan-wrapper {
      width: 343px;
      height: 392px;
      margin: 0 auto;

      &.multiple_false {
        background-image: url(../../assets/img/handy/Money.png);
        background-position: bottom;
        background-repeat: no-repeat;
        background-size: 343px 94px;
      }

      &.multiple_true {
        background-color: #fff;
        border-radius: 16px;

        .multi-select {
          margin-top: 30px;
          padding-left: 24px;
          padding-right: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 16px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #333333;
          line-height: 24px;
          > div {
            display: flex;
            align-items: center;

            span {
              background: #e9e9e9;
              font-size: 10px;
              font-family: Roboto-Regular, Roboto;
              font-weight: 400;
              color: #999999;
              line-height: 12px;
              transform: scale(0.9);
              padding: 6px 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 20px;
              margin-right: 10px;
              &.has-num {
                background: #ff4b3f;
                color: #fff;
              }
            }
          }
        }
      }

      .inner {
        width: 100%;
        height: 308px;
        background: linear-gradient(180deg, #efccc1 0%, #f9f0ea 16%, #ffffff 41%, #ffffff 100%);
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16), inset 0px 2px 3px 0px rgba(255, 255, 255, 0.8);
        border-radius: 16px;
        padding: 24px 24px 20px;
        box-sizing: border-box;
        position: relative;

        .available-text {
          font-size: 18px;
          font-weight: 900;
          color: #333333;
          line-height: 24px;
          text-align: center;
        }
        .number {
          margin-top: 8px;
          font-size: 48px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #333333;
          line-height: 54px;
          text-align: center;
        }

        .action-btn {
          width: 295px;
          height: 44px;
          background: linear-gradient(180deg, #fe816f 0%, #fc2214 100%);
          box-shadow: 0px 4px 10px 0px #f7b5ae, inset 0px 1px 4px 0px #ffc7c0;
          border-radius: 23px;
          font-size: 20px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          bottom: 20px;
          left: 24px;

          .status-tips {
            position: absolute;
            background: #fbe396;
            padding: 8px;
            border-radius: 4px 4px 4px 0;
            font-size: 10px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            color: #333333;
            line-height: 12px;
            font-size: 10px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            color: #333333;
            line-height: 12px;
            right: -14px;
            top: -18px;
            transform: scale(0.9);
          }
        }
        .total-used {
          margin: 32px auto 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 32px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #333333;
          line-height: 36px;
          > div {
            &:first-child {
              margin-right: 76px;
            }
          }
          .label {
            font-size: 14px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            color: #333333;
            line-height: 18px;
            margin-bottom: 8px;
          }
          .number {
            font-size: 32px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #333333;
            line-height: 36px;
          }
        }
      }
    }
  }
}
</style>
