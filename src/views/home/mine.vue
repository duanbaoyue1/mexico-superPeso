<template>
  <div id="mine">
    <button class="btn-default" @click="goTestb">跳转页面B</button>
    <button class="btn-default" @click="goDetail">跳转订单详情</button>
  </div>
</template>
<script>
export default {
  methods: {
    goTestb() {
      this.innerJump('testb');
    },
    goDetail() {
      this.innerJump('order-detail');
    },
  },
};
</script>

<style lang="scss" scoped>
#mine {
}
</style>
