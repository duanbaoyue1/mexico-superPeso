<template>
  <div class="order-list content-area">
    <div class="has-order" v-if="orders.length">
      <order-item-repayment class="order-item" v-for="item in orders" :key="item.id" :order="item"></order-item-repayment>
    </div>
    <div class="no-order" v-else-if="!loading">
      <m-icon class="icon" type="superpeso/没有订单" :width="140" :height="107" />
      <div>Ningún pedido de préstamo</div>
      <button @click="goHome">Aplicar ahora</button>
    </div>
  </div>
</template>

<script>
import OrderItemRepayment from '@/components/order-item-repayment.vue';

export default {
  components: {
    OrderItemRepayment,
  },
  data() {
    return {
      loading: true,
      orders: [],
    };
  },
  created() {
    this.setTabBar({
      show: false,
      transparent: false,
      fixed: true,
      title: '',
    });
  },
  activated() {
    this.setEventTrackStartTime();

    this.getAllOrders();
  },
  beforeRouteLeave(to, from, next) {
    this.updateTrackerData({ key: 'productId', value: '' });
    this.updateTrackerData({ key: 'status', value: '' });
    if (['home', 'mine'].includes(to.name)) {
      this.sendEventTrackData({});
    }
    next();
  },
  methods: {
    async getAllOrders() {
      this.showLoading();
      try {
        let res = await this.$http.post(`/api/order/unRepaymentOrderList`);
        this.orders = res.data.list || [];
        this.setRepaymentNum(this.orders.length);
      } catch (error) {
      } finally {
        this.hideLoading();
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-list {
  padding: 0 16px;
  padding-bottom: 100px;
  padding-top: 75px;

  .order-item {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.no-order {
  margin: 0 auto;
  font-size: 12px;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #999999;
  text-align: center;
  line-height: 14px;
  .icon {
    margin: 80px auto 12px;
  }
  button {
    width: 343px;
    height: 48px;
    background: #416cef;
    border-radius: 8px;
    margin: 0 auto;
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-family: Roboto-Black, Roboto;
    font-weight: 900;
    color: #ffffff;
    line-height: 24px;
    border: none;
  }
}
</style>
