<template>
  <van-pull-refresh class="home" v-model="loading" @refresh="onRefresh">
    <p>query:</p>
    <div>{{ query }}</div>

    <p>query.token:</p>
    <div>{{ query.token }}</div>
  </van-pull-refresh>
</template>

<script>
export default {
  data() {
    return {
      query: this.$route.query,
      loading: false,
      count: 1,
    };
  },
  methods: {
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
}
</style>
