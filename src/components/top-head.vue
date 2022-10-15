<template>
  <div class="top-header">
    <div class="width-container">
      <div class="pro-info">
        <img class="img-name" :src="require('@/assets/img/' + typeInfo.titleWebImg)" />
        <div class="pro-tips">{{ typeInfo.tipsTop }}</div>
      </div>
      <div class="buy-info">
        <div id="price">{{ typeInfo.price }}元/月</div>
        <div class="buy-btn" @click="toBuyP">
          季付、半年、年付更优惠
          <img v-if="bought" :src="require('@/assets/img/web/buy-btn2@2x.png')" />
          <img v-else :src="require('@/assets/img/web/buy-btn@2x.png')" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['bought', 'typeInfo', 'proId'],
  methods: {
    toBuyP() {
      this.$emit('to-buy');
    },
  },
};
</script>

<style lang="scss" scoped>
.top-header {
  background-image: url('../assets/img/web/beijing@2x.png');
  height: 260px;
  background-size: cover;
  background-repeat: no-repeat;
  height: 260px;
  > div {
    padding-top: 39px;
    padding-left: 30px;
    padding-right: 30px;
    position: relative;
    display: flex;
    justify-content: space-between;
    .pro-info {
      width: 600px;
      .img-name {
        height: 52px;
        display: block;
      }
    }
    .buy-info {
      text-align: right;
      #price {
        font-size: 40px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #ffffff;
        line-height: 52px;
        margin-bottom: 31px;
      }
      .buy-btn {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #ffffff;
        line-height: 21px;
        cursor: pointer;
        img {
          width: 180px;
          margin-left: 10px;
        }
      }
    }
    .pro-tips {
      font-size: 16px;
      font-weight: 400;
      color: #adadad;
      line-height: 21px;
      margin-top: 30px;
    }
  }
}
</style>
