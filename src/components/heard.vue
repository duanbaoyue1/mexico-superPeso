<template>
  <div class="wy_w_100p wy_h_100p">
			<!-- 导航 -->
			<div class="div-header">
				<div
				style="width: 200px;margin-left: 118px;margin-right: 30px;align-items: center;display: flex;height: 100%;float: left;">
				<el-link href="/" :underline="false"><img :src="require('@/assets/img/web/logo.png')" style="width: 100%" height="34"></el-link>
				</div>
				<div class="right-btn">
					<el-button
						style="padding: 10px 18px;font-size: 18px;color: #FFFFFF;background: linear-gradient(90deg, #F9E2C6 0%, #E1AD7B 100%);"
						size="mini" round>
						<el-link style="font-size: 18px;color: #361E1E;" href="/pay/" :underline="false">VIP会员</el-link>
					</el-button>
					<el-button v-show="username == ''"
						style="padding: 10px 18px;font-size: 18px;color: #FFFFFF;background-color: #A8343B;"
						@click="toLogin" size="mini" round>登录/注册</el-button>
					<div v-show="username != ''" style="display: flex;align-items: center;">
						<p style="font-size: 18px;color: #FFFFFF;margin: 0px 18px;">欢迎您：<el-link
								href="/userreg/ucenter/product" style="font-size: 18px;" type="danger">{{username}}
							</el-link>
						</p>
						<el-button @click="logout"
							style="padding: 10px 18px;font-size: 18px;color: #FFFFFF;background-color: #A8343B;"
							size="mini" round>
							退出</el-button>
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
        username: ''

      }
    },
    props:{

    },
    mounted() {
      this.inti()
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
      getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        arr = document.cookie.match(reg)
        if (arr != null)
          return unescape(arr[2]);
        else
          return null;
      },
      delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
          document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
      },
      // 退出登录
      logout() {
        var self = this;
        let csrf_token = self.getCookie("csrf_token");
        self.delCookie("login_token");
         axios({
          method: 'post',
          url: '/userreg/ucenter/doLogout?csrf_token=' + csrf_token,
        }).then((re) => {
          window.location.reload()
        });
      },
      toLogin() {
        this.$parent.toBuyP()
      },
    }
  }
</script>
<style>
.div-header {
	width: 100%;
	height: 66px;
	background-color: #3A3C46;
}
.right-btn{
	float: right;
	margin-right: 118px;
	align-items: center;
	display: flex;
	height: 100%;
}
</style>

