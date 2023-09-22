<template>
  <div class="content">
    <button class="btn-default" @click="goB">跳转页面B</button>
    <van-button type="primary">主要按钮</van-button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  async mounted() {
    // 用户点击回退回调
    console.log('register window.backBtnHandler');
    window.backBtnHandler = async data => {
      console.log('received window.backBtnHandler');
      alert('返回拦截');
      // this.goHome();
    };

    window.updateData = async data => {
      // 上传抓取日志
      try {
        this.$http.post(`/api/userCollect/uploadCaptureLog`, {
          userId: '8101000010',
          appName: 'easyMoney',
          orderId: '1111111',
          type: '111',
          msg: data,
        });
      } catch (error) {
        console.error(error);
      }
    };

    // this.toAppMethod('needBackControl', { need: true });
    let res = await this.$http.post(`/api/user/smsLogin`, {
      loginName: '5555210095',
      smsCode: '0000',
      platform: 'android',
      afId: '12212',
      gaId: '122221',
      androidId: '1123233',
      imei: '222222322',
    });
    console.log(res);
    this.updateToken({ token: res.data.token, userId: res.data.userId });
  },

  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),
    goB() {
      // location.href = 'https://b800627326799999.brpay.in/payin/payment?code=S230303142122752280688625368862';
      this.innerJump('testb');
    },
  },
};
</script>
