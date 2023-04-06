<template>
  <van-pull-refresh class="home" v-model="loading" @refresh="onRefresh">
    <p>query:</p>
    <div>{{ query }}</div>

    <p>query.token:</p>
    <div>{{ query.token }}</div>

    <button class="btn-default" @click="goTestb">跳转页面B</button>
    <button class="btn-default" @click="goDetail">跳转订单详情</button>
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
    this.getCommonParametersKey();
  },
  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),
    goTestb() {
      this.innerJump('testb');
    },
    goDetail() {
      this.innerJump('order-detail');
    },

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
