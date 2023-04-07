<template>
  <van-nav-bar :class="{'transparent': tabBar.transparent}" :fixed="tabBar.fixed" :title="tabBar.title" @click-left="onBack">
    <template #left>
      <m-icon type="handy/返回" :width="16" :height="16" />
    </template>
  </van-nav-bar>
</template>

<script>
export default {
  mounted() {},
  methods: {
    onBack() {
      if (this.tabBar.backCallback) {
        this.tabBar.backCallback();
        return;
      } else {
        this.goAppBack();
      }
    },
  },
};
</script>
