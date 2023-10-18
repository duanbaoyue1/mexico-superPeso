<template>
  <div class="loan content-area">
    <div class="loan-tips">
      <m-icon class="icon" type="superpeso/失败" :width="56" :height="56" />
      <div class="title">
        Error de transferencia
        <div>Hubo un error en la transferencia de reembolso.Por favor, asegúrese de tener suficiente saldo en su cuenta bancaria</div>
      </div>
      <div class="apply" @click="goHome">Por favor, inténtalo de nuevo.</div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Solicitud de préstamo',
    });
  },
};
</script>

<style lang="scss" scoped>
.loan {
  .loan-tips {
    padding-top: 40px;
    .icon {
      margin: 0 auto;
    }
    .title {
      margin-top: 30px;
      font-size: 16px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 500;
      color: #2a303c;
      line-height: 20px;
      text-align: center;
      margin-bottom: 60px;
      padding-left: 16px;
      padding-right: 16px;

      div {
        font-size: 13px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #a7a7a7;
        line-height: 15px;
        margin-top: 10px;
      }
    }
    .apply {
      width: 343px;
      height: 48px;
      background: #416cef;
      border-radius: 8px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
    }
  }
}
</style>
