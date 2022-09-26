<template>
  <div class="wy_w_100p wy_h_100p">
    <div class="login_class wy_flex" :class="{'login-d':logShow,'login-z':!logShow}">
      <div class="wy_w_70p login_left">
        <div class="login_text wy_text_left">
          <div class="wy_font_wei_bold wy_font_size_44">舞阳交易服务</div>
          <div class="title_content">为私募&高净值人群量身定制 <br>
            新一代投资决策与高端服务体系 <br>
            舞阳金融量化团队与500+位资深记者联合打造 <br>
            强大的投资资讯获取与深度数据分析能力</div>
        </div>
      </div>
      <div class="wy_w_30p login_right">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">登录</el-menu-item>
          <el-menu-item index="2">注册</el-menu-item>
        </el-menu>
        <!-- 登录 -->
        <div v-show="logShow" class="login-denglu">
          <hr class="hr_class">
          <div class="wy_text_left wy_font_size_16 wy_color_fff">
            手机号
            <div>
              <el-input type="text" class="loginInput" v-model="phone" @keyup.enter.native="loginFun"></el-input>
            </div>
          </div>
          <div class="wy_text_left wy_font_size_16 wy_color_fff">
            密码
            <div>
              <el-input type="password" class="loginInput" v-model="password" @keyup.enter.native="loginFun"></el-input>
            </div>
          </div>
          <div class="wy_text_left wy_mar_top_15 wy_color_fff">
            <el-checkbox v-model="checkedPhone">记住用户</el-checkbox>
            <!-- <el-checkbox v-model="checkedPwd">记住密码</el-checkbox> -->
          </div>
          <div class="wy_text_left login_button wy_color_fff">
            <el-button type="primary" @click="loginFun">登录</el-button>
          </div>
        </div>
        <!-- 注册 -->
        <div v-show="registerShow" class="wy_mar_top_5">
          <!-- <hr class="hr_class"> -->
          <div class="wy_text_left wy_font_size_15 wy_color_fff">
            手机号
            <div>
              <el-input type="text" class="loginInput" v-model="formMess.phone"></el-input>
            </div>
          </div>
          <div class="wy_text_left wy_font_size_15 wy_color_fff">
            手机验证码
            <div class="code_part">
              <el-input type="text" class="codeInput" v-model="formMess.sms_code"></el-input>
              <el-button class="sms-button" v-html="sms_text" @click="doGetSmsCode"></el-button>
            </div>
          </div>
          <div class="wy_text_left wy_font_size_15 wy_color_fff">
            密码
            <div>
              <el-input type="password" class="loginInput" v-model="formMess.pwd"></el-input>
            </div>
          </div>
          <div class="wy_text_left wy_font_size_15 wy_color_fff">
            确认密码
            <div>
              <el-input type="password" class="loginInput" v-model="formMess.confirmPwd"></el-input>
            </div>
          </div>
          <div class="wy_text_left wy_font_size_15 wy_color_fff">
            用户类型
            <div class="loginSelect">
              <el-select v-model="formMess.investortype">
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="wy_text_left wy_font_size_15 wy_color_fff">
            注册码
            <div>
              <el-input type="text" class="loginInput" v-model="formMess.regc"></el-input>
            </div>
          </div>
          <div class="wy_text_left login_button wy_color_fff">
            <el-button type="primary" @click="registerFun">注册</el-button>
          </div>
        </div>

      </div>
    </div>
    <div class="mask_class" @click="mask"></div>
  </div>
</template>

