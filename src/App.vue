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
        <van-tabbar-item replace to="/home">
          <span>Loans</span>
          <template #icon="props">
            <m-icon :type="props.active ? 'handy/Loans点击@2x' : 'handy/Loans未点击@2x'" class="nav-icon" :width="24" :height="24" />
          </template>
        </van-tabbar-item>

        <van-tabbar-item replace to="/repayment" badge="5">
          <span>Repayment</span>
          <template #icon="props">
            <m-icon :type="props.active ? 'handy/Repayment点击@2x' : 'handy/Repayment未点击@2x'" class="nav-icon" :width="22" :height="24" />
          </template>
        </van-tabbar-item>

        <van-tabbar-item replace to="/mine">
          <span>Me</span>
          <template #icon="props">
            <m-icon :type="props.active ? 'handy/我的点击@2x' : 'handy/我的未点击@2x'" class="nav-icon" :width="22" :height="24" />
          </template>
        </van-tabbar-item>
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
    return {
      showNav: false, // 是否要显示底部tabbar
      showRedirect: false,
    };
  },
  mounted() {
    setTimeout(res => {
      this.getUserInfo();
    }, 500);
  },
  watch: {
    $route(to, from) {
      document.body.style.overflow = '';
      document.title = to.meta.title || '';
      // this.toAppMethod('needBackControl', { need: false });
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
