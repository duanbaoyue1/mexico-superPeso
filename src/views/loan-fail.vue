<template>
  <div class="loan">
    <div class="loan-tips">
      <m-icon class="icon" type="loan/fail" :width="122" :height="109" />
      <div class="title">Sorry The application is fail!</div>
      <div class="apply" @click="goHome">Back to Home</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loan {
  .loan-tips {
    padding-top: 100px;
    .icon {
      margin: 0 auto;
    }
    .title {
      margin-top: 30px;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      text-align: center;
      margin-bottom: 60px;
    }
    .apply {
      width: 320px;
      height: 48px;
      background: #1143a4;
      border-radius: 14px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
    }
  }
}
</style>
