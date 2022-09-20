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
    }
  }
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
}

.tips-toast {
  padding-bottom: 0 !important;
  .el-message-box__header {
    padding-top: 16px !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
    padding-bottom: 0;
  }
  .el-message-box__title {
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    text-align: center;
    line-height: 24px;
  }
  .el-button--primary {
    font-size: 17px;
    font-weight: 400;
    color: #fff;
    line-height: 24px;
    background: transparent !important;
    border: none;
    padding: 0;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    width: 120px;
    height: 24px;
    background: #f2f6f7 !important;
    border-radius: 12px;
    margin: 15px auto;
    font-size: 13px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
  }
  .el-message-box__btns {
    border-top: none;
    padding: 0px !important;
    text-align: center !important;
  }
  .el-message-box__content {
    font-size: 13px;
    line-height: 18px;
    font-weight: 400;
    line-height: 21px;
    padding-bottom: 0px !important;
  }
}
</style>
