<template>
  <div id="app">
    <div v-if="!isAppChecked" class="app-error">error!</div>
    <div v-else-if="showRedirect"></div>
    <div v-else class="app-inner" :class="{ 'has-tab': showNav }">
      <transition name="fade">
        <keep-alive v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件 -->
          <router-view id="view" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <!-- 这里是不被缓存的视图组件 -->
        <router-view v-if="!$route.meta.keepAlive" />
      </transition>

      <van-tabbar route name="fade" v-if="showNav">
        <van-tabbar-item replace to="/home" icon="home-o">Loans</van-tabbar-item>
        <van-tabbar-item replace to="/repayment" icon="search">Repayment</van-tabbar-item>
        <van-tabbar-item replace to="/mine" icon="search">Me</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
const NeedTabbarsPathNames = ['home', 'repayment', 'mine'];

export default {
  name: 'app',
  computed: {
    ...mapState(['isAppChecked']),
  },
  data() {
    window.updateData = async data => {
      // 上传抓取日志
      try {
        this.$http.post(`/api/userCollect/uploadCaptureLog`, {
          userId: '8101000010',
          appName: 'easyMoney',
          orderId: '1111111',
          type: '111',
          msg: data,
        });
      } catch (error) {
        console.error(error);
      }
    };

    return {
      showNav: false, // 是否要显示底部tabbar
      showRedirect: false,
    };
  },
  mounted() {},
  watch: {
    $route(to, from) {
      document.body.style.overflow = '';
      document.title = to.meta.title || '';
      this.toAppMethod('needBackControl', { need: false });
      this.showNav = NeedTabbarsPathNames.includes(to.name);
      try {
        this.hideLoading();
      } catch (error) {}
      this.checkAndSetAppLocal();
      if (to.query.nextUrl && from && from.name) {
        // 为了解决进到还款页面以后退出到utr页面的问题
        this.showRedirect = true;
        location.href = to.query.nextUrl;
      }
      if (to.query.token) {
        this.updateToken(to.query.token);
      }
      if (to.query.appChecked || sessionStorage.getItem('app-checked')) {
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
      };
    },
  },
};
</script>

<style lang="scss">
.has-tab {
  padding-bottom: 80px;
}

.fade-enter {
  opacity: 0;
}
.fade-leave {
  opacity: 1;
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 0s;
}
#app {
  > div {
    height: 100%;
  }
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
</style>
