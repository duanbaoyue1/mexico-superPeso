<template>
  <div id="mine" class="content-area">
    <div class="user">
      <img :src="require('@/assets/img/superpeso/头像.png')" />
      <span class="name">{{ userInfo.mobile | phoneHideFilter }}</span>
    </div>

    <div class="menu">
      <div @click="innerJump('order-list')">
        <div>
          <m-icon class="icon" type="superpeso/Pedido de préstamo" :width="24" :height="24" />
          Pedido de préstamo
        </div>
        <m-icon type="superpeso/向右" :width="8" :height="12" />
      </div>

      <div @click="innerJump('complete-bank', { from: 'mine' })" v-if="userInfo.remittanceAccountAuth">
        <div>
          <m-icon class="icon" type="superpeso/Tarjeta bancaria" :width="24" :height="24" />
          Tarjeta bancaria
        </div>
        <m-icon type="superpeso/向右" :width="8" :height="12" />
      </div>

      <div @click="goHelpCenter">
        <div>
          <m-icon class="icon" type="superpeso/Centro de ayuda" :width="24" :height="24" />
          Centro de ayuda
        </div>
        <m-icon type="superpeso/向右" :width="8" :height="12" />
      </div>

      <!-- <div @click="innerJump('about')">
        <div>
          <m-icon class="icon" type="superpeso/Permisos de la aplicación" :width="24" :height="24" />
          Permisos de la aplicación
        </div>
        <m-icon type="superpeso/向右" :width="8" :height="12" />
      </div> -->

      <div @click="innerJump('settings')">
        <div>
          <m-icon class="icon" type="superpeso/Set Up" :width="24" :height="24" />
          Configuración
        </div>
        <m-icon type="superpeso/向右" :width="8" :height="12" />
      </div>

      <div @click="showDeleteConfirm" v-if="isTestAccount">
        <div>
          <m-icon class="icon" type="superpeso/Delete Account" :width="24" :height="24" />
          Eliminar cuenta
        </div>
        <m-icon type="superpeso/向右" :width="8" :height="12" />
      </div>

      <!-- <div @click="logout">
        <div>
          <m-icon class="icon" type="superpeso/Delete Account" :width="24" :height="24" />
          Log Out
        </div>
        <m-icon type="superpeso/向右" :width="8" :height="12" />
      </div> -->
    </div>
  </div>
</template>
<script>
import eventTrack from '@/mixins/event-track.js';

export default {
  mixins: [eventTrack],
  created() {
    this.setTabBar({
      show: false,
    });
  },
  data() {
    return {
      isTestAccount: false, // 是否google测试账号
    };
  },
  async mounted() {
    document.body.style.backgroundColor = '#f9f9f9';
    try {
      let data = await this.$http.post(`/api/user/mine`);
      this.isTestAccount = data.data.isTestAccount;
    } catch (error) {}
  },
  activated() {
    this.updateData();
  },
  methods: {
    showDeleteConfirm() {
      this.showMessageBox({
        content: 'Después de eliminar la cuenta, se borrará toda la información de la cuenta, ¿confirmar para eliminar?',
        confirmBtnText: 'Déjame pensar de nuevo',
        cancelBtnText: 'Confirmar eliminación',
        confirmCallback: () => {
          this.hideMessageBox();
        },
        cancelCallback: () => {
          this.toAppMethod('inLoginPage');
        },
        iconPath: 'superpeso/编组 5',
      });
    },
    async updateData() {
      this.showLoading();
      try {
        await this.getUserInfo();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    goTestb() {
      this.innerJump('testb');
    },
    goDetail() {
      this.innerJump('order-detail');
    },
  },
};
</script>

<style lang="scss" scoped>
#mine {
  padding: 68px 16px 0;
  padding-bottom: 100px;
  background-image: url(../../assets/img/superpeso/个人主页.png);
  background-size: 375px 260px;
  background-position: top;
  background-repeat: no-repeat;

  .logout {
    width: 295px;
    height: 266px;
    background: #ffffff;
    border-radius: 8px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      margin-top: -25px;
    }
    .content {
      padding-top: 20px;
      font-size: 16px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      text-align: center;
      button {
        width: 247px;
        height: 40px;
        background: linear-gradient(180deg, #fe816f 0%, #fc2214 100%);
        box-shadow: 0px 4px 10px 0px #f7b5ae, inset 0px 1px 4px 0px #ffc7c0;
        border-radius: 20px;
        font-size: 16px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #ffffff;
        line-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        border: none;
        margin-top: 30px;
      }
    }
  }

  .menu {
    width: 343px;
    background: #ffffff;
    border-radius: 8px;
    padding: 0 16px;
    box-sizing: border-box;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 16px;
      padding-top: 16px;
      &:last-child {
        border-bottom: none;
      }

      > div {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        .icon {
          margin-right: 16px;
        }
      }
    }
  }

  .user {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 20px;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
    margin-bottom: 24px;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      margin-bottom: 8px;
    }
  }
}
</style>
