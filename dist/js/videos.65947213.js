(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([["videos"],{"037f":function(t,A,e){"use strict";e("50bf")},"49b4":function(t,A,e){"use strict";e.r(A);var i=function(){var t=this,A=t._self._c;return A("div",{staticClass:"container"},t._l(t.videos,(function(i,s){return A("div",{key:i.id,staticClass:"video-wrapper",on:{click:function(A){return t.playVideo(i.videoUrl)}}},[A("div",{staticClass:"video"},[A("img",{staticClass:"poster",attrs:{src:i.imageUrl}}),A("img",{staticClass:"play",attrs:{src:e("6770")}})]),A("div",{staticClass:"info"},[A("div",{staticClass:"title"},[t._v(t._s(i.title))]),i.subTitle?A("div",{staticClass:"sub-title"},[t._v(t._s(i.subTitle))]):t._e()])])})),0)},s=[],a={name:"Videos",components:{},data(){return{type:this.$route.query.type,videos:[]}},mounted(){this.getVideoLists()},methods:{getVideoLists(){this.$http.get(`/core/api/videos/?strategyType=${this.type}&page_size=1000`).then(t=>{this.videos=t.data.items})}}},r=a,o=(e("037f"),e("2877")),n=Object(o["a"])(r,i,s,!1,null,null,null);A["default"]=n.exports},"50bf":function(t,A,e){},6770:function(t,A){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA0ZJREFUaEPVms2rTVEUwH+L8m3CSBgYKAMyIBGKiUgmChNTHyNKycw/oAwMJP4CXpmg9MhHep5eDDChV+QrEx6R56tnaZ23j+49zr1n733PPeedXXd0915r/fZee6+19j5CCU1V5wLLgKXAQvebBcx04n8CP4CP7vcGeCki33pVL7ECVHU2sApYDSwGQmUp8A54DDwVke8xtoQqRVXnAxuBNcCMGKU5Y34Bj4AhEfkaItMbQFWnARuALSUanrXVQO4AwyLyxwfEC0BVFwB7gUU+Qkvo8x64JCJjRbIKAVR1BbC7ZUMWySzrf9v4l0XkWTeBXQFUdS2wEzD3qaOZG10TkYedlHcEcMbvqsPqHJ1XOkHkAji32VfjzGcZbCUu5rnTfwCqaoHoUA0+X7TYtifOZTd2G4A7Kg9WeNoUGZ39306n861HbBbAAtS2UKkV9x8UkaFU5z8AF2GPRASpTcBm4DVwC7BZ6mezYHcmjditANtdpA1VfgyY5wZZfvPEgQSlBIFKLVJftzEJgEvMzJCY3OZkjnKbpWHgPvA70Dif7ib/tCWAKcA6F7B8Bmf75AGkfb641bBVKbtZgBtJAQ4ASyI1dANIRdq+GAReRerIG/ZWRC6IK0aOR+TzqVAfgMRTActrbgKfSgAxeacMYCWwpweBvgCpiglgBLjnqrQeVDNgADuA9T1ICQVIVY0Dd10h45X759j4wAD2A8trAEhVfgBuAKMRNowawFHACpbYFrsCWX0vgKvA5wBDxgzgBDAnYFDIMRoq1lbjbMCgcQOwGZweMGgqAUxMJYAYF0oA6nahXjZx4kJ1beIyjtFkE1d9jJYZyJJjtKpAZqH/uUslCu97PA+VJJBVkUr0I5kzxiSVsJvlfiVzlk7fdhe4npPq3W0ymUvSRNWy0+l+FzRm9mQ67QB6KWjqKCnN7LaCxu76Y0tKy2S3VljUm/HtJaVbhdii3ttpS+zYXtQ7AHu4iLlWKdEuL1H51yoOorkXWw7ArtGbe7XoIKy4OdzIy93UAxt9vd4CYa8zzXzgyEA084kp407NfORrgbBXG7v8qvKZdUBE7NOErq3wmbUForkP3a1T0NhPDbLr2NiPPfIcss7Pbf4CiwxalroK0BQAAAAASUVORK5CYII="}}]);