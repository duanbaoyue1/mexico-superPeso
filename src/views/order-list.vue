<template>
  <div class="order-list"></div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
    };
  },
  mounted() {
    this.getAllOrders();
  },
  methods: {
    async getAllOrders() {
      try {
        let res = await this.$http.post(`/api/order/listAll`);
        this.orders = res.data.list;
        console.log(this.orders);
      } catch (error) {}
    },
  },
};
</script>
