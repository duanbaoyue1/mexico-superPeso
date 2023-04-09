<template>
  <div class="order-list content-area">
    <order-item class="order-item" v-for="item in orders" :order="item"></order-item>
  </div>
</template>

<script>
import OrderItem from '@/components/order-item.vue';

export default {
  components: {
    OrderItem,
  },
  data() {
    return {
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
  mounted() {
    this.getAllOrders();
  },
  methods: {
    async getAllOrders() {
      try {
        this.showLoading();
        // TODO: /api/order/unRepaymentOrderList
        let res = await this.$http.post(`/api/order/listAll`);
        this.orders = res.data.list;
        console.log(this.orders);
      } catch (error) {} finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-list {
  padding: 0 24px;
  padding-top: 36px;
  .order-item {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
