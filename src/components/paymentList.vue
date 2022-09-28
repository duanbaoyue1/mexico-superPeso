<template>
			<!-- 支付弹窗 -->
			<div id="paymentList">
			<el-dialog :before-close="handleClosePayDialog" title="支付详情" :visible.sync="showPayInfo" width="650px"
				top="5vh" center>
				<div v-loading="loadPayInfoDialog">
					<div style="height: 35px;padding: 18px;">
						<div style="display: flex;position: relative;margin: 0;float: left;">
							<img width="50" height="50" :src="payInfo.imgurl2" />
							<div style="position: relative;padding-left: 10px;">
								<p style="font-size: 20px;color: #1E1E1E;line-height: 28px;margin: 0px;">
									{{payInfo.showname}}
								</p>
								<p
									style="font-size: 14px;font-weight: 400;color: #666666;line-height: 20px;margin: 0px;">
									{{payInfo.brief}}
								</p>
							</div>
						</div>
						<el-button style="float: right;margin: 0;line-height: 28px;padding: 0;" type="text">
							<el-link style="font-size: 18px;font-weight: 500;line-height: 28px;color: #409EFF;"
								href="https://wpa.qq.com/msgrd?v=3&uin=641680356&site=qq&menu=yes" target="_blank"
								:underline="false">联系QQ客服：641680356</el-link>
						</el-button>
					</div>
					<div style="padding: 18px;">
						<div style="width: 370px;margin: 0px auto;">
							<div v-for="(item, index) in clickProduct.data" :key="item.id"
								:class="{'pay-list' : true, 'checked': index == clickPayListIndex}"
								@click="clickPayList(index)">
								<span
									style="margin-left: 20px;width: 170px;display: inline-block;font-size: 16px;font-weight: 600;color: #E4434D;line-height: 40px;">￥{{item.price/100}}/{{item.name}}</span>
								<span
									style="font-size: 14px;font-weight: 400;color: #817F7F;line-height: 40px;">￥{{(item.price/100/item.keepday).toFixed(0)}}/天</span>
							</div>
							<p style="margin-left: 0px;color: #E4434D;">如有疑问请拨打客服电话：15317952961</p>
							<div style="display: flex;">
								<div @click="clickPayWay(0)" :class="{'active': payInfoIndex == 0}"
									style="cursor: pointer;border: 1px solid #C5C5C5;padding: 10px;margin: 18px 0px;height: 25px;display: flex;">
									<img width="25" height="25" src="../assets/img/web/wxpay.png">
									<p style="margin: 0px 10px;line-height: 25px;">微信支付</p>
								</div>
								<div @click="clickPayWay(1)"
									:class="{'active': payInfoIndex == 1, 'dont-support-pay':false}"
									style="cursor: pointer;border: 1px solid #C5C5C5;padding: 10px;margin: 18px 36px;height: 25px;display: flex;">
									<img width="25" height="25" src="../assets/img/web/zfbpay.png">
									<p style="margin: 0px 10px;line-height: 25px;">支 付 宝</p>
								</div>
							</div>
						</div>
						<div v-show="payInfoIndex == 0">
							<div class="bg-blue" style="padding: 10px 18px;">
								<div id="wxPayUrlImg" ref="wxPayUrlImg" style="display: inline-block;height: 200px;width: 200px;margin-left: 80px;"></div>
								<img width="180" height="180" style="margin-left: 10px;"
									src="../assets/img/web/wxsaoyisao2.png"> <br>
								<img width="100" height="30" style="margin-top: 15px;margin-left: 130px;"
									src="../assets/img/web/wxsaoyisao.png">
							</div>
						</div>
						<div v-show="payInfoIndex == 1">
							<div class="bg-blue" style="padding: 10px 18px;">
								<div id="aliPayUrlImg" ref="aliPayUrlImg"	style="display: inline-block;height: 200px;width: 200px;margin-left: 80px;"></div>
								<img width="180" height="180" style="margin-left: 10px;"
									src="../assets/img/web/zfbsaoyisao2.png"> <br>
								<img width="100" height="30" style="margin-top: 15px;margin-left: 130px;"
									src="../assets/img/web/zfbsaoyisao.png">
							</div>
						</div>
					</div>
				</div>
			</el-dialog>
			</div>

</template>

