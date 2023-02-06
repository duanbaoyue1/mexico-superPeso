<template>
  <div class="loan multi">
    <div class="loan-tips">
      <m-icon class="icon" type="loan/success" :width="122" :height="109" />
      <div class="title">Application submitted successfully</div>
      <div class="apply" @click="check">Check Application</div>
    </div>

    <div class="other-loans" v-if="loans.length > 0">
      <div v-for="(loan, index) in loans" :key="loan.id" class="loan-item" :class="{ active: !loan.unChecked }" @click="checkLoan(index)">
        <img class="icon" :src="loan.icon" />
        <div class="name">{{ loan.productName }}</div>
        <div class="reloan-wrapper" v-show="loan.isReloan">
          <div class="reloan">Reloan</div>
        </div>
        <div class="label">Lending Company</div>
        <div class="value">{{ loan.companyName }}</div>
        <div class="label">Interest</div>
        <div class="value">{{ loan.interest }}</div>
        <div class="label">Max amount (₹)</div>
        <div class="value">{{ JSON.parse(loan.amountRange).newConfig.split('-')[1]}}</div>
      </div>
    </div>

    <div class="bottom-action" v-if="loans.length > 0">
      <div class="btns">
        <button class="btn-line" @click="goHome">Back Home</button>
        <button class="btn-default" @click="applyMulti">Apply Immediately</button>
      </div>
      <div class="tips color-red">{{ checkedNums }} products selected, high pass rate, when apply together</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loans: [],
      checkedNums: 0,
    };
  },
  mounted() {
    this.getRecommendLoans();
    // 银行卡选择后app抓取数据回调
    window.synDataCallback = async (data) => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        let loanIds = this.loans.filter((t) => !t.unChecked).map((t) => t.id);
        try {
          let data1 = await this.$http.post(`/zihai/qvsxvbget/xiyymmst`, {
            orderNo: this.$route.query.orderId,
            productList: loanIds,
          });
          if (data1.returnCode == 2000) {
            await this.$http.post(`/zihai/qvsxvbget/bmzcx`, {
              orderIdList: data1.data.orderIdList,
            });
            this.$toast('Apply successfully');
            this.getRecommendLoans();
          }
        } catch (error) {
          this.$toast(error.message);
        }
      }
    };
  },
  methods: {
    async getRecommendLoans() {
      let data1 = await this.$http.post(`/xiaqpdt/qvsxvbfzcdpo/pgwhv`);
      let data2 = await this.$http.post(`/xiaqpdt/qvsxvbfzcdpo/pgwhf`);
      this.loans = data2.data.mergPushProductList || [];
      this.updateCheckedNum();
    },
    check() {
      this.toAppMethod('goAllOrders', {});
    },
    checkLoan(index) {
      this.$set(this.loans, index, { ...this.loans[index], unChecked: !this.loans[index].unChecked });
      this.updateCheckedNum();
    },

    updateCheckedNum() {
      this.checkedNums = this.loans.filter((t) => !t.unChecked).length;
    },

    async applyMulti() {
      this.toAppMethod('synData', {});
    },
  },
};
</script>

<style lang="scss" scoped>
.loan {
  padding-bottom: 120px;

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
    margin: 40px 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: -20px;

    .loan-item {
      width: 150px;
      background: #ffffff;
      border-radius: 14px;
      border: 2px solid #e3eafd;
      padding: 20px 0;
      margin-bottom: 20px;
      position: relative;
      .icon {
        width: 24px;
        height: 24px;
        display: block;
        margin: 0 auto;
        margin-bottom: 4px;
      }
      &::after {
        position: absolute;
        content: ' ';
        top: -2px;
        right: -2px;
        width: 50px;
        height: 50px;
        background-image: url(../assets/img/loan/unchoose.png);
        background-repeat: no-repeat;
        background-size: contain;
      }

      .logo {
        margin: 0 auto;
      }
      .name {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin: 4px auto;
        text-align: center;
      }
      .reloan-wrapper {
        display: flex;
        box-sizing: border-box;
        justify-content: center;
        .reloan {
          height: 16px;
          border-radius: 10px;
          line-height: 1;
          text-align: center;
          border: 1px solid #ffbd5c;
          font-size: 10px;
          font-weight: 500;
          color: #ffbd5c;
          padding: 2px 10px 0px 10px;
          display: inline-block;
          margin-bottom: 20px;
        }
      }

      .label {
        font-size: 10px;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
        margin-bottom: 4px;
        text-align: center;
      }
      .value {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        line-height: 20px;
        margin-bottom: 10px;
        text-align: center;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
      }

      &.active {
        border: 2px solid #1143a4;
        &::after {
          background-image: url(../assets/img/loan/choose.png);
        }
      }
    }
  }

  .loan-tips {
    padding-top: 100px;
    .icon {
      margin: 0 auto;
    }
    .title {
      margin-top: 30px;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      text-align: center;
      margin-bottom: 60px;
    }
    .apply {
      width: 320px;
      height: 48px;
      background: #1143a4;
      border-radius: 14px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
    }
  }

  &.multi {
    .loan-tips {
      padding-top: 40px;
    }
    .title {
      margin-bottom: 40px;
    }
  }
}
</style>
