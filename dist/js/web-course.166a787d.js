(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["web-course"],{b64b:function(t,e,i){var s=i("23e7"),n=i("7b0b"),o=i("df75"),a=i("d039"),c=a((function(){o(1)}));s({target:"Object",stat:!0,forced:c},{keys:function(t){return o(n(t))}})},b7f9:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"back"},[s("div",{staticClass:"top-header"},[s("div",{staticClass:"width-container"},[s("div",{staticClass:"pro-info"},[s("img",{staticClass:"img-name",attrs:{src:i("0a80")}}),s("div",{staticClass:"sub-title"},[t._v("实战培训教程")]),s("div",{staticClass:"pro-tips"},[t._v("课程详细讲解策略选股逻辑和技巧, 并通过赠送的策略选股工具 实战验证, 理论与实际结合!")])]),s("div",{staticClass:"buy-info"},[s("div",{attrs:{id:"price"}},[t._v("29800元/半年")]),t._m(0),s("div",{staticClass:"buy-btn",on:{click:t.toBuyP}},[t.bought?s("img",{attrs:{src:i("ce05")}}):s("img",{attrs:{src:i("0279")}})]),s("div",{staticClass:"learn-num"},[t._v("时长：38小时 学习人数: 133")])])])]),s("div",{staticClass:"content-area"},[s("ul",{staticClass:"tab-choose"},[s("li",{class:{active:0==t.curIndex},on:{click:function(e){t.curIndex=0}}},[t._v("课程介绍")]),s("li",{class:{active:1==t.curIndex},on:{click:function(e){t.curIndex=1}}},[t._v("视频目录")])]),s("div",{directives:[{name:"show",rawName:"v-show",value:0==t.curIndex,expression:"curIndex == 0"}]},[t._m(1),s("div",{staticClass:"course-module outline"},[s("header",[t._v("课程大纲")]),s("div",t._l(t.courses,(function(e){return s("div",{key:e.classType},[s("p",{staticClass:"course-title"},[t._v(" "+t._s(e.className)+" ")]),s("ul",t._l(e.videos,(function(e){return s("li",{key:e.id},[t._v(t._s(e.title))])})),0)])})),0)]),t._m(2)]),s("div",{directives:[{name:"show",rawName:"v-show",value:1==t.curIndex,expression:"curIndex == 1"}]},[s("div",{staticClass:"course-module outline-2"},[s("div",t._l(t.courses,(function(e){return s("div",{key:e.classType},[s("p",{staticClass:"course-title"},[t._v(" "+t._s(e.className)+" ")]),s("p",{staticClass:"desc"},[t._v(t._s(e.description))]),s("ul",t._l(e.videos,(function(e){return s("li",{key:e.id,on:{click:function(i){return t.playCourse(e)}}},[s("img",{attrs:{src:i("3f01")}}),t._v("视频："+t._s(e.title)),e.tryEnable?s("span",{staticClass:"try"},[t._v("试看")]):t._e()])})),0)])})),0)])]),s("pc-video-modal",{attrs:{initVideoIndex:t.initVideoIndex,videos:t.videos,showOneVideo:t.showOneVideo},on:{"close-play":t.closePlayVideo}})],1),t.loginShow?s("login",{ref:"login"}):t._e(),s("payment-List",{ref:"paymentList",attrs:{type:t.proId}})],1)},n=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"sub-buy"},[i("span",[t._v("赠")]),i("span",[t._v("全套量化策略选股工具一个月使用权")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"course-module"},[i("header",[t._v("课程简介")]),i("div",[i("div",[t._v("这是一套量化交易理论与实战结合的课程体系，视频培训与赠送的量化策略选股工具结合，学完马上在市场进行验证，加快课程的吸收，真正做到学以致用！华氏量化策略系统经过八年的研发，实际开发的策略有二十余种，本课程选择了其中最好的三个策略，对其策略的原理进行深度剖析，让普通投资者也能理解其中的选股逻辑。其中大单回调策略就有高胜率、止损空间小、盈利空间大的特点，是所有策略中最好的策略，经常出现连板票，并且是在龙头的上涨初期被抓取，学员可以通过策略选股工具的历史数据进行验证！")]),i("br"),i("div",[t._v("为让新手投资者更快的学会如何投资，本课程还包括基础且实用的教程体系。包括炒股软件的组合配置、软件关键功能的使用方法、分时买卖交易理论、日线分析理论、主力操盘实战分析、主力大单分析方法等等接地气的炒股技巧。")])])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"course-module"},[i("header",[t._v("课程须知")]),i("div",[i("p",[t._v("1.市场有风险，投资需谨慎。")]),i("p",[t._v("2.本专栏为视频形式，订阅成功后有效期为6个月。")]),i("p",[t._v("3.本专栏为虚拟产品，一经订阅成功概不退款，请您理解。")]),i("p",[t._v("4.如有任何疑问请添加小助理微信号caihuayu-an8,或者电话021-63308189，联系客服咨询。")])])])}],o=(i("99af"),i("4160"),i("b64b"),i("159b"),i("758e")),a=i("a27a"),c=i("bc3a"),r=i.n(c),d=i("1954"),u={components:{PcVideoModal:a["a"],login:d["a"],paymentList:o["a"]},data:function(){return{showOneVideo:!1,curIndex:1,initVideoIndex:-1,videos:[],courses:[],proId:this.$route.query.proId,token:"",bought:!1,loginShow:!1,logins:!1}},mounted:function(){this.inti(),this.getVideoClasses()},methods:{inti:function(){var t=this;r()({method:"post",url:"/userreg/ucenter/queryUserProduct"}).then((function(e){var i=e.data;if(i.code&&200==i.code){t.logins=!0;var s=i.data;if(0==s.length)t.bought=!1;else for(var n=0;n<s.length;n++)if(s[n].id==t.proId||1==s[n].id||2==s[n].id||3==s[n].id){var o=new Date,a=new Date(s[n].date);t.bought=!(a<=o)}}else-1==i.code?(t.bought=!1,t.logins=!1):t.bought=!1}))},playCourse:function(t){if(this.bought||t.tryEnable){var e=-1;this.videos.forEach((function(i,s){t.id==i.id&&(e=s)})),this.bought?this.showOneVideo=!1:this.showOneVideo=!0,this.initVideoIndex=e}},getVideoClasses:function(){var t=this;this.$http.get("/core/api/high_point_video_items/").then((function(e){var i=[],s=[];Object.keys(e.data).forEach((function(t){i.push(e.data[t]),s=s.concat(e.data[t].videos)})),t.courses=i,t.videos=s}))},closePlayVideo:function(){this.initVideoIndex=-1},toBuyP:function(){var t=this;0==this.logins?this.loginShow=!0:setTimeout((function(){t.$refs.paymentList.showPayInfoDialog()}))}}},l=u,v=(i("f926"),i("2877")),h=Object(v["a"])(l,s,n,!1,null,null,null);e["default"]=h.exports},d2b1:function(t,e,i){},f926:function(t,e,i){"use strict";var s=i("d2b1"),n=i.n(s);n.a}}]);