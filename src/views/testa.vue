<template>
  <div class="content">
    <button class="btn-default" @click="goB">跳转页面B</button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  beforeRouteLeave(to, from, next) {
    this.toAppMethod('needBackControl', { need: false });
    next();
  },
  async mounted() {
    // 用户点击回退回调
    console.log('register window.backBtnHandler');
    window.backBtnHandler = async data => {
      console.log('received window.backBtnHandler');
      alert('返回拦截');
      // this.goHome();
    };

    this.toAppMethod('needBackControl', { need: true });

    let res = await this.$http.post(`/clyb/eywzjraa`, {
      loginName: '8101000010',
      smsCode: '0000',
      platform: 'android',
      afId: '11',
      gaId: '11',
      androidId: '1111',
      imei: '2222',
    });
    this.updateToken(res.data.token);
    console.log(res.data.token);
  },

  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),
    goB() {
      location.href = 'https://b800627326799999.brpay.in/payin/payment?code=S230303142122752280688625368862';
      // this.innerJump('testb');
    },
  },
};
</script>
