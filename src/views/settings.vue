<template>
  <div class="settings">
    <div v-if="!hasPassword" class="btn" @click="$router.push({ name: 'create-password' })">Create password</div>
    <div v-else class="btn" @click="$router.push({ name: 'retrieve-password' })">Change Login Password</div>
    <div class="btn" @click="showLegal = true">Legal</div>

    <div class="legal-modal" v-if="showLegal">
      <div class="content">
        <div @click="goTerms">Terms of Use</div>
        <div @click="goPrivacy">Privacy Policy</div>
        <m-icon class="close" type="message/close" :width="24" :height="24" @click="showLegal = false" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasPassword: 0,
      showLegal: false,
    };
  },
  methods: {},
  async mounted() {
    try {
      let data = await this.$http.post(`/clyb/qgqaf`);
      this.hasPassword = data.data.hasPassword;
    } catch (error) {}
  },
};
</script>

<style lang="scss" scoped>
.settings {
  padding-top: 10px;

  .legal-modal {
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      background: #fff;
      line-height: 24px;
      width: 320px;
      box-sizing: border-box;
      border-radius: 8px;

      > div {
        text-align: center;
        &:first-child {
          border-bottom: 1px solid #cccccc;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
      }

      .close {
        position: absolute;
        bottom: -54px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .btn {
    width: 320px;
    height: 60px;
    border-radius: 14px;
    border: 1px solid #cccccc;
    padding: 0 20px;
    position: relative;
    margin: 20px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    display: flex;
    align-items: center;
    &::after {
      position: absolute;
      content: ' ';
      width: 8px;
      height: 12px;
      top: 50%;
      transform: translateY(-50%);
      right: 20px;
      background-image: url(../assets/img/right.png);
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
}
</style>
