<template>
  <div class="scroll-area content-area order-list">
    <!-- <van-pull-refresh class=" " v-model="loading" success-text=" " loading-text="loading" loosing-text="loading" pulling-text="loading" @refresh="getAllOrders"> -->
      <div>
        <div class="has-order" v-if="orders.length">
          <order-item class="order-item" v-for="item in orders" :key="item.id" :order="item"></order-item>
        </div>
        <div class="no-order" v-else-if="!loading">
          <m-icon class="icon" type="superpeso/没有订单" :width="168" :height="97" />
          <div class="tips">Ningún pedido de préstamo</div>
          <button @click="goHome">Aplicar ahora</button>
        </div>
      </div>
    <!-- </van-pull-refresh> -->
  </div>
</template>

<script>
import OrderItem from '@/components/order-item.vue';
import eventTrack from '@/mixins/event-track';

export default {
  mixins: [eventTrack],
  components: {
    OrderItem,
  },
  data() {
    return {
      loading: false,
      orders: [],
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Pedido de préstamo',
    });
  },
  mounted() {
    this.getAllOrders();
  },
  methods: {
    async getAllOrders() {
      this.showLoading();
      this.loading = true;
      try {
        let res = await this.$http.post(`/api/order/listAll`);
        this.orders = res.data.list || [];
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
.scroll-area {
  overflow: auto !important;
  padding: 0 16px;
}
.order-list {
  .order-item {
    margin: 16px auto;
  }
}

.no-order {
  margin: 0 auto;
  .icon {
    margin: 100px auto 12px;
  }
  .tips {
    font-size: 12px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    margin-bottom: 40px;
    text-align: center;
  }
  button {
    width: 343px;
    height: 48px;
    background: #416cef;
    border-radius: 8px;
    margin: 0 auto;
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