<script>
  import '../assets/css/index.css';
  var canClickSms = true;
  var timeInterval = null;
  var timeLimit = 60;
  import axios from 'axios';
  export default {
    data() {
      return {
        // 登录提交内容
        phone: "",
        password: "",
        //menu菜单选中值
        activeIndex: '1',
        // 注册提交内容
        formMess: {
          phone: "",
          sms_code: "",
          pwd: "",
          confirmPwd: "",
          regc:"NQ==",
          investortype: '',
        },
        options: [{
          name:'获取验证码',
          code:2
        }],
        sms_text: "获取验证码",
        logShow: true, //登录
        registerShow: false, //注册
        checkedPhone: true,
        url: ''
        // checkedPwd: true

      }
    },
    props:{
      show: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      var self = this;
      if (process.env.NODE_ENV == 'development') {
        this.url = 'http://www.clswy.cn'
      }
      //初始化读取cookie中的账号信息，如果有accountInfo，说明该用户之前勾选了记住密码的功能，就自动填上账号密码
      self.loadAccountInfo();
      this.getUserType()
    },
    methods: {
      // menu菜单切换
      handleSelect(index) {
        var self = this;
        if (index == 1) {
          self.logShow = true
          self.registerShow = false
        } else if (index == 2) {
          self.logShow = false
          self.registerShow = true
        }
      },
      // 获取用户类型
      getUserType() {
        axios({
          url:this.url + '/userreg/user/getUserType',
          method: "post",
        }).then(re => {
          let res = re.data
          if (res.state =='ok') {
            this.options = res.data
          }
        }).catch(err => {
        })
      },
      // 点击登录向接口发送数据(user+pwd) 判断是否存在此用户是否可以登录
      loginFun() {
        // console.log("要登录啦");
        var self = this;
        // request payload改为 form data  https://juejin.cn/post/6844903779377086478
        var obj = "user=" + self.phone + "&pwd=" + self.password;
        var accountInfoPhone = self.phone;
        // var accountInfoPwd = self.password;
        axios({
          url: this.url  + "/userreg/user/doLogin?",
          // url: "/rest/userreg/user/doLogin",
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset:UTF-8"
          },
          data: obj,
        }).then(re => {
          let res = re.data
          if (res.state == "fail") {
            this.$message.warning(res.message);
          } else {
            // 判断是否勾选记住密码,如果勾选,将手机号+密码写入cookie
            if (self.checkedPhone == true) {
              console.log("勾选了记住用户，现在开始写入cookie");
              self.$cookieFun.setCookie("accountInfoPhone", accountInfoPhone, "d30");
              // self.$cookieFun.setCookie("accountInfoPwd", accountInfoPwd, "d30");
            } else {
              console.log("没有勾选记住用户，现在开始删除账号cookie");
              self.$cookieFun.delCookie('accountInfoPhone');
              // self.$cookieFun.delCookie('accountInfoPwd');
            }
            // self.reload(); // 负责重新加载页面. 这种刷新页面不可以对cookie进行修改 所以这种不可以
            location.reload(); // 使用这种使整个页面进行加载 虽然缺点使短暂的空白 但cookie可以修改

          }
        }).catch(err => {
          console.log(err);
        })
      },

      // 发送验证码之后
      timeFunc() {
        var self = this;
        if (!timeInterval) {
          return;
        }
        if (timeLimit <= 0) {
          clearInterval(timeInterval);
          self.sms_text = "获取验证码";
          canClickSms = true;
          return;
        }
        self.sms_text = timeLimit + "秒后重发";
        timeLimit--;
      },
      // 确认是否能发送验证码
      doGetSmsCode() {
        var self = this;
        if (!canClickSms) {
          return;
        }
        canClickSms = false;
        // console.log(self.formMess.phone);
        if (self.formMess.phone == '') {
          // alert('手机号不能为空!');
          this.$message.warning('手机号不能为空');
          canClickSms = true;
          return;
        }
        axios({
          url: this.url + "/userreg/commons/getsmscode?phone=" + self.formMess.phone,
          method: "post",
        }).then(re => {
          let res = re.data
          // alert(res.message);
          this.$message.success('res.message');
          if (res.message == "短信发送成功，请手机查看") {
            timeLimit = 60;
            timeInterval = setInterval(() => {
              self.timeFunc();

            }, 1000);
          } else {
            canClickSms = true;
          }
        }).catch(err => {
          console.log(err);
          canClickSms = true;
        })

      },
      // 点击注册 向接口发送数据 （注意要转换成formData格式）
      registerFun() {
        var self = this;
        if(self.formMess.regc == ""){
          self.formMess.regc = "NQ==";
        }
        if (self.formMess.phone == '') {
          this.$message.warning("手机号不能为空!");
          return;
        }
        if (self.formMess.sms_code == '') {
          this.$message.warning("手机验证码不能为空!");
          return;
        }
        if (self.formMess.pwd == '') {
          this.$message.warning("密码不能为空!");
          return;
        }
        if (self.formMess.confirmPwd == '') {
          this.$message.warning("重复密码不能为空!");
          return;
        }
        if (self.formMess.investortype == '') {
          this.$message.warning("用户类型不能为空!");
          return;
        }
        let param = "phone=" + self.formMess.phone + "&sms_code=" + self.formMess.sms_code + "&pwd=" + self.formMess.pwd +
          "&confirmPwd=" + self.formMess.confirmPwd + "&regc=" + self.formMess.regc + "&investortype="+this.formMess.investortype;
         axios({
          url: this.url  + "/userreg/user/doRegister?",
          method: "post",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset:UTF-8"
          },
          data: param
        }).then(re => {
          let res = re.data
          console.log(res.state);
          if (res.state == "fail") {
            // alert(res.message)
            this.$message.warning(res.message);
          } else {
            // console.log("注册成功!");
            this.$message.success("注册成功,去登录吧! ");
            // 投研工具引用loginA注册的时候直接返回首页
            self.registerShow = false;
            self.activeIndex = "1";
            self.logShow = true;
          }

        }).catch(err => {
          console.log(err);
        })

      },
      // 点击mask关闭登录框
      mask() {
        this.$parent.loginShow = false;
      },
      // 点击关闭按钮 关闭登录框
      cancel() {
        console.log("111");
        this.$parent.loginShow = false;
      },
      rememberPwd(e) {
        console.log("记住密码" + this.checkedPwd);
      },
      loadAccountInfo() {
        let self = this;
        let accountInfoPhone = self.$cookieFun.getCookie('accountInfoPhone');
        // let accountInfoPwd = self.$cookieFun.getCookie('accountInfoPwd');
        // console.log(accountInfoPhone,accountInfoPwd);
        if (Boolean(accountInfoPhone) == true) {
          console.log('cookie中检测到账号信息！现在开始预填写！');
          self.phone = accountInfoPhone;
          // self.password = accountInfoPwd;
          self.checkedPwd = true;
        }
      },

    }
  }
