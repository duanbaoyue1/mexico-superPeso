<template>
  <div id="mine" class="content-area">
    <div class="user">
      <img :src="require('@/assets/img/handy/默认头像.png')" />
      <span class="name">{{ userInfo.mobile | phoneHideFilter }}</span>
    </div>

    <div class="menu">
      <div @click="innerJump('order-list')">
        <div>
          <m-icon class="icon" type="handy/Receipt Account" :width="30" :height="30" />
          All orders
        </div>
        <m-icon type="handy/进入" :width="8" :height="12" />
      </div>

      <div @click="innerJump('complete-bank')">
        <div>
          <m-icon class="icon" type="handy/Receipt Account" :width="30" :height="30" />
          Receipt Account
        </div>
        <m-icon type="handy/进入" :width="8" :height="12" />
      </div>

      <div @click="goHelpCenter">
        <div>
          <m-icon class="icon" type="handy/Help Center" :width="30" :height="30" />
          Help Center
        </div>
        <m-icon type="handy/进入" :width="8" :height="12" />
      </div>

      <div @click="innerJump('about')">
        <div>
          <m-icon class="icon" type="handy/About Us" :width="30" :height="30" />
          About Us
        </div>
        <m-icon type="handy/进入" :width="8" :height="12" />
      </div>

      <div @click="innerJump('settings')">
        <div>
          <m-icon class="icon" type="handy/Set Up" :width="30" :height="30" />
          Set Up
        </div>
        <m-icon type="handy/进入" :width="8" :height="12" />
      </div>

      <div @click="showLogOut = true">
        <div>
          <m-icon class="icon" type="handy/Log Out" :width="30" :height="30" />
          Log Out
        </div>
        <m-icon type="handy/进入" :width="8" :height="12" />
      </div>

      <div @click="innerJump('testb')">
        <div>
          <m-icon class="icon" type="handy/Log Out" :width="30" :height="30" />
          testb
        </div>
        <m-icon type="handy/进入" :width="8" :height="12" />
      </div>

       <div @click="innerJump('order-detail')">
        <div>
          <m-icon class="icon" type="handy/Log Out" :width="30" :height="30" />
          Order Detail
        </div>
        <m-icon type="handy/进入" :width="8" :height="12" />
      </div>
    </div>

    <van-overlay :show="showLogOut" @click="showLogOut = false">
      <div class="logout" @click.stop>
        <img :src="require('@/assets/img/handy/个人中心推出弹窗.png')" />
        <div class="content">
          <div>Are you sure you want to log out?</div>
          <button @click="logout">Yes</button>
        </div>
      </div>
    </van-overlay>
    <!-- <button class="btn-default" @click="goTestb">跳转页面B</button> -->
    <!-- <button class="btn-default" @click="goDetail">跳转订单详情</button> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      showLogOut: false,
    };
  },
  async mounted() {
    this.showLoading();
    try {
      await this.getUserInfo();
    } catch (error) {
    } finally {
      this.hideLoading();
    }
  },
  methods: {
    goTestb() {
      this.innerJump('testb');
    },
    goDetail() {
      this.innerJump('order-detail');
    },
  },
};
</script>

<style lang="scss" scoped>
#mine {
  padding: 74px 24px 0;
  padding-bottom: 100px;

  .logout {
    width: 295px;
    height: 266px;
    background: #ffffff;
    border-radius: 8px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      margin-top: -25px;
    }
    .content {
      padding-top: 20px;
      font-size: 16px;
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      text-align: center;
      button {
        width: 247px;
        height: 40px;
        background: linear-gradient(180deg, #fe816f 0%, #fc2214 100%);
        box-shadow: 0px 4px 10px 0px #f7b5ae, inset 0px 1px 4px 0px #ffc7c0;
        border-radius: 20px;
        font-size: 16px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #ffffff;
        line-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        border: none;
        margin-top: 30px;
      }
    }
  }

  .menu {
    width: 327px;
    background: #ffffff;
    border-radius: 8px;
    padding: 0 16px;
    box-sizing: border-box;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 16px;
      padding-top: 16px;
      &:last-child {
        border-bottom: none;
      }

      > div {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        .icon {
          margin-right: 16px;
        }
      }
    }
  }

  .user {
    display: flex;
    font-size: 16px;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
    margin-bottom: 24px;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      margin-right: 20px;
    }
  }
}
</style>
