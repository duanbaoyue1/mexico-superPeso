<template>
  <div class="complain-home">
    <div class="head">Select a feedback agency</div>
    <div class="select">
      <button>EasyMoney</button>
      <button>RBI</button>
      <button>Online complaint platform</button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.complain-home {
  padding: 20px;

  .head {
    margin-top: 30px;
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 26px;
  }

  .select {
    button {
      width: 320px;
      height: 40px;
      border-radius: 20px;
      border: 1px solid #e4e4e4;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