</script>

<style>
  /* 登录css */
  .login_class {
    position: fixed;
    width: 60%;
    height: auto;
    /* border: 1px solid white; */
    /* border-radius: 80px 0px 80px 0px; */
    left: 20%;
    top: 10%;
    /* background-color: #101523; */
    background-image: url(../assets/img/loginMap.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: 99;
  }
  .login-z {
    height: 540px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .login-d {
    height: 350px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  /* 左侧css开始 */
  .login_left {
    position: relative;
    border-radius: 80px 0px 0px 0px;
    /* background-color: #2b3a5f */
  }

  .title_content {
    font-size: 16px;
    font-family: AlibabaPuHuiTiR;
    color: #b3b3b3;
    line-height: 25px;
    margin-top: 10px;
  }

  .login_text {
    position: absolute;
    top: 35%;
    left: 10%;
    color:#fff
  }
  .login-denglu {
    color: #fff;
  }

  /* 右侧css开始 */
  .login_right {
    /* margin-top: 3.125rem; */
    padding: 20px 5px 15px 25px;
    /* background-color: #28324C; */
    background: linear-gradient(180deg, rgba(40, 50, 76, 0.2) 0%, #0C101D 100%);
  }

  .cancel {
    position: absolute;
    top: 6px;
    right: 13px;
    font-size: 29px;
    color: white;
    z-index: 999;
  }

  .hr_class {
    height: 1px;
    background: #212223;
    margin: 15px 0 15px 10%;
    width: 80%;
    border: none;
  }

  .loginInput {
    /* width: 280px; */
    width: 85% !important;
    height: 40px;
    margin-bottom: 5px;
  }

  .loginInput input {
    background: #FBA129;
    color: black;
    padding-right: 30px;
    font-size: 16px;
    height: 40px;
    border:none
  }
  .loginSelect input {
    background: #FBA129;
    color: black;
    border:none
  }
  .loginSelect{
    padding-right: 30px;
    font-size: 16px;
    height: 40px;
    width: 85% !important;
    margin-bottom: 5px;
  }
  .loginSelect input::placeholder {
    color: black;
  }
  .loginInput input:hover {
    border-style: solid;
    border-color: #000;
  }

  .loginInput input:focus {
    border-style: solid;
    border-color: #000;
  }

  .loginInput input::-webkit-input-placeholder {
    color: black;
    font-weight: 600;
  }

  .login_button {
    margin-top: 20PX;
  }

  .login_button button {
    /* width: 140px;
    height: 45px; */
    width: 85%;
    height: 40px;
    background-color: #404040;
    color: white;
    outline: none;
    border: none;
  }

  .login_button button:hover {
    background-color: #e68f28;
  }

  /* mask */
  .mask_class {
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background-color: #fff; */
    /* color: white; */
    /* border: 5px solid white; */
    z-index: 9;
  }

  /* menu菜单 */
  .login_right .el-menu {
    background-color: transparent;
    /* padding-left: 52px; */
    margin-left: 15%;
  }
  
  .login_right .el-menu--horizontal>.el-menu-item {
    font-size: 16px;
    color: #fff !important;
    width: 40%;
    height: 47px !important;
    line-height: 47px !important;
  }

  .login_right .el-menu.el-menu--horizontal {
    border-bottom: none !important;
  }

  .login_right .el-menu--horizontal>.el-menu-item.is-active {
    border-bottom: 2px solid #e68f28;
    color: #fff !important;
  }

  .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
  .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
    background-color: transparent !important;
  }

  /* 验证码 */
  .code_part {
    display: flex;
    justify-content: space-between;
    width: 85%;
  }

  .codeInput {
    /* width: 7.5rem !important; */
    width: 40% !important;
    border:none
  }
  .codeInput input {
    border:none
  }
  .code_part button {
    background-color: #e68f28;
    /* font-size: 14px;*/
    font-size: 11px;
    padding: 0;
  }


  .sms-button {
    /* width: 7.5rem;*/
    width: 45%;
    background-color: #404040 !important;
    color: white !important;
    outline: none !important;
    border: none !important;
  }

  .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover {
    background-color: transparent !important;
  }

  /* 记住用户+记住密码单选框 */
  .wy_text_left .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #fff !important;
  }

  /*  .wy_text_left .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #e68f28 !important;
      border-color: #e68f28 !important;
  } */

  /* 手机号可输入下拉框 */
  .loginInput.el-input__suffix {
    right: 0px !important;
  }

  .wy_text_left .el-select .el-input .el-select__caret {
    color: #111 !important;
  }

  .wy_text_left .el-select .el-input.is-focus .el-input__inner {
    border-color: #e68f28 !important;
  }

  .wy_text_left .el-select:hover .el-input__inner {
    border-color: #e68f28 !important;
  }
</style>
