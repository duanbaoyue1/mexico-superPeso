<template>
  <div class="buy-bottom">
    <div class="info">
      <div>{{ title }}</div>
      <div>{{ text }}</div>
    </div>
    <a class="buy" @click="toBuy">立即订购</a>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    proId: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.buy-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: #24203f;
  display: flex;
  align-items: center;
  color: #fff;
  .info {
    width: 240px;
    padding: 7px 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    box-sizing: border-box;
    div {
      &:last-child {
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
      }
    }
  }
  .buy {
    flex-grow: 1;
    height: 100%;
    background: #f35321;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
