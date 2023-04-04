<template>
  <van-pull-refresh class="home" v-model="loading" @refresh="onRefresh">
    <p>query:</p>
    <div>{{ query }}</div>

    <p>query.token:</p>
    <div>{{ query.token }}</div>
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
      count: 1,
    };
  },
  created() {
    this.setGlobalData();
  },
  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),

    setGlobalData() {
      if (this.from == 'bridge') {
        console.log(this.query);
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
}
</style>
