<template>
  <div class="content">
    <button class="btn-default" @click="goB">跳转页面B</button>
  </div>
</template>

<script>
export default {
  mounted() {
    window.backBtnHandler = async data => {
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
