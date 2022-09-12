<template>
  <div id="app">
    <div id="wx_pic" style="margin: 0 auto; display: none"></div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  watch: {
    $route(to, from) {
      document.body.style.overflow = '';
      document.title = to.meta.title || '';
    },
  },
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
}

.tips-toast {
  padding-bottom: 10px !important;
  .el-message-box__header {
    padding-top: 16px !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
    padding-bottom: 0;
  }
  .el-message-box__title {
    font-size: 17px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
  }
  .el-button--primary {
    font-size: 17px;
    font-weight: 400;
    color: #1677ff;
    line-height: 24px;
    background: transparent !important;
    border: none;
    padding: 0;
  }
  .el-message-box__btns {
    border-top: 1px solid #e5e5e5;
    padding-top: 11px !important;
  }
  .el-message-box__content {
    text-align: left !important;
    font-size: 15px;
    font-weight: 400;
    line-height: 21px;
    padding-bottom: 11px !important;
  }
}
</style>
