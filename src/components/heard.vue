<template>
  <div class="wy_w_100p wy_h_100p">
    <!-- 导航 -->
    <div class="div-header">
      <div style="width: 200px; margin-left: 118px; margin-right: 30px; align-items: center; display: flex; height: 100%; float: left">
        <el-link href="/" :underline="false"><img :src="require('@/assets/img/web/logo.png')" style="width: 100%" height="34" /></el-link>
      </div>
      <div class="right-btn">
        <el-button style="padding: 10px 18px; font-size: 18px; color: #ffffff; background: linear-gradient(90deg, #f9e2c6 0%, #e1ad7b 100%)" size="mini" round>
          <el-link style="font-size: 18px; color: #361e1e" href="/pay/" :underline="false">VIP会员</el-link>
        </el-button>
        <el-button v-show="username == ''" style="padding: 10px 18px; font-size: 18px; color: #ffffff; background-color: #a8343b" @click="toLogin" size="mini" round>登录/注册</el-button>
        <div v-show="username != ''" style="display: flex; align-items: center">
          <p style="font-size: 18px; color: #ffffff; margin: 0px 18px">
            欢迎您：<el-link href="/userreg/ucenter/product" style="font-size: 18px" type="danger">{{ username }} </el-link>
          </p>
          <el-button @click="logout" style="padding: 10px 18px; font-size: 18px; color: #ffffff; background-color: #a8343b" size="mini" round> 退出</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import '../assets/css/index.css';
export default {
  data() {
    return {
      username: '',
    };
  },
  props: {},
  mounted() {
    this.inti();
  },
  methods: {
    inti() {
      axios({
        method: 'post',
        url: '/userreg/ucenter/queryUsername',
      }).then((re) => {
        let res = re.data;
        if (res.code && res.code == 200) {
          this.username = res.data;
        }
      });
    },

    // 退出登录
    logout() {
      let csrf_token = this.getCookie('csrf_token');
      this.delCookie('login_token');
      axios({
        method: 'post',
        url: '/userreg/ucenter/doLogout?csrf_token=' + csrf_token,
      }).then((re) => {
        window.location.reload();
      });
    },
    toLogin() {
      this.$parent.toBuyP();
    },
  },
};
</script>
<style>
.div-header {
  width: 100%;
  height: 66px;
  background-color: #3a3c46;
}
.right-btn {
  float: right;
  margin-right: 118px;
  align-items: center;
  display: flex;
  height: 100%;
}
</style>
