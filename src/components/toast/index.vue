<template>
  <div class="toast" v-if="show">
    {{ msg }}
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  max-width: 200px;
  padding: 10px;
  background: #333;
  color: #fff;
  font-size: 14px;
  opacity: 0.9;
  text-align: justify;
  word-break: break-all;
  word-wrap: break-word;
}
</style>
