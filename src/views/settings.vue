<template>
  <div class="settings content-area">
    <div v-if="!hasPassword" class="btn" @click="$router.push({ name: 'create-password' })">Crear una contraseña</div>
    <div v-else class="btn" @click="$router.push({ name: 'retrieve-password' })">Cambiar contraseña</div>
    <div class="btn" @click="showLegal = true">Legal</div>

    <div class="legal-modal" v-if="showLegal">
      <div class="content">
        <m-icon class="close" type="superpeso/关闭弹窗" :width="16" :height="16" @click="showLegal = false" />
        <img class="cc" :src="require('@/assets/img/superpeso/法律.png')" />
        <div class="title">Legal</div>
        <div class="items">
          <div @click="goTerms">términos de servicio</div>
          <div @click="goPrivacy">políticas de privacidad</div>
        </div>
      </div>
    </div>

    <div class="submit">
      <button class="submit-btn" @click="logout">Cerrar sesión</button>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: true,
      title: 'Configuración',
    });
  },
  data() {
    return {
      hasPassword: 0,
      showLegal: false,
    };
  },
  async mounted() {
    this.setEventTrackStartTime();

    try {
      let data = await this.$http.post(`/api/user/info`);
      this.hasPassword = !!data.data.password;
    } catch (error) {}
  },
};
</script>

<style lang="scss" scoped>
.settings {
  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    .submit-btn {
      width: 343px;
      height: 48px;
      background: #ff4b3f;
      border-radius: 24px;
      margin: 24px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-family: Roboto-Bold, Roboto;
      font-weight: bold;
      color: #ffffff;
      border: none;
      line-height: 24px;
    }
  }
  .legal-modal {
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;

    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px 0;
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      background: #fff;
      line-height: 24px;
      width: 327px;
      box-sizing: border-box;
      border-radius: 8px;
      .cc {
        margin-top: -100px;
      }

      .title {
        font-size: 18px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #333333;
        line-height: 24px;
        margin-bottom: 36px;
        margin-top: 10px;
        text-align: center;
      }

      .items {
        text-align: center;
        margin: auto 16px;
        > div {
          font-size: 14px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #000000;
          line-height: 20px;
          border-bottom: 1px solid #cccccc;
          padding-bottom: 16px;
          margin-bottom: 16px;
          &:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
        }
      }

      .close {
        position: absolute;
        top: -18px;
        right: 18px;
      }
    }
  }
  .btn {
    position: relative;
    margin: 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: 16px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 500;
    color: #333333;
    padding-bottom: 24px;
    margin-bottom: 24px;
    border-bottom: 1px solid #eee;
    line-height: 20px;
    &::after {
      position: absolute;
      content: ' ';
      width: 16px;
      height: 20px;
      top: 50%;
      transform: translateY(-50%);
      right: 0px;
      background-image: url(../assets/img/superpeso/右大.png);
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
}
</style>
