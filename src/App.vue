<template>
  <div id="app">
    <div v-if="!isAppChecked" class="app-error">error!</div>
    <router-view v-else />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'app',
  computed: {
    ...mapState(['isAppChecked']),
  },
  mounted() {
    
  },
  watch: {
    $route(to, from) {
      document.body.style.overflow = '';
      document.title = to.meta.title || '';
      this.checkAndSetAppLocal();
      if (to.query.token) {
        this.updateToken(to.query.token);
      }
      if (to.query.appChecked) {
        this.setAppChecked(true);
      } else {
        this.checkInApp();
      }
    },
  },
  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),
    checkAndSetAppLocal() {
      let appLocal = localStorage.getItem('app-local');
      if (appLocal) {
        this.setAppGlobal(JSON.parse(appLocal));
      }
    },

    checkInApp() {
      if (process.env.NODE_ENV != 'production') {
        return;
      }
      let appCheckTimeout = setTimeout(() => {
        this.setAppChecked(false);
      }, 2000);
      let that = this;
      window.appValidate = function (appGlobal) {
        if (typeof appGlobal === 'string') {
          appGlobal = JSON.parse(appGlobal);
        }
        console.log('set app global', appGlobal);
        that.setAppGlobal(appGlobal);
        clearTimeout(appCheckTimeout);
        that.setAppChecked(true);
        // 可能token已经更新，需要重新获取一次
        that.getUserInfo();
      };
    },
  },
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
}
.app-error {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.7);
  &-content {
    background: #ffffff;
    border-radius: 24px;
    line-height: 24px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    position: relative;
  }
}
</style>
