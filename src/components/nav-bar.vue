<template>
  <van-nav-bar :class="{ transparent: tabBar.transparent, white: tabBar.color == 'white' }" :style="{ background: backgroundColor }" :fixed="tabBar.fixed" :title="tabBar.title" @click-left="onBack">
    <template #left>
      <!-- <m-icon v-if="tabBar.color == 'white'" type="hucha/白返回" :width="16" :height="16" /> -->
      <m-icon type="superpeso/返回" :width="16" :height="16" />
    </template>
  </van-nav-bar>
</template>

<script>
export default {
  mounted() {},
  computed: {
    backgroundColor() {
      if (this.tabBar.transparent) {
        return 'transparent';
      } else if (this.tabBar.backgroundColor) {
        return this.tabBar.backgroundColor;
      } else {
        return '#fff';
      }
    },
  },
  methods: {
    onBack() {
      if (this.tabBar.backCallback) {
        console.log('on tabBar.backCallback');
        this.tabBar.backCallback();
        return;
      } else {
        console.log('on goAppBack');
        this.goAppBack();
      }
    },
  },
};
</script>
