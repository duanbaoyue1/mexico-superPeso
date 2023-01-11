<template>
  <div class="about">
    <div class="app-info">
      <img src="../assets/img/logo@2x.png" />
      <div class="name">TankaShip</div>
      <div id="version">Version: v {{ appGlobal.appVersionV }}</div>
    </div>

    <div class="desc">XXXXXXXXXX is a platform which displays various unsecured loan products.It’s developed by Epoch Gocredit Solutions Private Limited,it provides a platform to loan products and recommend these good products to the public to crate a new innovative mode of loan service. On the basis of artificial intelligence and big data risk management technology,We provide the convenient, fast and secure online financial service . Rupeebox is an platform with the features of easy application,fast reviewing,high loan amount and etc.We can provide customers with reliable loan service according to their personal requirements.</div>
  </div>
</template>

<script>
export default {};
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
