<template>
  <div class="pay-history content-area">
    <div class="pay-item" v-for="(item, index) in lists" :key="item.repaymentTime" @click="showContent(index)">
      <div class="head">
        <span>{{ item.repaymentTime }}</span>
        <m-icon class="icon" :class="{ open: item.showContent }" type="superpeso/黑右" :width="16" :height="16" />
      </div>
      <div class="content-1">
        <span>Monto del reembolso del préstamo</span>
        <span class="money">$ {{ item.totalAmount }}</span>
      </div>

      <div class="wrapper" v-show="item.showContent">
        <div class="line">
          <span>Cantidad de transacción</span>
          <span>$ {{ item.actualAmount }}</span>
        </div>
        <div class="line">
          <span>Tarifa de transacción en línea (impuestos incluidos)</span>
          <span>$ {{ item.feeAmount }}</span>
        </div>
        <div class="line">
          <span>Medio de transacción</span>
          <span>{{ item.payType == 0 ? 'Tarjeta de débito' : 'Clabe' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: true,
      title: 'Detalles del pedido',
    });
  },
  data() {
    return {
      id: this.$route.query.id,
      type: this.$route.query.type,
      lists: [],
    };
  },

  mounted() {
    this.getData();
  },

  methods: {
    showContent(index) {
      this.$set(this.lists, index, { ...this.lists[index], showContent: !this.lists[index].showContent });
    },

    async getData() {
      if (this.type === 'bill') {
        let res = await this.$http.post('/api/extension/repaymentHistory', {
          id: this.id,
        });
        console.log(res);
        this.lists = res.data.list;
      } else {
        let res = await this.$http.post('/api/order/detail', {
          orderId: this.id,
        });
        this.lists = res.data.repayRecord.map(t => {
          t.payType = t.repayWay;
          t.repaymentTime = `${t.successDay} ${t.successTime}`
          t.feeAmount = t.charge;
          t.actualAmount = t.repaymentAmount;
          return t;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-history {
  padding-top: 8px;
  background: #f9f9f9;
  .pay-item {
    margin: 8px 16px 0;
    background: #fff;
    border-radius: 8px;
    padding: 24px 16px;
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #999999;
      line-height: 24px;
      .icon {
        transition: all 0.3s;
        margin-top: 6px;
        &.open {
          transform: rotate(90deg);
        }
      }
    }
    .content-1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
      margin-top: 16px;
      .money {
        font-size: 18px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #fc0f0f;
        line-height: 24px;
      }
    }

    .wrapper {
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 24px;
      padding-top: 16px;
      margin-top: 16px;
      border-top: 1px solid #eee;
      .line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        &:last-child {
          margin-bottom: 0;
        }
        span {
          &:last-child {
            margin-left: 30px;
            flex-shrink: 0;
          }
        }
      }
    }
  }
}
</style>
