(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["loan-success-multi"],{"10f1":function(t,s,a){"use strict";a("c3f1")},"8f1d":function(t,s,a){"use strict";a.r(s);var i=function(){var t=this,s=t._self._c;return s("div",{staticClass:"loan multi"},[s("div",{staticClass:"loan-tips"},[s("m-icon",{staticClass:"icon",attrs:{type:"loan/success",width:122,height:109}}),s("div",{staticClass:"title"},[t._v("Application submitted successfully")]),s("div",{staticClass:"apply",on:{click:t.check}},[t._v("Check Application")])],1),t.loans.length>0?s("div",{staticClass:"other-loans"},t._l(t.loans,(function(a,i){return s("div",{key:a.id,staticClass:"loan-item",class:{active:!a.unChecked},on:{click:function(s){return t.checkLoan(i)}}},[s("img",{attrs:{src:a.icon}}),s("div",{staticClass:"name"},[t._v(t._s(a.productName))]),s("div",{staticClass:"reloan"},[t._v("reloan")]),s("div",{staticClass:"label"},[t._v("Lending Company")]),s("div",{staticClass:"value"},[t._v(t._s(a.companyName))]),s("div",{staticClass:"label"},[t._v("Interest")]),s("div",{staticClass:"value"},[t._v(t._s(a.interest)+"% / Day")]),s("div",{staticClass:"label"},[t._v("Max amount (₹)")]),s("div",{staticClass:"value"},[t._v(t._s(a.amountRange))])])})),0):t._e(),s("div",{staticClass:"bottom-action"},[s("div",{staticClass:"btns"},[s("button",{staticClass:"btn-line",on:{click:t.goHome}},[t._v("Back Home")]),s("button",{staticClass:"btn-default",on:{click:t.applyMulti}},[t._v("Apply Immediately")])]),s("div",{staticClass:"tips color-red"},[t._v("products selected, high pass rate, when apply together")])])])},e=[],l={data(){return{loans:[]}},mounted(){this.getRecommendLoans()},methods:{async getRecommendLoans(){let t=await this.$http.post("/xiaqpdt/wvnryylacuwlol"),s=await this.$http.post("/xiaqpdt/wvnryylacuwloo");this.loans={...t.list,...s.list}},check(){this.toAppMethod("goAllOrders",{})},checkLoan(t){this.$set(this.loans,t,{...this.loans[t],unChecked:!this.loans[t].unChecked})},async applyMulti(){let t=await this.$http.post("/zihai/qvsxvbget/xiyymmst",{orderId:this.$route.query.orderId,productList:this.loans.filter(t=>!t.unChecked).map(t=>t.id)});if(200==t.returnCode){await this.$http.post("/zihai/qvsxvbget/bmzcx",{orderIdList:t.emmivwmlqkf});this.getRecommendLoans()}}}},c=l,n=(a("10f1"),a("e607")),o=Object(n["a"])(c,i,e,!1,null,"5f1acba6",null);s["default"]=o.exports},c3f1:function(t,s,a){}}]);