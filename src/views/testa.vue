<template>
  <div class="content">
    <button class="btn-default" @click="goB">跳转页面B</button>
  </div>
</template>

<script>
export default {
  beforeRouteLeave(to, from, next) {
    this.toAppMethod('needBackControl', { need: false });
    next();
  },
  mounted() {
    // 用户点击回退回调
    console.log('register window.backBtnHandler');
    window.backBtnHandler = async data => {
      console.log('received window.backBtnHandler');
      alert('返回拦截');
      // this.goHome();
    };

    this.toAppMethod('needBackControl', { need: true });
  },

  methods: {
    goB() {
      location.href = 'https://b800627326799999.brpay.in/payin/payment?code=S230303142122752280688625368862';
      // this.innerJump('testb');
    },
  },
};
</script>