<script>
  import $ from 'jquery'
  import axios from 'axios';
  import QRCode from 'qrcodejs2'
  import lf1 from '../assets/img/web/ddht.png'
  import lf2 from '../assets/img/web/qsht.png'
  import lf3 from '../assets/img/web/qslj.png'
  export default{
    data(){
      return{
        loadPayInfoDialog: false,
        products: [],
        showPayInfo: false,
        payInfoIndex: 0,
        payInfo: {},
        clickPayListIndex: 0,
        clickProduct: {},
        brief: {
          "21": "涨停回调低吸，博弈后期大涨",
          "22": "强势大阳回踩，博弈后续拉升",
          "23": "主力逆势吸筹，情绪回暖节点"
        },
        imgurl2: {
          "21": lf1,
          "22": lf2,
          "23": lf3
        },
        originalProducts: [{
          "type": "21",
          "showname": "大单回调策略",
          "data": [{
            "id": 20,
            "price": 1188800,
            "name": "1年",
            "keepday": 370
          }, {
            "id": 28,
            "price": 768800,
            "name": "6个月",
            "keepday": 186
          }, {
            "id": 29,
            "price": 468800,
            "name": "3个月",
            "keepday": 93
          }, {
            "id": 30,
            "price": 168800,
            "name": "1个月",
            "keepday": 31
          }]
        },{
          "type": "22",
          "showname": "强势回调策略",
          "data": [{
            "id": 20,
            "price": 1058800,
            "name": "1年",
            "keepday": 370
          }, {
            "id": 28,
            "price": 668800,
            "name": "6个月",
            "keepday": 186
          }, {
            "id": 29,
            "price": 368800,
            "name": "3个月",
            "keepday": 93
          }, {
            "id": 30,
            "price": 158800,
            "name": "1个月",
            "keepday": 31
          }]
        },{
          "type": "23",
          "showname": "潜水捞金策略",
          "data": [{
            "id": 20,
            "price": 888800,
            "name": "1年",
            "keepday": 370
          }, {
            "id": 28,
            "price": 568800,
            "name": "6个月",
            "keepday": 186
          }, {
            "id": 29,
            "price": 298800,
            "name": "3个月",
            "keepday": 93
          }, {
            "id": 30,
            "price": 138800,
            "name": "1个月",
            "keepday": 31
          }]
        }],
        payQueryInterval : 0,
      }
    },
    computed: {

    },
    props: {
      type: {
        default: ""
      }
    },
    created() {
      this.resetProduct();
    },
    methods:{
      clickPayList(index) {
        this.clickPayListIndex = index;
        this.getPayInfo();
      },
      handleClosePayDialog(done) {
        this.stopPayQueryInterval();
        this.showPayInfo = false
        done();
      },
      clickPayWay(index) {
        this.payInfoIndex = index;
      },
      // 分时大单回调是0
      showPayInfoDialog() {
        console.log(this.type)
        let index = ""
        if (this.type == '21') { // 分时大单回调
          index = 0
        } else if (this.type == '22') { // 强势回调策略
          index = 1
        } else if (this.type == '23') { // 潜水捞金策略
          index = 2
        }
         axios({
          method: "POST",
          url: "/userreg/ucenter/queryUsername",
        }).then(res => {
            let resp = res.data
            if (resp.code && resp.code == 200) {
              this.payInfoIndex = 0;
              this.clickPayListIndex = 0;
              this.showPayInfo = true;
              this.clickProduct = this.products[index];
              console.log(this.products,this.clickProduct,111111)
              this.getPayInfo();
          } else {
            this.$message.error(resp.message);
          }
        })
      },
      getPayInfo() {
        console.log(this.clickProduct)
        this.loadPayInfoDialog = true;
        axios({
          method: 'POST',
          url: "/userreg/ucenter/payInfo?id=" + this.clickProduct.data[this.clickPayListIndex].id,
          }).then(res => {
            let resp = res.data
            if (resp.code && resp.code == 200) {
              this.payInfo = resp.data;
              this.payInfo.brief = this.brief[this.payInfo.type];
              this.payInfo.imgurl2 = this.imgurl2[this.payInfo.type];
              $("#wxPayUrlImg").html("");
              new QRCode(this.$refs.wxPayUrlImg,{
                width: 200,
                height: 200,
                text: this.payInfo.wxPayUrl
              });
              $("#aliPayUrlImg").html("");
              new QRCode(this.$refs.aliPayUrlImg,{
                width: 200,
                height: 200,
                text: this.payInfo.aliPayUrl
              });
              this.startPayQueryInterval();
              this.loadPayInfoDialog = false;
            } else {
              this.$message.error(resp.msg || '获取支付信息失败，请联系客服人员。');
            }
          }).catch(err => {
            console.log(err);
            this.$message.error('获取支付信息失败，请联系客服人员。');
          })
      },
      stopPayQueryInterval() {
        // 清除定时查询支付任务
        if (this.payQueryInterval != 0) {
          clearInterval(this.payQueryInterval);
          this.payQueryInterval = 0;
        }
      },
      startPayQueryInterval() {
        this.stopPayQueryInterval();
        this.payQueryInterval = setInterval(() => {
          this.wxPayQuery();
          this.aliPayQuery();
        }, 5 * 1000);
      },
      wxPayQuery() {
        axios({
          method: 'POST',
          url: "/userreg/ucenter/payQuery?tradeno=" + this.payInfo.wxtradeno,
          dataType: "json",
          }).then(res => {
            let resp = res.data
            if (resp.state && resp.state == "ok" && resp.success) {
              this.showPayInfo = false
              // 支付成功
              this.$message({
                message: '支付成功。',
                type: 'success'
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
        }).catch(err => {
          console.log(err);
        })
      },
      aliPayQuery() {
        axios({
          method: 'POST',
          url: "/userreg/ucenter/payQuery?tradeno=" + this.payInfo.alitradeno,
          dataType: "json",
          }).then(res => {
            let resp = res.data
            if (resp.state && resp.state == "ok" && resp.success) {
              this.showPayInfo = false
              // 支付成功
              this.$message({
                message: '支付成功。',
                type: 'success'
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
        }).catch(err => {
          console.log(err);
        })
      },
      resetProduct() {
        axios({
          method: "get",
          url: "/userreg/user/getProductsByType",
        }).then(res => {
            let resp = res.data
            let ddht = [] // 大单回调
            let csht = [] // 强势回调
            let qslj = [] // 潜水捞金
            if (resp.data) {
              resp.data.forEach((item)=>{
                if (item.showname == '大单回调') {
                  ddht.push(item)
                } else if (item.showname == '强势回调') {
                  csht.push(item)
                } else if (item.showname == '潜水捞金') {
                  qslj.push(item)
                }
              })
              let arr = JSON.parse(JSON.stringify(this.originalProducts))
              arr[0].data = ddht
              arr[1].data = csht
              arr[2].data = qslj
              this.originalProducts = arr
              let products = [];
              for (let i = 0; i < this.originalProducts.length; i++) {
                let product = this.originalProducts[i];
                product.brief = this.brief[product.type];
                products.push(product)
              }
              this.products = products;
            }
        })
      },
    }
  }
</script>

<style>
#paymentList {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
}
/* 导航+支付弹窗 */
#paymentList div.active {
	border: 1px solid #E3B07F !important;
	background-image: url("/static/img/pay/pay-checked.png");
	background-repeat: no-repeat;
	background-size: 30px;
	background-position: right bottom;
  background: #fff;
}

#paymentList .dont-support-pay {
	cursor: not-allowed !important;
	background-color: #CCCCCC;
}

#paymentList .pay-list {
	margin-bottom: 15px;
  height: 41px;
  border: 1px solid #E9EAEC;
  cursor: pointer;
  vertical-align: middle;
}
#paymentList .pay-list img {
  vertical-align: middle;
  margin-left: 15px;
}
#paymentList .pay-list span {
  line-height: 41px;
}
#paymentList .pay-list.checked {
	border: 1px solid #C83B2F;
}
#paymentList .pay-list .one {
  margin-right: 18px;
}
#paymentList .pay-list .money {
  float: right;
  margin-right: 37px;
}
#paymentList .el-dialog__body {
	padding: 0px !important;
}

