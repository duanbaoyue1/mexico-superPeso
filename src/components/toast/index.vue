<template>
  <div class="toast" v-if="show">
    <div class="toast-center">
      {{ msg }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toast {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  color: #fff;
  font-size: 14px;
  opacity: 0.9;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;

  &-center {
    max-width: 270px;
    border-radius: 3px;
    padding: 10px;
    background: #333;
    word-break: break-word;
  }
}
</style>
