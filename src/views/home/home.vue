<template>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <p>刷新次数: {{ count }}</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    <p>刷新次数</p>
    
  </van-pull-refresh>
</template>

<script>
export default {
  data() {
    return {
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
