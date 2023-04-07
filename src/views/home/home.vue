<template>
  <van-pull-refresh class="home" v-model="loading" @refresh="onRefresh">
    <div class="home-content">
      <div class="loan-wrapper" :class="'multiple_' + isMultiple">
        <div class="inner">
          <div class="available-text">Available Amount (₹)</div>
          <div class="number">6,000</div>
          <div class="total-used">
            <div>
              <div class="label">Total Credit (₹)</div>
              <div class="number">6,000</div>
            </div>
            <div>
              <div class="label">Used Credit (₹)</div>
              <div class="number">0</div>
            </div>
          </div>
          <div class="action-btn">
            <div class="status-tips">Please repay first and unlock a higher loan amount</div>
            {{ actionText }}
          </div>
        </div>

        <div class="multi-select" v-if="isMultiple">
          <span>Customized Solutions</span>
          <div>
            <span :class="{ 'has-num': selectProductsNum > 0 }">{{ selectProductsNum }} products</span>
            <m-icon type="handy/蓝右" :width="12" :height="14" />
          </div>
        </div>
      </div>
    </div>
  </van-pull-refresh>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      query: this.$route.query,
      from: this.$route.query.from,
      loading: false,
      selectProductsNum: 6,
      count: 1,
      isMultiple: true, // 是否多推首页
    };
  },
  computed: {
    actionText() {
      return 'Apply';
    },
  },
  created() {
    this.setGlobalData();
    this.getCommonParametersKey();
  },
  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),

    // 调用app方法获取所有参数
    getCommonParametersKey() {
      window.getCommonParametersKeyCallback = data => {
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        data.apiPrefix = data.apiHost;
        data.appVersion = data.appVersionCode;
        data.appVersionV = data.appVersionName;
        this.setAppGlobal(data);
      };
      this.toAppMethod('getCommonParametersKey', { fuName: 'getCommonParametersKeyCallback' });
    },
    setGlobalData() {
      if (this.from == 'bridge') {
        console.log('sfsdf', this.query);
        this.setAppGlobal(this.query);
      }
      this.setAppChecked(true);
    },
    onRefresh() {
      console.log('onRefresh');
      setTimeout(() => {
        this.$toast('刷新成功');
        this.loading = false;
        this.count++;
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
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
        border-radius: 0px 0px 16px 16px;

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
                background: #FF4B3F;
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
          position: relative;
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
