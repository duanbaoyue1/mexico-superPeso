<template>
  <div class="loading" v-if="show">
    <img :src="require('@/assets/img/loading.gif')" />
  </div>
</template>

<style lang="scss" scoped>
.loading {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  max-width: 200px;
  background: #333;
  color: #fff;
  font-size: 14px;
  opacity: 0.9;
  text-align: justify;
  word-break: break-all;
  word-wrap: break-word;
  padding: 15px;
  img {
    display: block;
    width: 25px;
  }
}
</style>