#paymentList .el-dialog__body p {
	font-size: 14px;
	line-height: 18px;
	margin: 10px;
	font-weight: 600;
}

#paymentList .title_img {
	width: 25%;
}

#paymentList .text_part {
	width: 100%;
}

#paymentList .img_part {
	justify-content: flex-end;
}

#paymentList .img_part img {
	height: 50%;
	margin-left: 2%;
}

#paymentList .no_pay_img {
	width: 20%;
	margin: 5% 5% 23% 5%;
}

#paymentList .div-header {
	width: 100%;
	height: 66px;
	background-color: #3A3C46;
}

#paymentList .el-menu {
	border-bottom: solid 0px #e6e6e6 !important;
	height: 66px;
}

#paymentList .el-menu li,
#paymentList .el-menu a,
#paymentList .el-menu .el-submenu__title {
	font-size: 18px !important;
	font-weight: 400 !important;
	color: #FFFFFF !important;
	line-height: 66px !important;
	height: 66px !important;
}

#paymentList .el-menu li:hover,
#paymentList .el-menu .el-submenu__title:hover {
	background-color: #d10213 !important;
}

#paymentList .el-menu--collapse .el-menu .el-submenu,
#paymentList .el-menu--popup {
	min-width: 150px;
}

#paymentList .right-btn {
	float: right;
	margin-right: 118px;
	align-items: center;
	display: flex;
	height: 100%;
}
#paymentList .title {
  width: 100%;
  margin: 0 auto;
  padding-bottom: 30px;
  background-image: linear-gradient(#2C3545, #0C0F13);
}
#paymentList .title span {
  font-size: 18px;
  line-height: 25px;
  color: #fff;
  display: block;
  width: 500px;
  margin: 0 auto;
}
</style>
