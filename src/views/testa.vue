<template>
  <div class="content">
    <button class="btn-default" @click="goB">跳转页面B</button>
  </div>
</template>

<script>
export default {
  mounted() {
    // 用户点击回退回调
    console.log('register window.backBtnHandler');
    window.backBtnHandler = async data => {
      console.log('received window.backBtnHandler');
      alert('返回拦截');
      this.goHome();
    };

    this.toAppMethod('needBackControl', { need: true });
  },

  methods: {
    goB() {
      this.innerJump('testb');
    },
  },
};
</script>
