<template>
  <transition>
    <div v-show="show" class="message-container">
      <div class="container">
        <div class="icon" v-if="prop.iconPath">
          <m-icon :type="prop.iconPath" :width="50" :height="50" />
        </div>
        <div class="content" v-html="prop.content"></div>
        <div class="actions">
          <div class="confirm" v-if="prop.confirmBtnText" @click="prop.confirmCallback">
            {{ prop.confirmBtnText }}
          </div>
          <div class="cancel" v-if="prop.cancelBtnText" @click="prop.cancelCallback">
            {{ prop.cancelBtnText }}
          </div>
        </div>
        <div class="close" v-if="prop.showClose" @click="hideMessageBox">
          <m-icon type="message/close" :width="24" :height="24" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Message',
  computed: {
    ...mapState({
      show: (state) => state.messageBox.show,
      prop: (state) => state.messageBox.messageInfo,
    }),
  },
};
</script>

<style lang="scss" scoped>
// .v-enter-active,
// .v-leave-active {
//   transition: all 500ms;
// }

.v-enter-active {
  transition: all 500ms;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}

.message-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  .container {
    width: 320px;
    padding: 50px 20px 20px;
    background: #ffffff;
    border-radius: 24px;
    line-height: 24px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    position: relative;

    .icon {
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      background: #fff;
      border-radius: 100%;
      padding: 5px;
    }
    .close {
      position: absolute;
      bottom: -54px;
      left: 50%;
      transform: translateX(-50%);
    }
    .content {
      margin-bottom: 40px;
      font-size: 18px;
      font-weight: 400;
      color: #333333;
    }
    .actions {
      > div {
        width: 280px;
        height: 48px;
        background: #1143a4;
        border-radius: 14px;
        font-size: 18px;
        font-weight: 900;
        color: #ffffff;
        line-height: 24px;
        border: 1px solid #1143a4;
        display: flex;
        justify-content: center;
        align-items: center;
        &.cancel {
          border: 1px solid #1143a4;
          color: #1143a4;
          margin-top: 20px;
          background: #ffffff;
        }
      }
    }
  }
}
</style>
