<template>
  <div class="about">
    <div class="app-info">
      <img src="../assets/img/logo@2x.png" />
      <div class="name">{{ appGlobal.appName }}</div>
      <div id="version">Version: {{ appGlobal.appVersionV }}</div>
    </div>

    <div class="desc">We have developed an application called "{{ appGlobal.appName }}" through which you can apply for a short-term unsecured loan with a quick and easy process and a second payout the same day to help you solve your financial problems.</div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.innerJump('identity', {}, true);
  },
};
</script>

<style lang="scss" scoped>
.app-info {
  text-align: center;
  img {
    width: 60px;
    display: block;
    margin: 30px auto 20px;
  }
  .name {
    font-size: 18px;
    font-weight: 500;
    color: #000000;
    line-height: 24px;
  }
  #version {
    margin-top: 6px;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 18px;
  }
}

.desc {
  background: #ffffff;
  margin: 20px;
  box-sizing: border-box;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  line-height: 18px;
}
</style>
